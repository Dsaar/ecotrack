// client/src/features/dashboard/activity/components/ActivityTabs.jsx
import { Tab, Tabs } from "@mui/material";

export default function ActivityTabs({
	tab,
	setTab,
	checkinsCount,
	pendingCount,
	rejectedCount,
}) {
	return (
		<Tabs
			value={tab}
			onChange={(_e, v) => setTab(v)}
			variant="scrollable"
			scrollButtons="auto"
			sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700 } }}
		>
			<Tab value="approved" label={`Approved (${checkinsCount})`} />
			<Tab value="pending" label={`Pending (${pendingCount})`} />
			<Tab value="rejected" label={`Rejected (${rejectedCount})`} />
		</Tabs>
	);
}
