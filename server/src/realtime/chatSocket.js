// server/src/realtime/chatSocket.js
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import ChatMessage from "../models/ChatMessage.js";

const onlineUsers = new Map(); // userId -> { socketId, name, email, isAdmin, lastSeen }

function safeUser(u) {
	return {
		id: String(u._id),
		name: u.name,
		email: u.email,
		isAdmin: !!u.isAdmin,
	};
}

// ✅ NEW: central helper so we always build the same online list
function onlineList() {
	return Array.from(onlineUsers.values());
}

function broadcastOnline(io) {
	// ✅ UPDATED: use the helper
	io.emit("presence:online", onlineList());
}

export function registerChatSockets(io) {
	io.on("connection", async (socket) => {
		// client should pass token in socket.handshake.auth.token
		const token = socket.handshake?.auth?.token;

		if (!token) {
			socket.emit("chat:error", { message: "Missing auth token" });
			socket.disconnect(true);
			return;
		}

		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET);
			const userId = payload.sub;

			const user = await User.findById(userId).select("name email isAdmin");
			if (!user) {
				socket.emit("chat:error", { message: "User not found" });
				socket.disconnect(true);
				return;
			}

			// attach to socket
			socket.data.userId = String(user._id);

			// mark online
			onlineUsers.set(String(user._id), {
				socketId: socket.id,
				...safeUser(user),
				lastSeen: new Date().toISOString(),
			});

			// ✅ NEW: send online list to THIS socket immediately
			socket.emit("presence:online", onlineList());

			// ✅ existing: broadcast to everyone
			broadcastOnline(io);

			// ✅ NEW: allow client to request online list after listeners are attached
			socket.on("presence:sync", () => {
				socket.emit("presence:online", onlineList());
			});

			// user wants message history with someone
			socket.on("chat:history", async ({ withUserId, limit = 30 }) => {
				if (!withUserId) return;

				const me = socket.data.userId;

				const msgs = await ChatMessage.find({
					$or: [
						{ senderId: me, receiverId: withUserId },
						{ senderId: withUserId, receiverId: me },
					],
				})
					.sort({ createdAt: -1 })
					.limit(Math.min(100, limit))
					.lean();

				socket.emit("chat:history", msgs.reverse());
			});

			// send message to another user
			socket.on("chat:send", async ({ toUserId, content }) => {
				const fromUserId = socket.data.userId;
				if (!toUserId || !content?.trim()) return;

				// persist
				const doc = await ChatMessage.create({
					senderId: fromUserId,
					receiverId: toUserId,
					content: content.trim(),
				});

				// emit to sender
				socket.emit("chat:message", doc);

				// emit to receiver if online
				const target = onlineUsers.get(String(toUserId));
				if (target?.socketId) {
					io.to(target.socketId).emit("chat:message", doc);
				}
			});

			socket.on("disconnect", () => {
				const uid = socket.data.userId;
				if (uid) onlineUsers.delete(uid);
				broadcastOnline(io);
			});
		} catch (err) {
			socket.emit("chat:error", { message: "Invalid auth token" });
			socket.disconnect(true);
		}
	});
}
