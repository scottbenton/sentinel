import { useListenToCurrentDashboard } from "@/stores/dashboard.store";
import { useSyncOrganizations } from "@/stores/organizations.store";
import { PropsWithChildren } from "react";

export function DashboardLoadWrapper(props: PropsWithChildren) {
  const { children } = props;
  useListenToCurrentDashboard();
  useSyncOrganizations();

  return children;
}
