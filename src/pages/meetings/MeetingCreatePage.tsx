import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { MeetingForm } from "./MeetingForm";
import { Alert } from "@/components/ui/alert";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useCurrentOrganization } from "@/stores/organizations.store";
import { pageConfig } from "../pageConfig";

export default function MeetingCreatePage() {
  const dashboardId = useDashboardId();
  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );

  const organizationId = useOrganizationId();
  const organizationName = useCurrentOrganization((org) => org?.name ?? "");

  return (
    <>
      <PageHeader
        title="Add Meeting"
        maxW="breakpoint-sm"
        breadcrumbs={[
          {
            title: dashboardName,
            href: pageConfig.dashboard(dashboardId),
          },
          {
            title: organizationName,
            href: pageConfig.organization(dashboardId, organizationId),
          },
          { title: "Add Meeting" },
        ]}
      />
      <PageContent p={4} maxW="breakpoint-sm">
        <Alert
          status="warning"
          title="You might not need to add meetings manually"
          mb={4}
        >
          If this organization's sync integration is working, any upcoming
          meetings that appear on the linked page will be added automatically
          the next time the sync job runs.
        </Alert>
        <MeetingForm />
      </PageContent>
    </>
  );
}
