import axios from "axios";

const api = axios.create({
    baseURL: "https://labmentix-project1-perplexity-drive.onrender.com/api",
    withCredentials: true
});

export default api;