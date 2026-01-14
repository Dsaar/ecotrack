// src/features/dashboard/pages/admin/components/SubmissionSchemaEditor.jsx
import { Button, Card, CardContent, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { FIELD_TYPES, getErr, optionsArrayToText, optionsTextToArray } from "../utils/missionFormHelpers.js";

function SubmissionFieldCard({ idx, field, errors, onRemove, onUpdate }) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 2 }}>
			<CardContent>
				<Stack spacing={2}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
							Field #{idx + 1}
						</Typography>
						<IconButton onClick={() => onRemove(idx)} size="small">
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Stack>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
						<TextField
							label="Key"
							value={field.key}
							onChange={(e) => onUpdate(idx, "key", e.target.value)}
							error={!!getErr(errors, `submissionSchema.${idx}.key`)}
							helperText={getErr(errors, `submissionSchema.${idx}.key`) || 'Example: "photo" or "bags"'}
							fullWidth
						/>
						<TextField
							label="Label"
							value={field.label}
							onChange={(e) => onUpdate(idx, "label", e.target.value)}
							error={!!getErr(errors, `submissionSchema.${idx}.label`)}
							helperText={getErr(errors, `submissionSchema.${idx}.label`) || " "}
							fullWidth
						/>
					</Stack>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
						<TextField
							select
							label="Type"
							value={field.type}
							onChange={(e) => onUpdate(idx, "type", e.target.value)}
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
									checked={!!field.required}
									onChange={(e) => onUpdate(idx, "required", e.target.checked)}
								/>
							}
							label="Required"
						/>
					</Stack>

					{field.type === "select" && (
						<TextField
							label="Options (comma-separated)"
							value={optionsArrayToText(field)}
							onChange={(e) => onUpdate(idx, "options", optionsTextToArray(e.target.value))}
							error={!!getErr(errors, `submissionSchema.${idx}.options`)}
							helperText={getErr(errors, `submissionSchema.${idx}.options`) || " "}
							fullWidth
						/>
					)}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default function SubmissionSchemaEditor({
	requiresSubmission,
	submissionSchema,
	errors,
	onAdd,
	onRemove,
	onUpdate,
}) {
	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
					Submission schema (fields user must fill)
				</Typography>

				<Button
					startIcon={<AddIcon />}
					onClick={onAdd}
					sx={{ textTransform: "none" }}
					disabled={!requiresSubmission}
				>
					Add field
				</Button>
			</Stack>

			{!requiresSubmission ? (
				<Typography variant="body2" color="text.secondary">
					Turn on “Requires submission” to add submission fields.
				</Typography>
			) : submissionSchema.length === 0 ? (
				<Typography variant="body2" color="text.secondary">
					No submission fields yet.
				</Typography>
			) : (
				<Stack spacing={2}>
					{submissionSchema.map((f, idx) => (
						<SubmissionFieldCard
							key={idx}
							idx={idx}
							field={f}
							errors={errors}
							onRemove={onRemove}
							onUpdate={onUpdate}
						/>
					))}
				</Stack>
			)}
		</>
	);
}
