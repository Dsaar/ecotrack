// src/features/missions/components/MissionSubmissionForm.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Stack,
	TextField,
	Typography,
	MenuItem,
	FormControlLabel,
	Switch,
} from "@mui/material";

function initAnswers(submissionSchema = []) {
	// store answers by key for easy binding
	const map = {};
	(submissionSchema || []).forEach((f) => {
		if (f?.key) map[f.key] = "";
	});
	return map;
}

// basic URL validator (frontend UX only)
function isValidUrl(value) {
	try {
		new URL(String(value));
		return true;
	} catch {
		return false;
	}
}

export default function MissionSubmissionForm({
	mission,
	submitting,
	onSubmit, // async ({ answers, evidenceUrls }) => void
}) {
	const schema = Array.isArray(mission?.submissionSchema)
		? mission.submissionSchema
		: [];
	const requiresSubmission = !!mission?.requiresSubmission;

	// ✅ reset when mission/schema changes (fixes “only one answer saved” bugs)
	const schemaKey = useMemo(
		() => (schema || []).map((f) => `${f.key}:${f.type}:${f.required}`).join("|"),
		[schema]
	);

	const [answersMap, setAnswersMap] = useState(() => initAnswers(schema));
	const [evidenceText, setEvidenceText] = useState(""); // comma/newline separated urls
	const [localErrors, setLocalErrors] = useState({}); // { "answers.trees": "...", evidenceUrls: "..." }

	// optional: allow users to submit without evidence even if mission has url fields (still in answers)
	const [showEvidenceBox, setShowEvidenceBox] = useState(true);

	useEffect(() => {
		// whenever mission changes, re-init state based on new schema
		setAnswersMap(initAnswers(schema));
		setEvidenceText("");
		setLocalErrors({});
	}, [schemaKey]); // eslint-disable-line react-hooks/exhaustive-deps

	const keys = useMemo(
		() => (schema || []).map((f) => f?.key).filter(Boolean),
		[schemaKey] // stable when schema changes
	);

	const setAnswer = (key, value) => {
		setAnswersMap((prev) => ({ ...prev, [key]: value }));
		setLocalErrors((prev) => {
			const next = { ...prev };
			delete next[`answers.${key}`];
			return next;
		});
	};

	const parseEvidenceUrls = () =>
		evidenceText
			.split(/[\n,]/g)
			.map((s) => s.trim())
			.filter(Boolean);

	const validateLocal = () => {
		// UX-only validation. Backend Joi is source of truth.
		const errs = {};

		if (requiresSubmission) {
			schema.forEach((f) => {
				if (!f?.key) return;
				if (!f.required) return;

				const raw = answersMap[f.key];

				// empty check
				if (raw === "" || raw === null || raw === undefined) {
					errs[`answers.${f.key}`] = `${f.label || f.key} is required.`;
					return;
				}

				// type checks
				if (f.type === "number") {
					const n = Number(raw);
					if (!Number.isFinite(n)) {
						errs[`answers.${f.key}`] = `${f.label || f.key} must be a number.`;
					}
				}

				// Treat "file" as URL for now (backend only supports string/number in answers)
				if (f.type === "url" || f.type === "file") {
					if (!isValidUrl(raw)) {
						errs[`answers.${f.key}`] = `${f.label || f.key} must be a valid URL.`;
					}
				}

				if (f.type === "select") {
					// if options exist, enforce membership
					if (Array.isArray(f.options) && f.options.length > 0) {
						if (!f.options.includes(raw)) {
							errs[`answers.${f.key}`] = `${f.label || f.key} must be one of the allowed options.`;
						}
					}
				}
			});
		}

		// Evidence urls box is optional (separate from required url fields in answers)
		if (showEvidenceBox && evidenceText.trim()) {
			const urls = parseEvidenceUrls();
			const bad = urls.find((u) => !isValidUrl(u));
			if (bad) errs.evidenceUrls = "One or more evidence URLs are not valid.";
		}

		setLocalErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const buildAnswersArray = () => {
		// Convert map -> [{key,value}] and filter out empty optional values
		return keys
			.map((k) => {
				const f = schema.find((x) => x.key === k);
				const raw = answersMap[k];

				let value = raw;

				// normalize number
				if (f?.type === "number") value = raw === "" ? "" : Number(raw);

				// normalize select (keep string)
				if (f?.type === "select") value = String(raw);

				// normalize url/file (keep string)
				if (f?.type === "url" || f?.type === "file") value = String(raw);

				return { key: k, value };
			})
			.filter((a) => {
				const f = schema.find((x) => x.key === a.key);
				if (f?.required) return true;

				// keep non-empty optional values
				return a.value !== "" && a.value !== null && a.value !== undefined;
			});
	};

	const handleSubmit = async () => {
		setLocalErrors({});
		if (!validateLocal()) return;

		const answers = buildAnswersArray();

		// Evidence urls are separate from required url fields
		const evidenceUrls = showEvidenceBox ? parseEvidenceUrls() : [];

		await onSubmit({ answers, evidenceUrls });
	};

	// If mission doesn’t require submission, hide the card
	if (!requiresSubmission) return null;

	return (
		<Card sx={{ borderRadius: 2 }}>
			<CardContent>
				<Stack spacing={2}>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700 }}>
							Submit mission
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Fill the required fields, then submit for review.
						</Typography>
					</Box>

					<Divider />

					{schema.length === 0 ? (
						<Typography variant="body2" color="text.secondary">
							This mission requires a submission, but no fields were configured.
							Ask an admin to add a submission schema.
						</Typography>
					) : (
						<Stack spacing={2}>
							{schema.map((f, idx) => {
								const key = f.key || `field-${idx}`;
								const errKey = `answers.${f.key}`;
								const hasErr = !!localErrors[errKey];

								// "file" support: backend expects value string/number.
								// For now treat "file" as URL input.
								const isUrlLike = f.type === "url" || f.type === "file";

								if (f.type === "select") {
									return (
										<TextField
											key={key}
											select
											label={f.label || f.key || `Field ${idx + 1}`}
											value={answersMap[f.key] ?? ""}
											onChange={(e) => setAnswer(f.key, e.target.value)}
											required={!!f.required}
											error={hasErr}
											helperText={localErrors[errKey] || " "}
											fullWidth
										>
											{(Array.isArray(f.options) ? f.options : []).map((opt) => (
												<MenuItem key={opt} value={opt}>
													{opt}
												</MenuItem>
											))}
										</TextField>
									);
								}

								return (
									<TextField
										key={key}
										label={f.label || f.key || `Field ${idx + 1}`}
										value={answersMap[f.key] ?? ""}
										onChange={(e) => setAnswer(f.key, e.target.value)}
										required={!!f.required}
										type={f.type === "number" ? "number" : "text"}
										error={hasErr}
										helperText={
											localErrors[errKey] ||
											(isUrlLike
												? "Paste a public URL"
												: f.type === "number"
													? "Enter a number"
													: " ")
										}
										fullWidth
									/>
								);
							})}
						</Stack>
					)}

					<Divider />

					<FormControlLabel
						control={
							<Switch
								checked={showEvidenceBox}
								onChange={(e) => setShowEvidenceBox(e.target.checked)}
							/>
						}
						label="Add extra evidence URLs (optional)"
					/>

					{showEvidenceBox && (
						<TextField
							label="Evidence URLs"
							value={evidenceText}
							onChange={(e) => {
								setEvidenceText(e.target.value);
								setLocalErrors((prev) => {
									const next = { ...prev };
									delete next.evidenceUrls;
									return next;
								});
							}}
							placeholder={"https://...\nhttps://..."}
							error={!!localErrors.evidenceUrls}
							helperText={localErrors.evidenceUrls || "Paste one or more URLs (comma or newline separated)."}
							multiline
							minRows={2}
							fullWidth
						/>
					)}

					<Stack direction="row" justifyContent="flex-end">
						<Button
							variant="contained"
							onClick={handleSubmit}
							disabled={submitting || schema.length === 0}
							sx={{
								textTransform: "none",
								bgcolor: "#166534",
								"&:hover": { bgcolor: "#14532d" },
							}}
						>
							{submitting ? "Submitting..." : "Submit for review"}
						</Button>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}
