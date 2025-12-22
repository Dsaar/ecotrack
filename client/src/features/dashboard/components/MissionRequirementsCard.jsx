import { Card, CardContent, Typography, Stack, Chip, Divider } from "@mui/material";

export default function MissionRequirementsCard({ requiresSubmission, submissionSchema = [] }) {
	return (
		<Card sx={{ borderRadius: 2 }}>
			<CardContent>
				<Typography variant="h6" sx={{ mb: 1 }}>
					Submission requirements
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					{requiresSubmission
						? "This mission requires a submission for review."
						: "This mission does not require a submission."}
				</Typography>

				<Divider sx={{ mb: 2 }} />

				{submissionSchema.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						No fields configured.
					</Typography>
				) : (
					<Stack spacing={1}>
						{submissionSchema.map((f) => (
							<Stack
								key={f.key}
								direction="row"
								spacing={1}
								alignItems="center"
								justifyContent="space-between"
							>
								<Typography variant="body2">
									{f.label}{" "}
									<Typography component="span" variant="caption" color="text.secondary">
										({f.key})
									</Typography>
								</Typography>

								<Stack direction="row" spacing={1} alignItems="center">
									{f.required && <Chip size="small" label="Required" color="warning" variant="outlined" />}
									<Chip size="small" label={f.type || "text"} variant="outlined" />
								</Stack>
							</Stack>
						))}
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}
