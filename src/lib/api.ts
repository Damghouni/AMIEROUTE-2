import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from "axios";

import { ApiResponse } from "@/types";


// ===============================
// BASE URL
// ===============================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";


// ===============================
// Cookie Helper
// ===============================

function getCookie(name: string): string | null {

  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match ? match[2] : null;
}


// ===============================
// Axios Instance
// ===============================

const api: AxiosInstance = axios.create({

  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,

  timeout: 10000,

});


// ===============================
// Request Interceptor
// ===============================

api.interceptors.request.use(

  (config: InternalAxiosRequestConfig) => {

    const token = getCookie("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// ===============================
// Response Interceptor
// ===============================

api.interceptors.response.use(

  (response) => {

    return response;

  },


  (error: AxiosError) => {


    if (error.response) {


      switch(error.response.status) {


        case 401:

          console.log(
            "Unauthorized - login required"
          );

          break;


        case 403:

          console.log(
            "Forbidden"
          );

          break;


        case 500:

          console.log(
            "Server error"
          );

          break;


      }

    }


    return Promise.reject(error);

  }

);



export default api;