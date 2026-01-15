// client/src/features/landing/about/utils/aboutFeatures.js

// Icons are passed in from the page so this file stays “data-only”.
export const ABOUT_FEATURES = [
	{
		key: "mission-library",
		title: "Mission library",
		description: "Explore missions by category, difficulty, and tags—built to match real life.",
		chips: ["Categories", "Difficulty", "Tags"],
		tone: "green",
		iconKey: "public",
	},
	{
		key: "smart-search",
		title: "Smart search",
		description: "Search within pages or use global search to jump straight to the right screen.",
		chips: ["In-page filter", "Global navigation"],
		tone: "blue",
		iconKey: "search",
	},
	{
		key: "saved-missions",
		title: "Saved missions",
		description: "Bookmark missions you want to do later and keep a personal queue.",
		chips: ["Favorites", "Quick access"],
		tone: "amber",
		iconKey: "favorite",
	},
	{
		key: "submissions-approvals",
		title: "Submissions & approvals",
		description: "Submit proof when required. Approval turns effort into verified progress.",
		chips: ["Pending", "Approved", "Rejected"],
		tone: "green",
		iconKey: "verified",
	},
	{
		key: "checkins-impact",
		title: "Check-ins & impact",
		description: "Approved completions become check-ins: points earned + CO₂/water/waste tracked.",
		chips: ["History", "Totals", "Impact"],
		tone: "green",
		iconKey: "stars",
	},
	{
		key: "leaderboard",
		title: "Community leaderboard",
		description: "See your rank and climb the leaderboard through consistent progress.",
		chips: ["Rank", "Points", "Community"],
		tone: "blue",
		iconKey: "leaderboard",
	},
	{
		key: "chat",
		title: "Chat with other users",
		description: "Connect, coordinate missions, share tips, and stay accountable together.",
		chips: ["Online status", "Unread badge", "Realtime"],
		tone: "green",
		iconKey: "chat",
	},
	{
		key: "admin",
		title: "Admin moderation",
		description: "Admins can approve/reject submissions (with reasons) and manage users.",
		chips: ["Moderation", "User management"],
		tone: "amber",
		iconKey: "admin",
	},
];
