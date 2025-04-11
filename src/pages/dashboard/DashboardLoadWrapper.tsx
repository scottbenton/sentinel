import { useListenToCurrentDashboard } from "@/stores/dashboard.store";
import { useSyncDashboardUsers } from "@/stores/dashboardUsers.store";
import { useSyncFutureMeetings } from "@/stores/meetings.store";
import { useSyncOrganizations } from "@/stores/organizations.store";
import { PropsWithChildren } from "react";

export function DashboardLoadWrapper(props: PropsWithChildren) {
  const { children } = props;
  useListenToCurrentDashboard();
  useSyncOrganizations();
  useSyncFutureMeetings();
  useSyncDashboardUsers();

  return children;
}
