// src/features/dashboard/components/CommunityGoalsCard.jsx
import { useEffect, useMemo, useState } from "react";
import {
	Card,
	CardContent,
	LinearProgress,
	Stack,
	Typography,
	Button,
	TextField,
} from "@mui/material";

import apiClient from "../../../services/apiClient.js";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";

function CommunityGoalsCard({ stats, isAdmin = false, onGoalUpdated }) {
	const { totalEcoPoints = 0, goalPointsTarget = 0 } = stats || {};
	const { showSuccess, showError } = useSnackbar();

	const progress = useMemo(() => {
		return goalPointsTarget > 0
			? Math.min(100, (totalEcoPoints / goalPointsTarget) * 100)
			: 0;
	}, [totalEcoPoints, goalPointsTarget]);

	const remaining = Math.max(0, goalPointsTarget - totalEcoPoints);

	const [editing, setEditing] = useState(false);
	const [draftGoal, setDraftGoal] = useState(String(goalPointsTarget ?? 0));
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!editing) setDraftGoal(String(goalPointsTarget ?? 0));
	}, [goalPointsTarget, editing]);

	const onSave = async () => {
		const next = Number(draftGoal);

		if (!Number.isFinite(next) || next < 0) {
			showError?.("Please enter a valid non-negative number.");
			return;
		}

		try {
			setSaving(true);

			await apiClient.put("/community/settings", { goalPointsTarget: next });

			showSuccess?.("Community goal updated.");
			setEditing(false);

			// re-fetch overview so dashboard uses newest value
			await onGoalUpdated?.();
		} catch (err) {
			const msg =
				err?.response?.data?.message || err?.message || "Failed to update goal.";
			showError?.(msg);
		} finally {
			setSaving(false);
		}
	};

	const onCancel = () => {
		setDraftGoal(String(goalPointsTarget ?? 0));
		setEditing(false);
	};

	return (
		<Card sx={{ borderRadius: 2 }}>
			<CardContent>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h6">Community goal</Typography>

					{isAdmin && !editing && (
						<Button size="small" onClick={() => setEditing(true)}>
							Edit
						</Button>
					)}
				</Stack>

				{!editing ? (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Next milestone: {goalPointsTarget.toLocaleString()} eco points collected by
							the EcoTrack community.
						</Typography>

						<Stack spacing={1.5}>
							<LinearProgress
								variant="determinate"
								value={progress}
								sx={{ height: 10, borderRadius: 999 }}
							/>

							<Stack direction="row" justifyContent="space-between" alignItems="center">
								<Typography variant="body2" color="text.secondary">
									Progress
								</Typography>
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{progress.toFixed(0)}%
								</Typography>
							</Stack>

							<Typography variant="caption" color="text.secondary">
								{remaining > 0
									? `${remaining.toLocaleString()} points to reach the goal.`
									: "Goal reached! Time to set a new milestone."}
							</Typography>
						</Stack>
					</>
				) : (
					<Stack spacing={1.5} sx={{ mt: 2 }}>
						<TextField
							label="Goal points target"
							size="small"
							value={draftGoal}
							onChange={(e) => setDraftGoal(e.target.value)}
							inputProps={{ inputMode: "numeric" }}
							disabled={saving}
						/>

						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<Button onClick={onCancel} disabled={saving}>
								Cancel
							</Button>
							<Button variant="contained" onClick={onSave} disabled={saving}>
								{saving ? "Saving…" : "Save"}
							</Button>
						</Stack>
					</Stack>
				)}
			</CardContent>
		</Card>
	);
}

export default CommunityGoalsCard;
