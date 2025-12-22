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
	Divider,
	IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";
import { getMissionById, updateMission } from "../../../../services/missionsService.js";

const CATEGORIES = ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const FIELD_TYPES = ["text", "number", "select", "url", "file"];

const emptyField = () => ({
	key: "",
	label: "",
	type: "text",
	required: true,
	options: [],
});

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
		tagsText: "",
		imageUrl: "",
		requiresSubmission: true,
		isPublished: true,
		estImpact: { co2Kg: 0, waterL: 0, wasteKg: 0 },
		submissionSchema: [],
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
					tagsText: Array.isArray(m?.tags) ? m.tags.join(", ") : "",
					imageUrl: m?.imageUrl || "",
					requiresSubmission: m?.requiresSubmission ?? true,
					isPublished: m?.isPublished ?? true,
					estImpact: {
						co2Kg: m?.estImpact?.co2Kg ?? 0,
						waterL: m?.estImpact?.waterL ?? 0,
						wasteKg: m?.estImpact?.wasteKg ?? 0,
					},
					submissionSchema: Array.isArray(m?.submissionSchema) ? m.submissionSchema : [],
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

	const setImpact = (key) => (e) => {
		setForm((p) => ({ ...p, estImpact: { ...p.estImpact, [key]: e.target.value } }));
	};

	// ----- submission schema helpers -----
	const addSubmissionField = () => {
		setForm((p) => ({ ...p, submissionSchema: [...(p.submissionSchema || []), emptyField()] }));
	};

	const removeSubmissionField = (index) => {
		setForm((p) => ({
			...p,
			submissionSchema: (p.submissionSchema || []).filter((_, i) => i !== index),
		}));
	};

	const updateSubmissionField = (index, key, value) => {
		setForm((p) => {
			const next = [...(p.submissionSchema || [])];
			next[index] = { ...next[index], [key]: value };
			return { ...p, submissionSchema: next };
		});
	};

	const setSubmissionOptionsFromText = (index, text) => {
		const arr = text
			.split(",")
			.map((x) => x.trim())
			.filter(Boolean);
		updateSubmissionField(index, "options", arr);
	};

	const getSubmissionOptionsText = (field) =>
		Array.isArray(field?.options) ? field.options.join(", ") : "";

	const handleSave = async () => {
		try {
			setSaving(true);

			const payload = {
				title: form.title.trim(),
				slug: form.slug.trim(),
				summary: form.summary.trim(),
				description: form.description.trim(),
				category: form.category,
				difficulty: form.difficulty,
				duration: form.duration.trim(),
				points: Number(form.points) || 0,
				imageUrl: form.imageUrl.trim(),
				requiresSubmission: !!form.requiresSubmission,
				isPublished: !!form.isPublished,

				tags: form.tagsText
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean),

				estImpact: {
					co2Kg: Number(form.estImpact.co2Kg) || 0,
					waterL: Number(form.estImpact.waterL) || 0,
					wasteKg: Number(form.estImpact.wasteKg) || 0,
				},

				submissionSchema: (form.submissionSchema || [])
					.filter((f) => f.key?.trim() && f.label?.trim())
					.map((f) => ({
						key: f.key.trim(),
						label: f.label.trim(),
						type: f.type || "text",
						required: !!f.required,
						options: f.type === "select" ? (f.options || []) : [],
					})),
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

						<TextField label="Summary" value={form.summary} onChange={onChange("summary")} fullWidth multiline minRows={2} />
						<TextField label="Description" value={form.description} onChange={onChange("description")} fullWidth multiline minRows={4} />

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField select label="Category" value={form.category} onChange={onChange("category")} fullWidth>
								{CATEGORIES.map((c) => (
									<MenuItem key={c} value={c}>
										{c}
									</MenuItem>
								))}
							</TextField>

							<TextField select label="Difficulty" value={form.difficulty} onChange={onChange("difficulty")} fullWidth>
								{DIFFICULTIES.map((d) => (
									<MenuItem key={d} value={d}>
										{d}
									</MenuItem>
								))}
							</TextField>
						</Stack>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField label="Duration" value={form.duration} onChange={onChange("duration")} fullWidth />
							<TextField label="Points" type="number" value={form.points} onChange={onChange("points")} fullWidth />
						</Stack>

						<TextField label="Tags (comma-separated)" value={form.tagsText} onChange={onChange("tagsText")} fullWidth />

						<TextField
							label="Image URL"
							value={form.imageUrl}
							onChange={onChange("imageUrl")}
							fullWidth
							helperText="Paste a public image URL (optional)."
						/>

						<Divider />

						<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
							Estimated impact
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField label="CO₂ (kg)" type="number" value={form.estImpact.co2Kg} onChange={setImpact("co2Kg")} fullWidth />
							<TextField label="Water (L)" type="number" value={form.estImpact.waterL} onChange={setImpact("waterL")} fullWidth />
							<TextField label="Waste (kg)" type="number" value={form.estImpact.wasteKg} onChange={setImpact("wasteKg")} fullWidth />
						</Stack>

						<Divider />

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<FormControlLabel
								control={<Switch checked={form.requiresSubmission} onChange={onChange("requiresSubmission")} />}
								label="Requires submission"
							/>
							<FormControlLabel control={<Switch checked={form.isPublished} onChange={onChange("isPublished")} />} label="Published" />
						</Stack>

						<Divider />

						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
								Submission schema
							</Typography>

							<Button
								startIcon={<AddIcon />}
								onClick={addSubmissionField}
								sx={{ textTransform: "none" }}
								disabled={!form.requiresSubmission}
							>
								Add field
							</Button>
						</Stack>

						{!form.requiresSubmission ? (
							<Typography variant="body2" color="text.secondary">
								Turn on “Requires submission” to edit submission fields.
							</Typography>
						) : form.submissionSchema.length === 0 ? (
							<Typography variant="body2" color="text.secondary">
								No submission fields yet.
							</Typography>
						) : (
							<Stack spacing={2}>
								{form.submissionSchema.map((f, idx) => (
									<Card key={idx} variant="outlined" sx={{ borderRadius: 2 }}>
										<CardContent>
											<Stack spacing={2}>
												<Stack direction="row" justifyContent="space-between" alignItems="center">
													<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
														Field #{idx + 1}
													</Typography>
													<IconButton onClick={() => removeSubmissionField(idx)} size="small">
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Stack>

												<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
													<TextField label="Key" value={f.key} onChange={(e) => updateSubmissionField(idx, "key", e.target.value)} fullWidth />
													<TextField label="Label" value={f.label} onChange={(e) => updateSubmissionField(idx, "label", e.target.value)} fullWidth />
												</Stack>

												<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
													<TextField select label="Type" value={f.type} onChange={(e) => updateSubmissionField(idx, "type", e.target.value)} fullWidth>
														{FIELD_TYPES.map((t) => (
															<MenuItem key={t} value={t}>
																{t}
															</MenuItem>
														))}
													</TextField>

													<FormControlLabel
														control={<Switch checked={!!f.required} onChange={(e) => updateSubmissionField(idx, "required", e.target.checked)} />}
														label="Required"
													/>
												</Stack>

												{f.type === "select" && (
													<TextField
														label="Options (comma-separated)"
														value={getSubmissionOptionsText(f)}
														onChange={(e) => setSubmissionOptionsFromText(idx, e.target.value)}
														fullWidth
													/>
												)}
											</Stack>
										</CardContent>
									</Card>
								))}
							</Stack>
						)}

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
