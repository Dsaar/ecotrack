// src/services/apiClient.js
import axios from "axios";

// IMPORTANT: baseURL already includes /api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

const apiClient = axios.create({
	baseURL: BASE_URL,
	withCredentials: false,
	headers: {
		"Content-Type": "application/json",
	},
});

/**
 * Turn backend Joi error format into a simple field -> message map
 * Expected backend shape:
 * { message: "Validation failed", details: [{ message, path, ... }, ...] }
 */
function mapJoiDetailsToFieldErrors(details) {
	const fieldErrors = {};
	if (!Array.isArray(details)) return fieldErrors;

	for (const d of details) {
		const key = Array.isArray(d?.path) ? d.path.join(".") : d?.path || "form";
		// keep first error per field (or overwrite if you prefer)
		if (!fieldErrors[key]) fieldErrors[key] = d?.message || "Invalid value";
	}
	return fieldErrors;
}

// Attach token to all requests
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// auth cleanup
		if (error.response?.status === 401) {
			console.warn("Unauthorized → clearing token");
			localStorage.removeItem("token");
		}

		// ✅ Normalize Joi 400 errors for forms
		if (error.response?.status === 400) {
			const data = error.response?.data;

			// Your backend validate middleware returns: { message, details }
			if (data?.message === "Validation failed" && Array.isArray(data?.details)) {
				error.userMessage = "Please fix the highlighted fields.";
				error.fieldErrors = mapJoiDetailsToFieldErrors(data.details);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
