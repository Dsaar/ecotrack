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
	List,
	ListItemButton,
	ListItemText,
	Tabs,
	Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import { useCommunity } from "../../../app/providers/CommunityProvider.jsx";

// ✅ checkins service (approved completions)
import { getMyCheckins } from "../../../services/checkinService.js";

// ✅ submissions service (pending / rejected)
import { getMySubmissions } from "../../../services/submissionsService.js";

function DashboardActivity() {
	const { user } = useUser();
	const navigate = useNavigate();

	const [checkins, setCheckins] = useState([]);
	const [submissions, setSubmissions] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const { communityData } = useCommunity();
	const myRank = communityData?.myRank?.byPoints;

	// ✅ Tabs: approved (checkins) / pending / rejected
	const [tab, setTab] = useState("approved");

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				setLoading(true);
				setError("");

				// Load BOTH: checkins + submissions
				const [checkinsRes, submissionsRes] = await Promise.all([
					getMyCheckins(),
					getMySubmissions(),
				]);

				// checkins service sometimes returns array or { items }
				const checkinsData = Array.isArray(checkinsRes)
					? checkinsRes
					: checkinsRes?.items || checkinsRes?.data || [];

				// submissions service sometimes returns axios res OR data
				const rawSubs =
					submissionsRes?.data ?? submissionsRes?.items ?? submissionsRes;

				const subsData = Array.isArray(rawSubs)
					? rawSubs
					: rawSubs?.items || [];

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
	// Summary stats (keep yours)
	// -----------------------
	const ecoPoints = user?.points ?? 0;
	const missionsStarted = user?.missions?.length ?? 0;
	const favoritesCount = user?.favorites?.missions?.length ?? 0;

	const completionsCount = checkins.length; // ✅ approved completions

	const pendingSubs = useMemo(
		() => submissions.filter((s) => String(s.status || "").toLowerCase() === "pending"),
		[submissions]
	);

	const rejectedSubs = useMemo(
		() => submissions.filter((s) => String(s.status || "").toLowerCase() === "rejected"),
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
		// support common shapes
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

	if (loading) {
		return <LoadingSpinner fullScreen={false} />;
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1130 }}>
			<Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
				My missions & activity
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
				Your approved completions are recorded as check-ins, including points and impact.
			</Typography>

			{error && (
				<Typography color="error" sx={{ mb: 2 }}>
					{error}
				</Typography>
			)}

			<Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">
				{/* Left: summary stats */}
				<Card sx={{ flex: { xs: "unset", lg: 1.4 }, borderRadius: 2 }}>
					<CardContent>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Summary
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600, color: "#166534" }}>
									{ecoPoints}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Eco points
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{missionsStarted}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Missions started
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{favoritesCount}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Saved missions
								</Typography>
							</Box>

							<Box>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{completionsCount}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Approved completions
								</Typography>
							</Box>

							<Box
								onClick={() => navigate("/dashboard/community")}
								sx={{
									cursor: "pointer",
									borderRadius: 2,
									px: 1.5,
									py: 0.5,
									"&:hover": { bgcolor: "action.hover" },
								}}
							>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{myRank?.rank ? `#${myRank.rank}` : "—"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Community rank of {myRank?.totalUsers ?? "—"}
								</Typography>
							</Box>
						</Stack>

						<Divider sx={{ my: 2 }} />

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<Chip label={`CO₂ saved: ${totals.co2Kg.toFixed(1)} kg`} variant="outlined" />
							<Chip label={`Water saved: ${totals.waterL.toFixed(0)} L`} variant="outlined" />
							<Chip label={`Waste saved: ${totals.wasteKg.toFixed(1)} kg`} variant="outlined" />
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

				{/* Right: tabbed lists */}
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

						{/* ✅ APPROVED: keep your current working checkins list */}
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
									<List dense sx={{ pt: 0 }}>
										{checkins.slice(0, 10).map((c) => {
											const mission = c.missionId || {};
											const title = mission.title || "Mission";
											const category = mission.category || "General";
											const when = c.createdAt
												? new Date(c.createdAt).toLocaleString()
												: "Unknown date";
											const pts = c.points ?? 0;

											return (
												<ListItemButton
													key={c._id}
													onClick={() =>
														mission._id && navigate(`/dashboard/missions/${mission._id}`)
													}
													sx={{ px: 1, py: 0.5, borderRadius: 2 }}
												>
													<ListItemText
														primaryTypographyProps={{
															variant: "body2",
															sx: { display: "flex", justifyContent: "space-between" },
														}}
														primary={
															<>
																<span>
																	{title}
																	<Chip
																		label={category}
																		size="small"
																		sx={{ ml: 1, fontSize: 10 }}
																	/>
																</span>
																<span style={{ display: "flex", gap: 8 }}>
																	<Chip
																		label={`+${pts} pts`}
																		size="small"
																		sx={{
																			fontSize: 10,
																			bgcolor: "#ecfdf3",
																			color: "#166534",
																		}}
																	/>
																	<Chip
																		label="Approved"
																		size="small"
																		color="success"
																		variant="outlined"
																		sx={{ fontSize: 10 }}
																	/>
																</span>
															</>
														}
														secondary={
															<Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
																{when}
															</Typography>
														}
													/>
												</ListItemButton>
											);
										})}
									</List>
								)}
							</>
						)}

						{/* ✅ PENDING */}
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
									<List dense sx={{ pt: 0 }}>
										{pendingSubs.slice(0, 10).map((s) => {
											const mission = s.missionId || {};
											const title = mission.title || "Mission";
											const category = mission.category || "General";
											const when = s.createdAt
												? new Date(s.createdAt).toLocaleString()
												: "Unknown date";

											return (
												<ListItemButton
													key={s._id}
													onClick={() => mission._id && navigate(`/dashboard/missions/${mission._id}`)}
													sx={{ px: 1, py: 0.5, borderRadius: 2 }}
												>
													<ListItemText
														primaryTypographyProps={{
															variant: "body2",
															sx: { display: "flex", justifyContent: "space-between" },
														}}
														primary={
															<>
																<span>
																	{title}
																	<Chip label={category} size="small" sx={{ ml: 1, fontSize: 10 }} />
																</span>
																<Chip
																	label="Pending"
																	size="small"
																	color="warning"
																	variant="outlined"
																	sx={{ fontSize: 10 }}
																/>
															</>
														}
														secondary={
															<Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
																{when}
															</Typography>
														}
													/>
												</ListItemButton>
											);
										})}
									</List>
								)}
							</>
						)}

						{/* ✅ REJECTED (with reason) */}
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
									<List dense sx={{ pt: 0 }}>
										{rejectedSubs.slice(0, 10).map((s) => {
											const mission = s.missionId || {};
											const title = mission.title || "Mission";
											const category = mission.category || "General";
											const when = s.createdAt
												? new Date(s.createdAt).toLocaleString()
												: "Unknown date";
											const reason = getRejectionReason(s).trim();

											return (
												<ListItemButton
													key={s._id}
													onClick={() => mission._id && navigate(`/dashboard/missions/${mission._id}`)}
													sx={{ px: 1, py: 0.75, borderRadius: 2 }}
												>
													<ListItemText
														primaryTypographyProps={{
															variant: "body2",
															sx: { display: "flex", justifyContent: "space-between" },
														}}
														primary={
															<>
																<span>
																	{title}
																	<Chip label={category} size="small" sx={{ ml: 1, fontSize: 10 }} />
																</span>
																<Chip
																	label="Rejected"
																	size="small"
																	color="error"
																	variant="outlined"
																	sx={{ fontSize: 10 }}
																/>
															</>
														}
														secondary={
															<Box sx={{ mt: 0.3 }}>
																<Typography variant="body2" color="text.secondary">
																	{when}
																</Typography>

																<Typography
																	variant="body2"
																	sx={{ mt: 0.5, color: "error.main", fontWeight: 700 }}
																>
																	Reason:{" "}
																	<span style={{ fontWeight: 500 }}>
																		{reason || "No reason provided."}
																	</span>
																</Typography>
															</Box>
														}
													/>
												</ListItemButton>
											);
										})}
									</List>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}

export default DashboardActivity;
