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
} from "@mui/material";
import { getSocket } from "../../../services/socket.js";
import { useUser } from "../../../app/providers/UserProvider.jsx";

export default function ChatPage() {
	const { user } = useUser();
	const myId = user?.id || user?._id;

	const socket = useMemo(() => getSocket(), []);
	const [online, setOnline] = useState([]);
	const [activeUser, setActiveUser] = useState(null);

	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");

	const bottomRef = useRef(null);

	useEffect(() => {
		// ✅ listeners
		socket.on("presence:online", (list) => setOnline(Array.isArray(list) ? list : []));
		socket.on("chat:history", (msgs) => setMessages(Array.isArray(msgs) ? msgs : []));
		socket.on("chat:message", (msg) => setMessages((prev) => [...prev, msg]));
		socket.on("chat:error", (e) => console.error("[chat:error]", e));

		// ✅ NEW: ask server for online list AFTER listeners exist
		socket.emit("presence:sync");

		return () => {
			socket.off("presence:online");
			socket.off("chat:history");
			socket.off("chat:message");
			socket.off("chat:error");
		};
	}, [socket]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]); 

	const startChat = (u) => {
		setActiveUser(u);
		setMessages([]);
		socket.emit("chat:history", { withUserId: u.id, limit: 50 });
	};

	const send = () => {
		if (!activeUser?.id || !text.trim()) return;
		socket.emit("chat:send", { toUserId: activeUser.id, content: text.trim() });
		setText("");
	};

	const onlineOthers = online.filter((u) => String(u.id) !== String(myId));

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
				Chat
			</Typography>

			<Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
				{/* Online users */}
				<Card sx={{ width: { xs: "100%", md: 320 }, borderRadius: 2 }}>
					<CardContent>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
							Online
						</Typography>

						{onlineOthers.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								No one is online.
							</Typography>
						) : (
							<List dense>
								{onlineOthers.map((u) => (
									<ListItemButton
										key={u.id}
										selected={activeUser?.id === u.id}
										onClick={() => startChat(u)}
									>
										<Stack>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{u?.name?.first ? `${u.name.first} ${u.name.last || ""}` : u.email}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{u.email}
											</Typography>
										</Stack>
									</ListItemButton>
								))}
							</List>
						)}
					</CardContent>
				</Card>

				{/* Messages */}
				<Card sx={{ flex: 1, borderRadius: 2 }}>
					<CardContent sx={{ display: "flex", flexDirection: "column", height: { xs: 520, md: 620 } }}>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							{activeUser ? `Chat with ${activeUser?.name?.first || activeUser.email}` : "Select a user"}
						</Typography>

						<Divider sx={{ my: 2 }} />

						<Box sx={{ flex: 1, overflowY: "auto", px: 0.5 }}>
							{messages.map((m) => {
								const mine = String(m.senderId) === String(myId);

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
												bgcolor: mine ? "#6df99eff" : "#8eb6eaff",
											}}
										>
											<Typography variant="body2">{m.content}</Typography>
											<Typography
												variant="caption"
												sx={{
													display: "block",
													mt: 0.5,
													opacity: 0.7,
													textAlign: "right",
												}}
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
							<Button
								variant="contained"
								onClick={send}
								disabled={!activeUser || !text.trim()}
								sx={{ textTransform: "none" }}
							>
								Send
							</Button>
						</Stack>
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}
