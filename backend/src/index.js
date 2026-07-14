const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS origins (allow multiple ports for development)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',').map((origin) => origin.trim()) : []),
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools requests with no origin header.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Augmenter la limite de taille pour les images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user-specific room
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join store room (for merchants)
  socket.on('join_store', (storeId) => {
    socket.join(`store_${storeId}`);
    console.log(`Store ${storeId} joined their room`);
  });

  // Join driver room
  socket.on('join_driver', (driverId) => {
    socket.join(`driver_${driverId}`);
    console.log(`Driver ${driverId} joined their room`);
  });

  // Join order room (for tracking)
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Client joined order room: ${orderId}`);
  });

  // Driver location update
  socket.on('driver_location', (data) => {
    io.to(`order_${data.orderId}`).emit('driver_location_updated', data);
  });

  // Driver updates order status
  socket.on('order:update', (data) => {
    const { orderId, status } = data;
    console.log(`Order ${orderId} status updated to: ${status}`);
    
    // Emit to everyone tracking this order
    io.to(`order_${orderId}`).emit('order:status', { orderId, status });
    io.to(`order_${orderId}`).emit('order:updated', { orderId, status });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to emit order events (used by routes)
const emitOrderUpdated = (orderId, data) => {
  io.to(`order_${orderId}`).emit('order:updated', { orderId, ...data });
};

const emitOrderAssigned = (orderId, driverId) => {
  io.to(`order_${orderId}`).emit('order:assigned', { orderId, driverId });
};

const emitNewOrder = (storeId, orderData) => {
  io.to(`store_${storeId}`).emit('order:new', orderData);
};

// Make emit functions accessible
app.set('emitOrderUpdated', emitOrderUpdated);
app.set('emitOrderAssigned', emitOrderAssigned);
app.set('emitNewOrder', emitNewOrder);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
