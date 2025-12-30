import { useEffect, useMemo, useRef, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
	List,
	ListItemButton,
	TextField,
	Button,
	Divider,
	Avatar,
	Chip,
} from "@mui/material";
import { getSocket } from "../../../services/socket.js";
import { useUser } from "../../../app/providers/UserProvider.jsx";

function idOf(v) {
	// Handles: "abc", ObjectId-like, populated objects { _id }, etc.
	if (!v) return "";
	if (typeof v === "string") return v;
	if (typeof v === "object") return String(v._id || v.id || "");
	return String(v);
}

export default function ChatPage() {
	const { user } = useUser();
	const myId = idOf(user?.id || user?._id);

	const socket = useMemo(() => getSocket(), []);
	const [online, setOnline] = useState([]);
	const [activeUser, setActiveUser] = useState(null);

	// ✅ store messages per conversation (keyed by other userId)
	const [messagesByUser, setMessagesByUser] = useState({}); // { [otherUserId]: [] }
	const [text, setText] = useState("");
	const [unreadByUser, setUnreadByUser] = useState({}); // { userId: number }

	const bottomRef = useRef(null);

	const activeId = activeUser?.id ? String(activeUser.id) : "";
	const messages = activeId ? messagesByUser[activeId] || [] : [];

	useEffect(() => {
		const onPresence = (list) => setOnline(Array.isArray(list) ? list : []);

		const onHistory = (msgs) => {
			// history is always "me <-> activeUser"
			if (!activeId) return;
			const safe = Array.isArray(msgs) ? msgs : [];
			setMessagesByUser((prev) => ({
				...prev,
				[activeId]: safe,
			}));
		};

		const onMessage = (msg) => {
			const senderId = idOf(msg?.senderId);
			const receiverId = idOf(msg?.receiverId);

			if (!senderId || !receiverId || !myId) return;

			// ✅ determine which conversation bucket this message belongs to
			// if I sent it -> other is receiver
			// if I received it -> other is sender
			const otherUserId = senderId === myId ? receiverId : senderId;

			// ✅ append ONLY into that user's thread
			setMessagesByUser((prev) => {
				const prevThread = prev[otherUserId] || [];
				return {
					...prev,
					[otherUserId]: [...prevThread, msg],
				};
			});

			// ✅ unread: count only incoming messages, and only if not currently active chat
			const isIncoming = receiverId === myId;
			const isActiveThread = otherUserId === activeId;

			if (isIncoming && !isActiveThread) {
				setUnreadByUser((prev) => ({
					...prev,
					[otherUserId]: (prev[otherUserId] || 0) + 1,
				}));
			}
		};

		const onError = (e) => console.error("[chat:error]", e);

		socket.on("presence:online", onPresence);
		socket.on("chat:history", onHistory);
		socket.on("chat:message", onMessage);
		socket.on("chat:error", onError);

		// ask server to send online list
		socket.emit("presence:sync");

		return () => {
			socket.off("presence:online", onPresence);
			socket.off("chat:history", onHistory);
			socket.off("chat:message", onMessage);
			socket.off("chat:error", onError);
		};
	}, [socket, myId, activeId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, activeId]);

	const startChat = (u) => {
		const uid = String(u.id);
		setActiveUser(u);

		// ✅ clear unread for this user
		setUnreadByUser((prev) => ({ ...prev, [uid]: 0 }));

		// ✅ request history
		socket.emit("chat:history", { withUserId: uid, limit: 50 });

		// ✅ optional seen
		socket.emit("chat:seen", { withUserId: uid });
	};

	const send = () => {
		if (!activeUser?.id || !text.trim()) return;
		socket.emit("chat:send", { toUserId: String(activeUser.id), content: text.trim() });
		setText("");
	};

	const onlineOthers = online.filter((u) => String(u.id) !== String(myId));

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
				Chat
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Chat with other users who are currently online. Select a user to start a conversation and exchange messages in real time.
			</Typography>


			<Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
				{/* Online users */}
				<Card sx={{ width: { xs: "100%", md: 320 }, borderRadius: 2 }}>
					<CardContent>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
							Online
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							{onlineOthers.length} user{onlineOthers.length === 1 ? "" : "s"} online
						</Typography>


						{onlineOthers.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								No one is online.
							</Typography>
						) : (
							<List dense>
								{onlineOthers.map((u) => {
									const uid = String(u.id);
									return (
										<ListItemButton
											key={uid}
											selected={activeUser?.id === u.id}
											onClick={() => startChat(u)}
										>
											<Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
												<Avatar
													src={u.avatarUrl?.url || u.avatarUrl || undefined}
													alt={u?.name?.first || u.email}
													sx={{ width: 36, height: 36 }}
												/>

												<Stack sx={{ flex: 1, minWidth: 0 }}>
													<Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
														{u?.name?.first ? `${u.name.first} ${u.name.last || ""}` : u.email}
													</Typography>
													<Typography variant="caption" color="text.secondary" noWrap>
														{u.email}
													</Typography>
												</Stack>

												{!!unreadByUser[uid] && (
													<Chip size="small" label={unreadByUser[uid]} sx={{ fontWeight: 700 }} />
												)}
											</Stack>
										</ListItemButton>
									);
								})}
							</List>
						)}
					</CardContent>
				</Card>

				{/* Messages */}
				<Card sx={{ flex: 1, borderRadius: 2 }}>
					<CardContent sx={{ display: "flex", flexDirection: "column", height: { xs: 520, md: 620 } }}>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							{activeUser ? (
								<Stack direction="row" spacing={1.5} alignItems="center">
									<Avatar
										src={activeUser.avatarUrl?.url || activeUser.avatarUrl || undefined}
										alt={activeUser?.name?.first || activeUser.email}
										sx={{ width: 32, height: 32 }}
									/>
									<span>Chat with {activeUser?.name?.first || activeUser.email}</span>
								</Stack>
							) : (
								"Select a user"
							)}
						</Typography>

						<Divider sx={{ my: 2 }} />

						<Box sx={{ flex: 1, overflowY: "auto", px: 0.5 }}>
							{messages.map((m) => {
								const mine = idOf(m.senderId) === myId;
								return (
									<Box
										key={m._id}
										sx={{
											display: "flex",
											justifyContent: mine ? "flex-end" : "flex-start",
											mb: 1,
										}}
									>
										<Box
											sx={{
												maxWidth: "75%",
												p: 1.25,
												borderRadius: 1,
												bgcolor: mine ? "#2ec061ff" : "#8eb6eaff",
											}}
										>
											<Typography variant="body2">{m.content}</Typography>
											<Typography
												variant="caption"
												sx={{ display: "block", mt: 0.5, opacity: 0.7, textAlign: "right" }}
											>
												{new Date(m.createdAt).toLocaleString()}
											</Typography>
										</Box>
									</Box>
								);
							})}
							<div ref={bottomRef} />
						</Box>

						<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
							<TextField
								value={text}
								onChange={(e) => setText(e.target.value)}
								placeholder={activeUser ? "Type a message…" : "Select a user first"}
								fullWidth
								disabled={!activeUser}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										send();
									}
								}}
							/>
							<Button variant="contained" onClick={send} disabled={!activeUser || !text.trim()} sx={{ textTransform: "none" }}>
								Send
							</Button>
						</Stack>
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}
