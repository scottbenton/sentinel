import { useParams } from "wouter";

export function useDashboardId() {
  const dashboardId = useParams<{ dashboardId: string }>().dashboardId;

  if (!dashboardId) {
    throw new Error("Dashboard ID not found");
  }
  const dashboardIdInt = parseInt(dashboardId);
  if (isNaN(dashboardIdInt)) {
    throw new Error("Invalid dashboard ID");
  }
  return dashboardIdInt;
}
