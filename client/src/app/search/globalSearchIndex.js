// src/app/search/globalSearchIndex.js

export const GLOBAL_SEARCH_INDEX = [
	// Dashboard
	{ label: "Overview", keywords: ["home", "overview", "dashboard"], path: "/dashboard" },
	{ label: "Activity", keywords: ["activity", "submissions", "progress"], path: "/dashboard/activity" },
	{ label: "Community", keywords: ["community", "leaderboard", "rank"], path: "/dashboard/community" },
	{ label: "Profile", keywords: ["profile", "account", "settings", "me"], path: "/dashboard/profile" },
	{ label: "Chat", keywords: ["chat", "messages", "dm"], path: "/dashboard/chat" },

	// These exist but you said these pages already do in-page searching
	{ label: "Missions", keywords: ["missions", "tasks", "eco"], path: "/dashboard/missions" },
	{ label: "Saved missions", keywords: ["favorites", "saved", "bookmarks", "star"], path: "/dashboard/favorites" },

	// Admin
	{ label: "Admin · Moderation", keywords: ["admin", "moderation", "submissions", "review"], path: "/dashboard/admin/submissions", adminOnly: true },
	{ label: "Admin · Users (CRM)", keywords: ["admin", "users", "crm", "customers"], path: "/dashboard/admin/users", adminOnly: true },
];
