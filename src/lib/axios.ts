import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://be-social-media-api-production.up.railway.app/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});