export function getMeetingUrl(
  dashboardId: string,
  organizationId: string,
  meetingId: string,
): string {
  return `${getOrganizationUrl(dashboardId, organizationId)}/meetings/${meetingId}`;
}

export function getOrganizationUrl(
  dashboardId: string,
  organizationId: string,
): string {
  return `${getDashboardUrl(dashboardId)}/organizations/${organizationId}`;
}

export function getDashboardUrl(dashboardId: string): string {
  return `/dashboards/${dashboardId}`;
}
