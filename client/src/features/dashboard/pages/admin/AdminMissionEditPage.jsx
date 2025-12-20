// src/features/dashboard/pages/admin/AdminMissionEditPage.jsx
import { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Stack,
	TextField,
	MenuItem,
	Switch,
	FormControlLabel,
	Button,
	CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { getMissionById, updateMission } from "../../../../services/missionsService.js";

const CATEGORIES = ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function AdminMissionEditPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [form, setForm] = useState({
		title: "",
		slug: "",
		summary: "",
		description: "",
		category: "Home",
		difficulty: "Easy",
		duration: "15 min",
		points: 10,
		tags: "",
		imageUrl: "",
		requiresSubmission: true,
		isPublished: true,
	});

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				setLoading(true);
				const m = await getMissionById(id);

				if (cancelled) return;

				setForm({
					title: m?.title || "",
					slug: m?.slug || "",
					summary: m?.summary || "",
					description: m?.description || "",
					category: m?.category || "Home",
					difficulty: m?.difficulty || "Easy",
					duration: m?.duration || "15 min",
					points: m?.points ?? 10,
					tags: Array.isArray(m?.tags) ? m.tags.join(", ") : "",
					imageUrl: m?.imageUrl || "",
					requiresSubmission: m?.requiresSubmission ?? true,
					isPublished: m?.isPublished ?? true,
				});
			} catch (err) {
				console.error("[AdminMissionEditPage] load failed", err);
				showError?.(err?.response?.data?.message || "Failed to load mission.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [id, showError]);

	const onChange = (key) => (e) => {
		const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		try {
			setSaving(true);

			const payload = {
				...form,
				// convert tags string → array
				tags: form.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),
				// points should be a number
				points: Number(form.points) || 0,
			};

			await updateMission(id, payload);

			showSuccess?.("Mission updated.");
			navigate("/dashboard/missions");
		} catch (err) {
			console.error("[AdminMissionEditPage] save failed", err);
			showError?.(err?.response?.data?.message || "Failed to update mission.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
				Edit mission
			</Typography>

			<Card sx={{ borderRadius: 2 }}>
				<CardContent>
					<Stack spacing={2}>
						<TextField label="Title" value={form.title} onChange={onChange("title")} fullWidth />
						<TextField label="Slug" value={form.slug} onChange={onChange("slug")} fullWidth />

						<TextField
							label="Summary"
							value={form.summary}
							onChange={onChange("summary")}
							fullWidth
							multiline
							minRows={2}
						/>

						<TextField
							label="Description"
							value={form.description}
							onChange={onChange("description")}
							fullWidth
							multiline
							minRows={4}
						/>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField select label="Category" value={form.category} onChange={onChange("category")} fullWidth>
								{CATEGORIES.map((c) => (
									<MenuItem key={c} value={c}>{c}</MenuItem>
								))}
							</TextField>

							<TextField select label="Difficulty" value={form.difficulty} onChange={onChange("difficulty")} fullWidth>
								{DIFFICULTIES.map((d) => (
									<MenuItem key={d} value={d}>{d}</MenuItem>
								))}
							</TextField>
						</Stack>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField label="Duration" value={form.duration} onChange={onChange("duration")} fullWidth />
							<TextField
								label="Points"
								type="number"
								value={form.points}
								onChange={onChange("points")}
								fullWidth
							/>
						</Stack>

						<TextField
							label="Tags (comma-separated)"
							value={form.tags}
							onChange={onChange("tags")}
							fullWidth
						/>

						<TextField
							label="Image URL"
							value={form.imageUrl}
							onChange={onChange("imageUrl")}
							fullWidth
							helperText="Paste a public image URL (optional)."
						/>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<FormControlLabel
								control={<Switch checked={form.requiresSubmission} onChange={onChange("requiresSubmission")} />}
								label="Requires submission"
							/>
							<FormControlLabel
								control={<Switch checked={form.isPublished} onChange={onChange("isPublished")} />}
								label="Published"
							/>
						</Stack>

						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<Button onClick={() => navigate(-1)} sx={{ textTransform: "none" }}>
								Cancel
							</Button>
							<Button
								variant="contained"
								onClick={handleSave}
								disabled={saving}
								sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
							>
								{saving ? "Saving..." : "Save changes"}
							</Button>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
