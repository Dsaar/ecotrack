// src/features/dashboard/pages/admin/components/MissionBasicsSection.jsx
import { MenuItem, Stack, TextField } from "@mui/material";
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS, getErr } from "../utils/missionFormHelpers.js";

export default function MissionBasicsSection({ form, errors, autoSlug, setField }) {
	return (
		<>
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
		</>
	);
}
