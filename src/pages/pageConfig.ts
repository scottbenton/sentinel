export const pageConfig = {
  home: "~/",
  auth: "~/auth",

  dashboards: "~/dashboards",
  dashboardCreate: "~/dashboards/create",
  dashboard: (id: number) => `~/dashboards/${id}`,
  dashboardEdit: (id: number) => `~/dashboards/${id}/edit`,

  organization: (dashboardId: number, orgId: number) =>
    `~/dashboards/${dashboardId}/organizations/${orgId}`,
  organizationEdit: (dashboardId: number, orgId: number) =>
    `~/dashboards/${dashboardId}/organizations/${orgId}/edit`,
  organizationCreate: (dashboardId: number) =>
    `~/dashboards/${dashboardId}/organizations/create`,

  meetingCreate: (dashboardId: number, orgId: number) =>
    `~/dashboards/${dashboardId}/organizations/${orgId}/meetings/create`,
  meeting: (dashboardId: number, orgId: number, meetingId: number) =>
    `~/dashboards/${dashboardId}/organizations/${orgId}/meetings/${meetingId}`,
  meetingEdit: (dashboardId: number, orgId: number, meetingId: number) =>
    `~/dashboards/${dashboardId}/organizations/${orgId}/meetings/${meetingId}/edit`,

  userManagement: (dashboardId: number) => `~/dashboards/${dashboardId}/users`,
};
