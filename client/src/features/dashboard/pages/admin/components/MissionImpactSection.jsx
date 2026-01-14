// src/features/dashboard/pages/admin/components/MissionImpactSection.jsx
import { Stack, TextField, Typography } from "@mui/material";
import { getErr } from "../utils/missionFormHelpers.js";

export default function MissionImpactSection({ form, errors, setImpact }) {
	return (
		<>
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
		</>
	);
}
