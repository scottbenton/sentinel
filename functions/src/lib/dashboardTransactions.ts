import { getFirestore } from "firebase-admin/firestore";

export interface DashboardDTO {
  label: string;

  userIds: string[];
  userAdminIds: string[];
  adminIds: string[];
}

export async function getDashboard(dashboardId: string): Promise<DashboardDTO> {
  const db = getFirestore();

  const doc = await db.collection("dashboards").doc(dashboardId).get();

  const data = doc.data();

  if (!data) {
    throw new Error("Dashboard not found");
  }

  return data as DashboardDTO;
}

export async function checkIfUserIsAdmin(dashboardId: string, userId: string) {
  const dashboard = await getDashboard(dashboardId);

  if (!dashboard.adminIds.includes(userId)) {
    return false;
  }

  return true;
}
