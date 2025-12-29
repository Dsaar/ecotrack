import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
	if (socket) return socket;

	// You already return token from auth; store it in localStorage or your UserProvider.
	const token = localStorage.getItem("token"); // adjust to your project

	socket = io("http://localhost:5050", {
		auth: { token },
		transports: ["websocket"],
	});

	return socket;
}

export function disconnectSocket() {
	if (socket) socket.disconnect();
	socket = null;
}
