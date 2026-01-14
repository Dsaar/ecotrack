// src/features/dashboard/pages/admin/AdminMissionCreatePage.jsx
import { Box, Button, Card, CardContent, Divider, FormControlLabel, Stack, Switch, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "../../../../app/providers/SnackBarProvider.jsx";

import MissionBasicsSection from "./components/MissionBasicsSection.jsx";
import MissionImpactSection from "./components/MissionImpactSection.jsx";
import SubmissionSchemaEditor from "./components/SubmissionSchemaEditor.jsx";
import useMissionCreateForm from "./hooks/useMissionCreateForm.js";

export default function AdminMissionCreatePage() {
	const navigate = useNavigate();
	const { showSuccess, showError } = useSnackbar();
	const theme = useTheme();

	const {
		form,
		errors,
		saving,
		autoSlug,
		setField,
		setImpact,
		addSubmissionField,
		removeSubmissionField,
		updateSubmissionField,
		submit,
	} = useMissionCreateForm({ showSuccess, showError, navigate });

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
						onClick={submit}
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
						<MissionBasicsSection form={form} errors={errors} autoSlug={autoSlug} setField={setField} />

						<Divider />

						<MissionImpactSection form={form} errors={errors} setImpact={setImpact} />

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

						<SubmissionSchemaEditor
							requiresSubmission={form.requiresSubmission}
							submissionSchema={form.submissionSchema}
							errors={errors}
							onAdd={addSubmissionField}
							onRemove={removeSubmissionField}
							onUpdate={updateSubmissionField}
						/>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}
