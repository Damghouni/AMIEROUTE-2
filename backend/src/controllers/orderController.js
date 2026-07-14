const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');


// @desc Get all orders
// @route GET /api/orders
const getOrders = async (req, res, next) => {
  try {

    const { status, page = 1, limit = 10 } = req.query;

    let query = {};


    if (req.user.role === 'client') {
      query.client = req.user._id;

    } else if (req.user.role === 'driver') {
      query.driver = req.user._id;

    } else if (req.user.role === 'merchant') {

      const Store = require('../models/Store');

      const stores = await Store.find({
        owner: req.user._id
      }).select('_id');


      query.store = {
        $in: stores.map(s => s._id)
      };
    }


    if (status) {
      query.status = status;
    }


    const orders = await Order.find(query)
      .populate('client', 'name email phone')
      .populate('store', 'name address phone')
      .populate('driver', 'name phone')
      .populate('items.product', 'name image')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });



    const total = await Order.countDocuments(query);



    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });


  } catch(error) {
    next(error);
  }
};




// @desc Get single order
// @route GET /api/orders/:id

const getOrder = async (req,res,next)=>{

try {

const order = await Order.findById(req.params.id)
.populate('client','name email phone')
.populate('store','name address phone')
.populate('driver','name phone avatar')
.populate('items.product','name image price');


if(!order){

return res.status(404).json({
success:false,
message:'Order not found'
});

}



res.json({
success:true,
data:order
});


}catch(error){
next(error);
}

};





// @desc Create order
// @route POST /api/orders

const createOrder = async(req,res,next)=>{

try {


const errors = validationResult(req);


if(!errors.isEmpty()){

return res.status(400).json({
success:false,
errors:errors.array()
});

}



const {
store,
items,
deliveryAddress,
paymentMethod,
notes,
tip
}=req.body;



let subtotal = 0;

const orderItems=[];



for(const item of items){


const product =
await Product.findById(item.product);



if(!product){

return res.status(404).json({
success:false,
message:`Product not found ${item.product}`
});

}



let itemPrice =
product.discountPrice || product.price;



if(item.options){

for(const option of item.options){

itemPrice += option.priceModifier || 0;

}

}



subtotal += itemPrice * item.quantity;



orderItems.push({

product:product._id,

name:product.name,

price:itemPrice,

quantity:item.quantity,

options:item.options

});


}



const Store = require('../models/Store');


const storeData =
await Store.findById(store);



const deliveryFee =
storeData?.deliveryFee || 0;



const serviceFee =
Math.round(subtotal * 0.05 * 100) / 100;



const total =
subtotal +
deliveryFee +
serviceFee +
(tip || 0);




const order = await Order.create({

client:req.user._id,

store,

items:orderItems,

deliveryAddress,

subtotal,

deliveryFee,

serviceFee,

tip:tip || 0,

total,

paymentMethod,

notes,

status:'pending',

statusHistory:[
{
status:'pending',
timestamp:new Date()
}
]

});




const populatedOrder =
await Order.findById(order._id)
.populate('store','name address phone')
.populate('items.product','name image');





// Socket -> Merchant

if(req.io){

req.io
.to(`store_${store}`)
.emit(
'order:new',
populatedOrder
);

}



res.status(201).json({

success:true,

data:populatedOrder

});



}catch(error){

next(error);

}

};







// @desc Update order status
// @route PUT /api/orders/:id/status


const updateOrderStatus = async(req,res,next)=>{

try {


const {
status,
note
}=req.body;



const order =
await Order.findById(req.params.id);



if(!order){

return res.status(404).json({

success:false,

message:'Order not found'

});

}



order.status=status;


order.statusHistory.push({

status,

timestamp:new Date(),

note

});



if(status==='delivered'){

order.actualDelivery=new Date();

}



await order.save();



const updatedOrder =
await Order.findById(order._id)
.populate('client','name email phone')
.populate('store','name')
.populate('driver','name phone');





// Socket -> Client

if(req.io){


req.io
.to(`order_${order._id}`)
.emit(
'order:updated',
updatedOrder
);



req.io
.to(`user_${order.client}`)
.emit(
'order:updated',
updatedOrder
);



}



res.json({

success:true,

data:updatedOrder

});



}catch(error){

next(error);

}

};








// Assign driver

const assignDriver = async(req,res,next)=>{


try{


const {
driverId
}=req.body;



const order =
await Order.findByIdAndUpdate(

req.params.id,

{

driver:driverId,

$push:{

statusHistory:{

status:'driver_assigned',

timestamp:new Date()

}

}

},

{
new:true
}

)
.populate('driver','name phone');




if(!order){

return res.status(404).json({

success:false,

message:'Order not found'

});

}




if(req.io){

req.io
.to(`driver_${driverId}`)
.emit(
'order:assigned',
order
);

}



res.json({

success:true,

data:order

});



}catch(error){

next(error);

}

};








// Rate order

const rateOrder = async(req,res,next)=>{


try{


const {
storeRating,
driverRating,
comment
}=req.body;



const order =
await Order.findById(req.params.id);



if(!order){

return res.status(404).json({

success:false,

message:'Order not found'

});

}



order.rating={

store:storeRating,

driver:driverRating,

comment

};



await order.save();



res.json({

success:true,

data:order

});



}catch(error){

next(error);

}

};





module.exports = {

getOrders,

getOrder,

createOrder,

updateOrderStatus,

assignDriver,

rateOrder

};