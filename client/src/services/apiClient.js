// src/services/apiClient.js
import axios from "axios";

// IMPORTANT: baseURL already includes /api
const BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

const apiClient = axios.create({
	baseURL: BASE_URL,
	withCredentials: false,
	headers: {
		"Content-Type": "application/json",
	},
});

// Attach token to all requests
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.warn("Unauthorized → clearing token");
			localStorage.removeItem("token");
		}
		return Promise.reject(error);
	}
);

export default apiClient;
