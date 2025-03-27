import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/alert";
import { OrganizationForm } from "./OrganizationForm";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import {
  useCurrentOrganization,
  useOrganizationsStore,
} from "@/stores/organizations.store";
import {
  useDashboardStore,
  useIsDashboardAdmin,
} from "@/stores/dashboard.store";

export default function OrganizationSheetPage() {
  const org = useCurrentOrganization((org) => org);
  const loading = useOrganizationsStore((state) => state.organizationsLoading);
  const error = useOrganizationsStore((state) => state.organizationsError);

  const isAdmin = useIsDashboardAdmin();

  const dashboardId = useDashboardId();
  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );

  if (!isAdmin) return <></>;

  return (
    <>
      <PageHeader
        maxW="breakpoint-sm"
        title="Edit Organization"
        breadcrumbs={[
          { title: dashboardName, href: pageConfig.dashboard(dashboardId) },
          {
            title: org?.name ?? "Loading",
            href: org
              ? pageConfig.organization(dashboardId, org.id)
              : undefined,
          },
          { title: "Edit" },
        ]}
      />

      <PageContent maxW="breakpoint-sm" p={4}>
        <PageProgressBar loading={loading} />

        {error && (
          <Alert status="error" title="Error">
            {error}
          </Alert>
        )}

        {org && <OrganizationForm existingOrganization={org} />}
      </PageContent>
    </>
  );
}
