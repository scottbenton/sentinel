import { PageHeader } from "@/components/layout/PageHeader";
import { MeetingForm } from "./MeetingForm";
import { PageContent } from "@/components/layout/PageContent";
import { useMeetingsStore } from "@/stores/meetings.store";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { Alert } from "@/components/ui/alert";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useCurrentOrganization } from "@/stores/organizations.store";
import { pageConfig } from "../pageConfig";

export default function MeetingEditPage() {
  const dashboardId = useDashboardId();
  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );

  const organizationId = useOrganizationId();
  const organizationName = useCurrentOrganization((org) => org?.name ?? "");

  const meeting = useMeetingsStore((store) => store.currentMeeting);
  const meetingLoading = useMeetingsStore(
    (store) => store.loadingCurrentMeeting
  );
  const meetingError = useMeetingsStore((store) => store.currentMeetingError);

  return (
    <>
      <PageHeader
        title="Edit Meeting"
        breadcrumbs={[
          { title: dashboardName, href: pageConfig.dashboard(dashboardId) },
          {
            title: organizationName,
            href: pageConfig.organization(dashboardId, organizationId),
          },
          {
            title: meeting?.name ?? "Loading",
            href: meeting
              ? pageConfig.meeting(dashboardId, organizationId, meeting.id)
              : undefined,
          },
          { title: "Edit" },
        ]}
        maxW="breakpoint-sm"
      />
      <PageContent p={4} maxW="breakpoint-sm">
        <PageProgressBar loading={meetingLoading} />
        {meetingError && (
          <Alert status="error" title="Error loading meeting">
            {meetingError}
          </Alert>
        )}
        {meeting && <MeetingForm existingMeeting={meeting} />}
      </PageContent>
    </>
  );
}
