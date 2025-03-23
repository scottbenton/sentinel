import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrganizationForm } from "./OrganizationForm";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useDashboardStore } from "@/stores/dashboard.store";

export default function OrganizationCreatePage() {
  const dashboardId = useDashboardId();
  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );
  return (
    <>
      <PageHeader
        maxW="breakpoint-sm"
        title="Add Organization"
        breadcrumbs={[
          { title: dashboardName, href: pageConfig.dashboard(dashboardId) },
          { title: "Add Organization" },
        ]}
      />

      <PageContent maxW="breakpoint-sm" p={4}>
        <OrganizationForm />
      </PageContent>
    </>
  );
}
