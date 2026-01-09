// client/src/features/dashboard/pages/DashboardActivity.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	Typography,
	Tabs,
	Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import { useCommunity } from "../../../app/providers/CommunityProvider.jsx";

import { getMyCheckins } from "../../../services/checkinService.js";
import { getMySubmissions } from "../../../services/submissionsService.js";

import TonePanel from "../components/TonePanel.jsx";

function DashboardActivity() {
	const { user } = useUser();
	const navigate = useNavigate();

	const [checkins, setCheckins] = useState([]);
	const [submissions, setSubmissions] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const { communityData } = useCommunity();
	const myRank = communityData?.myRank?.byPoints;

	const [tab, setTab] = useState("approved");

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");

				const [checkinsRes, submissionsRes] = await Promise.all([
					getMyCheckins(),
					getMySubmissions(),
				]);

				const checkinsData = Array.isArray(checkinsRes)
					? checkinsRes
					: checkinsRes?.items || checkinsRes?.data || [];

				const rawSubs =
					submissionsRes?.data ?? submissionsRes?.items ?? submissionsRes;

				const subsData = Array.isArray(rawSubs) ? rawSubs : rawSubs?.items || [];

				if (!cancelled) {
					setCheckins(Array.isArray(checkinsData) ? checkinsData : []);
					setSubmissions(Array.isArray(subsData) ? subsData : []);
				}
			} catch (err) {
				console.error("Failed to load activity:", err);
				if (!cancelled) {
					setError(
						err?.response?.data?.message ||
						"Failed to load your activity. Please try again."
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	// -----------------------
	// Summary stats
	// -----------------------
	const ecoPoints = user?.points ?? 0;
	const missionsStarted = user?.missions?.length ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;

	const completionsCount = checkins.length;

	const pendingSubs = useMemo(
		() =>
			submissions.filter(
				(s) => String(s.status || "").toLowerCase() === "pending"
			),
		[submissions]
	);

	const rejectedSubs = useMemo(
		() =>
			submissions.filter(
				(s) => String(s.status || "").toLowerCase() === "rejected"
			),
		[submissions]
	);

	const totals = useMemo(() => {
		return checkins.reduce(
			(acc, c) => {
				acc.points += Number(c.points || 0);
				acc.co2Kg += Number(c.impact?.co2Kg || 0);
				acc.waterL += Number(c.impact?.waterL || 0);
				acc.wasteKg += Number(c.impact?.wasteKg || 0);
				return acc;
			},
			{ points: 0, co2Kg: 0, waterL: 0, wasteKg: 0 }
		);
	}, [checkins]);

	const getRejectionReason = (s) => {
		return (
			s.rejectionReason ||
			s.adminNote ||
			s.moderation?.reason ||
			s.moderationReason ||
			s.reason ||
			s.reviewNote ||
			""
		);
	};

	// -----------------------
	// Helpers for Activity tiles
	// -----------------------
	const Tile = ({
		tone,
		title,
		category,
		when,
		rightChips = null,
		onClick,
		secondary = null,
	}) => {
		return (
			<TonePanel
				tone={tone}
				onClick={onClick}
				sx={{
					width: "100%",
					cursor: onClick ? "pointer" : "default",
					p: 2,
					borderRadius: 3,
					transition: "transform 120ms ease, filter 120ms ease",
					"&:hover": onClick
						? { filter: "brightness(1.03)", transform: "translateY(-1px)" }
						: undefined,
				}}
			>
				<Stack
					direction="row"
					alignItems="flex-start"
					justifyContent="space-between"
					spacing={2}
				>
					<Box sx={{ minWidth: 0 }}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography
								variant="subtitle1"
								sx={{
									fontWeight: 800,
									lineHeight: 1.2,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxWidth: { xs: 220, sm: 360 },
								}}
								title={title}
							>
								{title}
							</Typography>

							{category && (
								<Chip
									label={category}
									size="small"
									sx={{
										fontSize: 11,
										bgcolor: "rgba(255,255,255,0.55)",
										border: "1px solid rgba(0,0,0,0.08)",
									}}
								/>
							)}
						</Stack>

						<Typography variant="body2" sx={{ opacity: 0.85, mt: 0.6 }}>
							{when}
						</Typography>

						{secondary && (
							<Typography variant="body2" sx={{ mt: 0.8, opacity: 0.9 }}>
								{secondary}
							</Typography>
						)}
					</Box>

					{rightChips ? (
						<Stack
							direction="row"
							spacing={1}
							alignItems="center"
							justifyContent="flex-end"
							sx={{ flexShrink: 0 }}
						>
							{rightChips}
						</Stack>
					) : null}
				</Stack>
			</TonePanel>
		);
	};

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box
			sx={(theme) => ({
				p: { xs: 2, md: 3 },
				maxWidth: 1130,
				position: "relative",
				"&:before": {
					content: '""',
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 190,
					borderRadius: 2,
					// if you don't have theme.palette.tones, swap this line to a hardcoded rgba.
					background: theme.palette?.tones?.blue?.bg
						? `linear-gradient(180deg, ${theme.palette.tones.blue.bg} 0%, transparent 75%)`
						: "linear-gradient(180deg, rgba(59,130,246,0.12) 0%, transparent 75%)",
					pointerEvents: "none",
				},
			})}
		>
			<Box sx={{ position: "relative" }}>
				<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
					My missions & activity
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Your approved completions are recorded as check-ins, including points and
					impact.
				</Typography>

				{error && (
					<Typography color="error" sx={{ mb: 2 }}>
						{error}
					</Typography>
				)}

				<Stack
					direction={{ xs: "column", lg: "row" }}
					spacing={3}
					alignItems="stretch"
				>
					{/* Left: summary */}
					<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 2 }}>
						<CardContent>
							<Typography variant="h6" sx={{ mb: 2 }}>
								Summary
							</Typography>

							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								sx={{ mb: 2 }}
							>
								<TonePanel tone="green" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Eco points
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{ecoPoints}
									</Typography>
								</TonePanel>

								<TonePanel tone="blue" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Missions started
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{missionsStarted}
									</Typography>
								</TonePanel>

								<TonePanel tone="indigo" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Saved missions
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{favoritesCount}
									</Typography>
								</TonePanel>

								<TonePanel tone="green" sx={{ flex: 1 }}>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Approved completions
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{completionsCount}
									</Typography>
								</TonePanel>

								<TonePanel
									tone="blue"
									onClick={() => navigate("/dashboard/community")}
									sx={{
										flex: 1,
										cursor: "pointer",
										transition: "transform 120ms ease, filter 120ms ease",
										"&:hover": { filter: "brightness(1.03)", transform: "translateY(-1px)" },
									}}
								>
									<Typography variant="caption" sx={{ opacity: 0.9 }}>
										Community rank
									</Typography>
									<Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
										{myRank?.rank ? `#${myRank.rank}` : "—"}
									</Typography>
									<Typography variant="caption" sx={{ opacity: 0.85 }}>
										of {myRank?.totalUsers ?? "—"}
									</Typography>
								</TonePanel>
							</Stack>

							<Divider sx={{ my: 2 }} />

							<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
								<Chip
									label={`CO₂ saved: ${totals.co2Kg.toFixed(1)} kg`}
									variant="outlined"
								/>
								<Chip
									label={`Water saved: ${totals.waterL.toFixed(0)} L`}
									variant="outlined"
								/>
								<Chip
									label={`Waste saved: ${totals.wasteKg.toFixed(1)} kg`}
									variant="outlined"
								/>
							</Stack>

							<Divider sx={{ my: 2 }} />

							<Stack direction="row" spacing={1.5} flexWrap="wrap">
								<Chip label={`Pending: ${pendingSubs.length}`} variant="outlined" />
								<Chip label={`Rejected: ${rejectedSubs.length}`} variant="outlined" />
							</Stack>

							<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
								Check-ins are created automatically when an admin approves your submission.
							</Typography>
						</CardContent>
					</Card>

					{/* Right: Activity */}
					<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 2 }}>
						<CardContent>
							<Typography variant="h6" sx={{ mb: 1 }}>
								Activity
							</Typography>

							<Tabs
								value={tab}
								onChange={(_e, v) => setTab(v)}
								variant="scrollable"
								scrollButtons="auto"
								sx={{
									mb: 2,
									"& .MuiTab-root": { textTransform: "none", fontWeight: 700 },
								}}
							>
								<Tab value="approved" label={`Approved (${checkins.length})`} />
								<Tab value="pending" label={`Pending (${pendingSubs.length})`} />
								<Tab value="rejected" label={`Rejected (${rejectedSubs.length})`} />
							</Tabs>

							{/* ✅ APPROVED (TonePanel tiles) */}
							{tab === "approved" && (
								<>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Recent check-ins (approved)
									</Typography>

									{checkins.length === 0 ? (
										<Typography variant="body2" color="text.secondary">
											No approved missions yet. Once a submission is approved, it will appear here.
										</Typography>
									) : (
										<Stack spacing={1.5}>
											{checkins.slice(0, 10).map((c) => {
												const mission = c.missionId || {};
												const title = mission.title || "Mission";
												const category = mission.category || "General";
												const when = c.createdAt
													? new Date(c.createdAt).toLocaleString()
													: "Unknown date";
												const pts = c.points ?? 0;

												return (
													<Tile
														key={c._id}
														tone="green"
														title={title}
														category={category}
														when={when}
														onClick={() =>
															mission._id && navigate(`/dashboard/missions/${mission._id}`)
														}
														rightChips={
															<>
																<Chip
																	label={`+${pts} pts`}
																	size="small"
																	sx={{
																		fontSize: 11,
																		bgcolor: "rgba(255,255,255,0.55)",
																		border: "1px solid rgba(0,0,0,0.08)",
																	}}
																/>
																<Chip
																	label="Approved"
																	size="small"
																	variant="outlined"
																	color="success"
																	sx={{ fontSize: 11, bgcolor: "rgba(255,255,255,0.35)" }}
																/>
															</>
														}
													/>
												);
											})}
										</Stack>
									)}
								</>
							)}

							{/* ✅ PENDING (TonePanel tiles) */}
							{tab === "pending" && (
								<>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Submissions waiting for review
									</Typography>

									{pendingSubs.length === 0 ? (
										<Typography variant="body2" color="text.secondary">
											No pending submissions right now.
										</Typography>
									) : (
										<Stack spacing={1.5}>
											{pendingSubs.slice(0, 10).map((s) => {
												const mission = s.missionId || {};
												const title = mission.title || "Mission";
												const category = mission.category || "General";
												const when = s.createdAt
													? new Date(s.createdAt).toLocaleString()
													: "Unknown date";

												return (
													<Tile
														key={s._id}
														tone="amber"
														title={title}
														category={category}
														when={when}
														onClick={() =>
															mission._id && navigate(`/dashboard/missions/${mission._id}`)
														}
														rightChips={
															<Chip
																label="Pending"
																size="small"
																variant="outlined"
																color="warning"
																sx={{ fontSize: 11, bgcolor: "rgba(255,255,255,0.35)" }}
															/>
														}
													/>
												);
											})}
										</Stack>
									)}
								</>
							)}

							{/* ✅ REJECTED (TonePanel tiles) */}
							{tab === "rejected" && (
								<>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Rejected submissions (with reason)
									</Typography>

									{rejectedSubs.length === 0 ? (
										<Typography variant="body2" color="text.secondary">
											No rejected submissions. Nice 👌
										</Typography>
									) : (
										<Stack spacing={1.5}>
											{rejectedSubs.slice(0, 10).map((s) => {
												const mission = s.missionId || {};
												const title = mission.title || "Mission";
												const category = mission.category || "General";
												const when = s.createdAt
													? new Date(s.createdAt).toLocaleString()
													: "Unknown date";
												const reason = getRejectionReason(s).trim();

												return (
													<Tile
														key={s._id}
														tone="rejected"
														title={title}
														category={category}
														when={when}
														onClick={() =>
															mission._id && navigate(`/dashboard/missions/${mission._id}`)
														}
														secondary={
															<Box>
																<Typography
																	variant="body2"
																	sx={{ fontWeight: 800, opacity: 0.95 }}
																>
																	Reason:
																</Typography>
																<Typography variant="body2" sx={{ opacity: 0.9 }}>
																	{reason || "No reason provided."}
																</Typography>
															</Box>
														}
														rightChips={
															<Chip
																label="Rejected"
																size="small"
																variant="outlined"
																color="error"
																sx={{ fontSize: 11, bgcolor: "rgba(255,255,255,0.35)" }}
															/>
														}
													/>
												);
											})}
										</Stack>
									)}
								</>
							)}
						</CardContent>
					</Card>
				</Stack>
			</Box>
		</Box>
	);
}

export default DashboardActivity;
