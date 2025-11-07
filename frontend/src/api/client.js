import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default client;
