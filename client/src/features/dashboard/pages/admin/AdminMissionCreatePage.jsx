import { useMemo, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Stack,
	Typography,
	TextField,
	MenuItem,
	Button,
	Divider,
	Switch,
	FormControlLabel,
	IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { createMission } from "../../../../services/missionsService.js";
import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";

const CATEGORY_OPTIONS = ["Home", "Transport", "Food", "Energy", "Waste", "Water", "Community"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const FIELD_TYPES = ["text", "number", "select", "url", "file"];

function slugify(str = "") {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

const emptyField = () => ({
	key: "",
	label: "",
	type: "text",
	required: true,
	options: [],
});

// ---- helpers for nested form errors ----
function getErr(errors, path) {
	return errors?.[path] || "";
}
function clearErr(setErrors, path) {
	setErrors((prev) => {
		if (!prev?.[path]) return prev;
		const next = { ...prev };
		delete next[path];
		return next;
	});
}

export default function AdminMissionCreatePage() {
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();

	const [saving, setSaving] = useState(false);

	// ✅ field-level errors coming from backend Joi (via apiClient interceptor)
	const [errors, setErrors] = useState({}); // { "title": "...", "estImpact.co2Kg": "...", ... }

	const [form, setForm] = useState({
		title: "",
		slug: "",
		summary: "",
		description: "",
		category: "Home",
		difficulty: "Easy",
		duration: "15 min",
		points: 10,
		imageUrl: "",
		isPublished: true,

		tagsText: "",
		requiresSubmission: true,
		estImpact: { co2Kg: 0, waterL: 0, wasteKg: 0 },
		submissionSchema: [],
	});

	const autoSlug = useMemo(() => slugify(form.title), [form.title]);

	const setField = (key, value) => {
		setForm((p) => ({ ...p, [key]: value }));
		clearErr(setErrors, key);
	};

	const setImpact = (key, value) => {
		setForm((p) => ({
			...p,
			estImpact: { ...p.estImpact, [key]: value },
		}));
		clearErr(setErrors, `estImpact.${key}`);
	};

	// ----- submissionSchema helpers -----
	const addSubmissionField = () => {
		setForm((p) => ({ ...p, submissionSchema: [...p.submissionSchema, emptyField()] }));
	};

	const removeSubmissionField = (index) => {
		setForm((p) => ({
			...p,
			submissionSchema: p.submissionSchema.filter((_, i) => i !== index),
		}));

		// clear any errors for that index (simple approach)
		setErrors((prev) => {
			const next = { ...prev };
			Object.keys(next).forEach((k) => {
				if (k.startsWith(`submissionSchema.${index}.`)) delete next[k];
			});
			return next;
		});
	};

	const updateSubmissionField = (index, key, value) => {
		setForm((p) => {
			const next = [...p.submissionSchema];
			next[index] = { ...next[index], [key]: value };
			return { ...p, submissionSchema: next };
		});
		clearErr(setErrors, `submissionSchema.${index}.${key}`);
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

	const handleSubmit = async () => {
		// clear old errors before submit
		setErrors({});

		// minimal client checks (backend is source of truth)
		if (!form.title.trim()) return showError?.("Title is required.");
		if (!form.summary.trim()) return showError?.("Summary is required.");
		if (!form.description.trim()) return showError?.("Description is required.");

		const payload = {
			title: form.title.trim(),
			slug: (form.slug || autoSlug).trim(),
			summary: form.summary.trim(),
			description: form.description.trim(),
			category: form.category,
			difficulty: form.difficulty,
			duration: form.duration.trim(),
			points: Number(form.points) || 0,
			imageUrl: form.imageUrl.trim(),
			isPublished: !!form.isPublished,

			requiresSubmission: !!form.requiresSubmission,
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

		try {
			setSaving(true);
			const created = await createMission(payload);
			showSuccess?.("Mission created.");
			navigate(`/dashboard/missions/${created._id}`);
		} catch (err) {
			console.error("[AdminMissionCreatePage] create failed", err);

			// ✅ field-level mapping from apiClient interceptor
			if (err.fieldErrors) setErrors(err.fieldErrors);

			showError?.(err.userMessage || err?.response?.data?.message || "Failed to create mission.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
						Create mission
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Add a new mission to EcoTrack.
					</Typography>
				</Box>

				<Stack direction="row" spacing={1}>
					<Button
						variant="outlined"
						onClick={() => navigate("/dashboard/missions")}
						sx={{ textTransform: "none" }}
						disabled={saving}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}
						sx={{ textTransform: "none", bgcolor: "#166534", "&:hover": { bgcolor: "#14532d" } }}
						disabled={saving}
					>
						{saving ? "Creating..." : "Create"}
					</Button>
				</Stack>
			</Stack>

			<Card sx={{ borderRadius: 2 }}>
				<CardContent>
					<Stack spacing={2}>
						<TextField
							label="Title"
							value={form.title}
							onChange={(e) => setField("title", e.target.value)}
							error={!!getErr(errors, "title")}
							helperText={getErr(errors, "title") || " "}
							fullWidth
						/>

						<TextField
							label="Slug"
							value={form.slug}
							onChange={(e) => setField("slug", e.target.value)}
							error={!!getErr(errors, "slug")}
							helperText={getErr(errors, "slug") || `Leave empty to use: ${autoSlug}`}
							fullWidth
						/>

						<TextField
							label="Summary"
							value={form.summary}
							onChange={(e) => setField("summary", e.target.value)}
							error={!!getErr(errors, "summary")}
							helperText={getErr(errors, "summary") || " "}
							fullWidth
							multiline
							minRows={2}
						/>

						<TextField
							label="Description"
							value={form.description}
							onChange={(e) => setField("description", e.target.value)}
							error={!!getErr(errors, "description")}
							helperText={getErr(errors, "description") || " "}
							fullWidth
							multiline
							minRows={4}
						/>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField
								select
								label="Category"
								value={form.category}
								onChange={(e) => setField("category", e.target.value)}
								error={!!getErr(errors, "category")}
								helperText={getErr(errors, "category") || " "}
								fullWidth
							>
								{CATEGORY_OPTIONS.map((c) => (
									<MenuItem key={c} value={c}>
										{c}
									</MenuItem>
								))}
							</TextField>

							<TextField
								select
								label="Difficulty"
								value={form.difficulty}
								onChange={(e) => setField("difficulty", e.target.value)}
								error={!!getErr(errors, "difficulty")}
								helperText={getErr(errors, "difficulty") || " "}
								fullWidth
							>
								{DIFFICULTY_OPTIONS.map((d) => (
									<MenuItem key={d} value={d}>
										{d}
									</MenuItem>
								))}
							</TextField>
						</Stack>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField
								label="Duration"
								value={form.duration}
								onChange={(e) => setField("duration", e.target.value)}
								error={!!getErr(errors, "duration")}
								helperText={getErr(errors, "duration") || " "}
								fullWidth
							/>
							<TextField
								label="Points"
								type="number"
								value={form.points}
								onChange={(e) => setField("points", e.target.value)}
								error={!!getErr(errors, "points")}
								helperText={getErr(errors, "points") || " "}
								fullWidth
							/>
						</Stack>

						<TextField
							label="Image URL"
							value={form.imageUrl}
							onChange={(e) => setField("imageUrl", e.target.value)}
							error={!!getErr(errors, "imageUrl")}
							helperText={getErr(errors, "imageUrl") || " "}
							fullWidth
						/>

						<TextField
							label="Tags (comma-separated)"
							value={form.tagsText}
							onChange={(e) => setField("tagsText", e.target.value)}
							error={!!getErr(errors, "tags")}
							helperText={getErr(errors, "tags") || 'Example: "water, home, habits"'}
							fullWidth
						/>

						<Divider />

						<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
							Estimated impact
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
							<TextField
								label="CO₂ (kg)"
								type="number"
								value={form.estImpact.co2Kg}
								onChange={(e) => setImpact("co2Kg", e.target.value)}
								error={!!getErr(errors, "estImpact.co2Kg")}
								helperText={getErr(errors, "estImpact.co2Kg") || " "}
								fullWidth
							/>
							<TextField
								label="Water (L)"
								type="number"
								value={form.estImpact.waterL}
								onChange={(e) => setImpact("waterL", e.target.value)}
								error={!!getErr(errors, "estImpact.waterL")}
								helperText={getErr(errors, "estImpact.waterL") || " "}
								fullWidth
							/>
							<TextField
								label="Waste (kg)"
								type="number"
								value={form.estImpact.wasteKg}
								onChange={(e) => setImpact("wasteKg", e.target.value)}
								error={!!getErr(errors, "estImpact.wasteKg")}
								helperText={getErr(errors, "estImpact.wasteKg") || " "}
								fullWidth
							/>
						</Stack>

						<Divider />

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
							<FormControlLabel
								control={
									<Switch
										checked={form.requiresSubmission}
										onChange={(e) => setField("requiresSubmission", e.target.checked)}
									/>
								}
								label="Requires submission"
							/>
							<FormControlLabel
								control={
									<Switch
										checked={form.isPublished}
										onChange={(e) => setField("isPublished", e.target.checked)}
									/>
								}
								label="Published"
							/>
						</Stack>

						<Divider />

						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
								Submission schema (fields user must fill)
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
								Turn on “Requires submission” to add submission fields.
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
													<TextField
														label="Key"
														value={f.key}
														onChange={(e) => updateSubmissionField(idx, "key", e.target.value)}
														error={!!getErr(errors, `submissionSchema.${idx}.key`)}
														helperText={getErr(errors, `submissionSchema.${idx}.key`) || 'Example: "photo" or "bags"'}
														fullWidth
													/>
													<TextField
														label="Label"
														value={f.label}
														onChange={(e) => updateSubmissionField(idx, "label", e.target.value)}
														error={!!getErr(errors, `submissionSchema.${idx}.label`)}
														helperText={getErr(errors, `submissionSchema.${idx}.label`) || " "}
														fullWidth
													/>
												</Stack>

												<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
													<TextField
														select
														label="Type"
														value={f.type}
														onChange={(e) => updateSubmissionField(idx, "type", e.target.value)}
														error={!!getErr(errors, `submissionSchema.${idx}.type`)}
														helperText={getErr(errors, `submissionSchema.${idx}.type`) || " "}
														fullWidth
													>
														{FIELD_TYPES.map((t) => (
															<MenuItem key={t} value={t}>
																{t}
															</MenuItem>
														))}
													</TextField>

													<FormControlLabel
														control={
															<Switch
																checked={!!f.required}
																onChange={(e) => updateSubmissionField(idx, "required", e.target.checked)}
															/>
														}
														label="Required"
													/>
												</Stack>

												{f.type === "select" && (
													<TextField
														label="Options (comma-separated)"
														value={getSubmissionOptionsText(f)}
														onChange={(e) => setSubmissionOptionsFromText(idx, e.target.value)}
														error={!!getErr(errors, `submissionSchema.${idx}.options`)}
														helperText={getErr(errors, `submissionSchema.${idx}.options`) || " "}
														fullWidth
													/>
												)}
											</Stack>
										</CardContent>
									</Card>
								))}
							</Stack>
						)}
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
