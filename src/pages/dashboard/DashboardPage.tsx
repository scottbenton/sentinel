import { ProgressBar } from "@/components/common/ProgressBar";
import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, Group } from "@chakra-ui/react";
import { UpcomingMeetings } from "./components/UpcomingMeetings";
import { Organizations } from "./components/Organizations";
import { pageConfig } from "../pageConfig";
import {
  useDashboardStore,
  useIsDashboardAdmin,
  useIsUserAdmin,
} from "@/stores/dashboard.store";
import { Link } from "wouter";

export default function DashboardPage() {
  const dashboard = useDashboardStore((store) => store.dashboard);
  const dashboardsLoading = useDashboardStore((store) => store.loading);
  const dashboardsError = useDashboardStore((store) => store.error);

  const isDashboardAdmin = useIsDashboardAdmin();
  const isDashboardUserAdmin = useIsUserAdmin();

  if (dashboardsLoading) {
    return <ProgressBar />;
  }

  if (dashboardsError || !dashboard) {
    return (
      <>
        <PageHeader
          breadcrumbs={[
            {
              title: "Dashboards",
              href: pageConfig.dashboards,
            },
          ]}
          title="Error"
        />
        <PageContent>{dashboardsError}</PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          {
            title: "Dashboards",
            href: pageConfig.dashboards,
          },
          {
            title: dashboard.label,
          },
        ]}
        title={dashboard.label}
        action={
          <Group>
            {isDashboardUserAdmin && (
              <Button variant="subtle">Manage Users</Button>
            )}
            {isDashboardAdmin && (
              <Button variant="subtle" asChild>
                <Link to={pageConfig.dashboardEdit(dashboard.id)}>
                  Edit Dashboard
                </Link>
              </Button>
            )}
          </Group>
        }
      />
      <PageContent p={4}>
        <UpcomingMeetings />
        <Organizations />
      </PageContent>
    </>
  );
}
