// src/features/dashboard/pages/admin/components/MissionEditBasicsSection.jsx
import { MenuItem, Stack, TextField, Divider } from "@mui/material";
import { CATEGORIES, DIFFICULTIES } from "../utils/missionEditHelpers.js";

export default function MissionEditBasicsSection({ form, setField }) {
	return (
		<>
			<TextField
				label="Title"
				value={form.title}
				onChange={(e) => setField("title", e.target.value)}
				fullWidth
			/>
			<TextField
				label="Slug"
				value={form.slug}
				onChange={(e) => setField("slug", e.target.value)}
				fullWidth
			/>

			<TextField
				label="Summary"
				value={form.summary}
				onChange={(e) => setField("summary", e.target.value)}
				fullWidth
				multiline
				minRows={2}
			/>
			<TextField
				label="Description"
				value={form.description}
				onChange={(e) => setField("description", e.target.value)}
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
					fullWidth
				>
					{CATEGORIES.map((c) => (
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
					fullWidth
				>
					{DIFFICULTIES.map((d) => (
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
					fullWidth
				/>
				<TextField
					label="Points"
					type="number"
					value={form.points}
					onChange={(e) => setField("points", e.target.value)}
					fullWidth
				/>
			</Stack>

			<TextField
				label="Tags (comma-separated)"
				value={form.tagsText}
				onChange={(e) => setField("tagsText", e.target.value)}
				fullWidth
			/>

			<TextField
				label="Image URL"
				value={form.imageUrl}
				onChange={(e) => setField("imageUrl", e.target.value)}
				fullWidth
				helperText="Paste a public image URL (optional)."
			/>

			<Divider />
		</>
	);
}
