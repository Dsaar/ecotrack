// src/features/missions/components/FavoriteButton.jsx
import { IconButton, Tooltip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../app/providers/UserProvider.jsx";
import { useSnackbar } from "../../../app/providers/SnackBarProvider.jsx";
import { toggleFavoriteMission } from "../../../services/favoritesService.js";

function FavoriteButton({ missionId }) {
	const { user, refreshUser } = useUser();
	const { showSuccess, showError } = useSnackbar();
	const navigate = useNavigate();

	const isFavorited = Array.isArray(user?.favorites?.missions)
		? user.favorites.missions.some((id) => String(id) === String(missionId))
		: false;

	const handleToggle = async (e) => {
		e.stopPropagation(); // so card click / navigation doesn’t trigger

		if (!user) {
			showError?.("Log in to save missions.");
			navigate("/login");
			return;
		}

		try {
			await toggleFavoriteMission(missionId);
			await refreshUser?.();
			showSuccess?.(
				isFavorited ? "Removed from favorites." : "Added to favorites."
			);
		} catch (err) {
			console.error("[FavoriteButton] Failed to toggle favorite", err);
			showError?.("Could not update favorites. Please try again.");
		}
	};

	return (
		<Tooltip title={isFavorited ? "Remove from favorites" : "Save mission"}>
			<IconButton size="small" onClick={handleToggle}>
				{isFavorited ? (
					<StarIcon sx={{ color: "#facc15" }} />
				) : (
					<StarBorderIcon sx={{ color: "#9ca3af" }} />
				)}
			</IconButton>
		</Tooltip>
	);
}

export default FavoriteButton;
