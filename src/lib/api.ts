import useInterServerModal from "@/store/internalserver";
import axios from "axios";

const api = axios.create({
  baseURL:
    window.location.hostname == "localhost"
      ? "http://localhost:3030/api"
      : "https://api.dev.rellitel.ink/api", // Your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    // You can add other default headers here
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (
        (error.response.status === 401) ||
        (error.response.status === 403)
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        const toggleModal = useInterServerModal.getState().toggleModal
        toggleModal()
      }
    } else {
      alert("Server errro")
    }
    return Promise.reject(error);
  }
);

export default api;
