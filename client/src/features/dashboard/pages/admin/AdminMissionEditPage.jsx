// src/features/dashboard/pages/admin/AdminMissionEditPage.jsx
import { Box, Button, Card, CardContent, CircularProgress, Divider, FormControlLabel, Stack, Switch, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";

import useMissionEditForm from "./hooks/useMissionEditForm.js";
import MissionEditBasicsSection from "./components/MissionEditBasicsSection.jsx";
import MissionImpactSection from "./components/MissionImpactSection.jsx";
import SubmissionSchemaEditor from "./components/SubmissionSchemaEditor.jsx";

export default function AdminMissionEditPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();
	const theme = useTheme();

	const {
		loading,
		saving,
		form,
		setField,
		setImpact,
		addSubmissionField,
		removeSubmissionField,
		updateSubmissionField,
		handleSave,
	} = useMissionEditForm({ id, showSuccess, showError, navigate });

	if (loading) {
		return (
			<Box sx={{ p: { xs: 2, md: 3 } }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				position: "relative",
				p: { xs: 2, md: 3 },
				maxWidth: 900,
				"&:before": {
					content: '""',
					position: "absolute",
					borderRadius: 2,
					top: 0,
					left: 0,
					right: 0,
					height: { xs: 180, md: 220 },
					background: `linear-gradient(
						180deg,
						${theme.palette.tones?.blue?.bg ?? "rgba(59,130,246,0.12)"} 0%,
						${theme.palette.tones?.green?.bg ?? "rgba(22,101,52,0.10)"} 45%,
						transparent 85%
					)`,
					maskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
					pointerEvents: "none",
					zIndex: 0,
				},
				"& > *": { position: "relative", zIndex: 1 },
			}}
		>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
				Edit mission
			</Typography>

			<Card sx={{ borderRadius: 2 }}>
				<CardContent>
					<Stack spacing={2}>
						<MissionEditBasicsSection form={form} setField={setField} />

						<MissionImpactSection form={form} errors={{}} setImpact={(k, v) => setImpact(k, v)} />

						<Divider />

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
								Submission schema
							</Typography>

							<Button
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
							<SubmissionSchemaEditor
								requiresSubmission={form.requiresSubmission}
								submissionSchema={form.submissionSchema}
								errors={{}}
								onAdd={addSubmissionField}
								onRemove={removeSubmissionField}
								onUpdate={updateSubmissionField}
							/>
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
