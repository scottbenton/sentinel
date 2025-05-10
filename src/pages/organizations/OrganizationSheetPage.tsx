import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { Button, Group } from "@chakra-ui/react";
import { Link } from "wouter";
import { pageConfig } from "../pageConfig";
import { Alert } from "@/components/ui/alert";
import { ExternalLinkIcon } from "lucide-react";
import {
  useCurrentOrganization,
  useOrganizationsStore,
} from "@/stores/organizations.store";
import { useDashboardId } from "@/hooks/useDashboardId";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import {
  useDashboardStore,
  useIsDashboardAdmin,
} from "@/stores/dashboard.store";
import { MeetingsSection } from "./MeetingsSection";
import { OrganizationDescription } from "./OrganizationDescription";
import { OrganizationLog } from "./OrganizationLog";

export default function OrganizationSheetPage() {
  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();

  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );
  const org = useCurrentOrganization((org) => org);
  const orgsLoading = useOrganizationsStore(
    (state) => state.organizationsLoading
  );
  const orgsError = useOrganizationsStore((state) => state.organizationsError);

  const isAdmin = useIsDashboardAdmin();

  return (
    <>
      <PageHeader
        title={org?.name ?? (orgsError ? "Error" : "Loading")}
        breadcrumbs={[
          { title: dashboardName, href: pageConfig.dashboard(dashboardId) },
          { title: org?.name ?? "Loading" },
        ]}
        action={
          <Group>
            {isAdmin ? (
              <Button asChild variant="subtle">
                <Link
                  href={pageConfig.organizationEdit(
                    dashboardId,
                    organizationId
                  )}
                >
                  Edit
                </Link>
              </Button>
            ) : undefined}
            {org?.url && (
              <Button asChild>
                <a href={org?.url} target="_blank">
                  Visit Website
                  <ExternalLinkIcon />
                </a>
              </Button>
            )}
          </Group>
        }
      />
      <PageContent
        p={4}
        display="flex"
        flexDir="column"
        gap={6}
        sidebarContent={<OrganizationLog />}
      >
        <PageProgressBar loading={orgsLoading} />
        {orgsError && <Alert status="error">{orgsError}</Alert>}
        {org && (
          <>
            <OrganizationDescription />
            <MeetingsSection />
          </>
        )}
      </PageContent>
    </>
  );
}
