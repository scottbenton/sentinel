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
import { useState } from "react";
import { Settings } from "lucide-react";
import { NotificationSettingsDialog } from "@/components/common/NotificationSettingsDialog/NotificationSettingsDialog";
import { useSyncNotificationSettings } from "@/stores/notificationSettings.store";
import { useUID } from "@/stores/auth.store";

export default function DashboardPage() {
  const dashboard = useDashboardStore((store) => store.dashboard);
  const dashboardsLoading = useDashboardStore((store) => store.loading);
  const dashboardsError = useDashboardStore((store) => store.error);

  const isDashboardAdmin = useIsDashboardAdmin();
  const isDashboardUserAdmin = useIsUserAdmin();

  const uid = useUID();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load notification settings for this dashboard
  useSyncNotificationSettings(uid, dashboard?.id ?? null);

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
        title={dashboard.label}
        action={
          <Group>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={16} />
              Notification Settings
            </Button>
            {isDashboardUserAdmin && (
              <Button variant="subtle" asChild>
                <Link to={pageConfig.userManagement(dashboard.id)}>
                  Manage Users
                </Link>
              </Button>
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

      <NotificationSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        dashboardId={dashboard.id}
      />
    </>
  );
}
