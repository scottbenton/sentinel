export interface IMeeting {
  id: string;
  dashboardId: string;
  organizationId: string;

  meetingLabel: string;
  meetingDate: Date;

  addedOn: Date;
  addedBy: string | null;
}
