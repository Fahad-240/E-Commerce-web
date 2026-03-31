
import axios from "axios";

const baseURL =
    import.meta.env.VITE_API_URL?.trim() || "https://e-commerce-web-production-89a1.up.railway.app/api/v1";

const api = axios.create({
    baseURL,
    withCredentials: true,
});

export default api;
