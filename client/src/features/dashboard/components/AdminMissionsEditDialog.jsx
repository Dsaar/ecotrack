// src/features/dashboard/components/AdminMissionEditDialog.jsx
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Stack,
	TextField,
	MenuItem,
	Divider,
} from "@mui/material";

const CATEGORY_OPTIONS = [
	"Home",
	"Transport",
	"Food",
	"Energy",
	"Waste",
	"Water",
	"Community",
];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

export default function AdminMissionEditDialog({
	open,
	saving,
	form,
	setForm,
	onClose,
	onSave,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Edit mission</DialogTitle>
			<DialogContent>
				<Stack spacing={2} sx={{ mt: 1 }}>
					<TextField
						label="Title"
						value={form.title}
						onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
						fullWidth
					/>

					<TextField
						label="Summary"
						value={form.summary}
						onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
						fullWidth
						multiline
						minRows={3}
					/>

					<Divider />

					<TextField
						select
						label="Category"
						value={form.category}
						onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
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
						onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}
						fullWidth
					>
						{DIFFICULTY_OPTIONS.map((d) => (
							<MenuItem key={d} value={d}>
								{d}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label="Points"
						type="number"
						value={form.points}
						onChange={(e) => setForm((p) => ({ ...p, points: e.target.value }))}
						fullWidth
						inputProps={{ min: 0 }}
					/>

					{/*
          <TextField
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
            fullWidth
          />
          */}
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} disabled={saving} sx={{ textTransform: "none" }}>
					Cancel
				</Button>
				<Button
					onClick={onSave}
					variant="contained"
					disabled={saving}
					sx={{
						textTransform: "none",
						bgcolor: "#166534",
						"&:hover": { bgcolor: "#14532d" },
					}}
				>
					{saving ? "Saving..." : "Save"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
