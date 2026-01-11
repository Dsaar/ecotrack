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

function mapJoiDetailsToFieldErrors(details) {
	const fieldErrors = {};
	if (!Array.isArray(details)) return fieldErrors;

	for (const d of details) {
		const key = Array.isArray(d?.path) ? d.path.join(".") : d?.path || "form";
		if (!fieldErrors[key]) fieldErrors[key] = d?.message || "Invalid value";
	}
	return fieldErrors;
}

// Attach token to all requests
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("myToken");
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// ✅ auth cleanup
		if (error.response?.status === 401) {
			console.warn("Unauthorized → clearing token and broadcasting logout");

			localStorage.removeItem("myToken");

			// 🔥 Tell React (UserProvider) to logout too
			window.dispatchEvent(
				new CustomEvent("auth:logout", {
					detail: { reason: "401" },
				})
			);
		}

		// ✅ RATE LIMIT (429) -> show nice snackbar
		if (error.response?.status === 429) {
			// Backend message (your limiter sends { message: "..." })
			const msg =
				error.response?.data?.message ||
				"Too many requests. Please wait and try again.";

			// express-rate-limit usually includes standard headers (draft-8)
			// Retry-After may exist (seconds); RateLimit-Reset is a timestamp (seconds)
			const retryAfter = error.response?.headers?.["retry-after"]; // seconds
			const reset = error.response?.headers?.["ratelimit-reset"]; // seconds since epoch (often)

			window.dispatchEvent(
				new CustomEvent("app:rate-limit", {
					detail: {
						message: msg,
						retryAfter: retryAfter ? Number(retryAfter) : null,
						reset: reset ? Number(reset) : null,
					},
				})
			);
		}

		// ✅ Normalize Joi 400 errors for forms
		if (error.response?.status === 400) {
			const data = error.response?.data;
			if (data?.message === "Validation failed" && Array.isArray(data?.details)) {
				error.userMessage = "Please fix the highlighted fields.";
				error.fieldErrors = mapJoiDetailsToFieldErrors(data.details);
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
