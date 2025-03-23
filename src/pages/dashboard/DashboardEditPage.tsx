import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardForm } from "./components/DashboardForm";
import { useDashboardStore } from "@/stores/dashboard.store";
import { Alert } from "@/components/ui/alert";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { pageConfig } from "../pageConfig";

export default function DashboardEditPage() {
  const dashboard = useDashboardStore((store) => store.dashboard);
  const dashboardLoading = useDashboardStore((store) => store.loading);
  const dashboardError = useDashboardStore((store) => store.error);

  if (dashboardError) {
    return (
      <>
        <PageHeader title="Edit Dashboard" maxW="breakpoint-sm" />
        <PageContent p={4} maxW="breakpoint-sm">
          <Alert status="error">{dashboardError}</Alert>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Dashboard"
        maxW="breakpoint-sm"
        breadcrumbs={[
          {
            title: dashboard?.label ?? "Loading",
            href: dashboard ? pageConfig.dashboard(dashboard.id) : undefined,
          },
          { title: "Edit" },
        ]}
      />
      <PageContent p={4} maxW="breakpoint-sm">
        <PageProgressBar loading={dashboardLoading} />
        {dashboard && <DashboardForm existingDashboard={dashboard} />}
      </PageContent>
    </>
  );
}
