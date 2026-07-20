import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "/api/v1",
  withCredentials: true,
});