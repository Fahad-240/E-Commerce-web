
import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_URL?.trim() ||
    (window.location.protocol === "http:" ? "http://localhost:5004/api/v1" : "/api/v1");

const api = axios.create({
    baseURL,
    withCredentials: true,
});

export default api;
