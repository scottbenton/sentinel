import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Box,
  Button,
  Card,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { Link } from "wouter";
import { pageConfig } from "../pageConfig";
import {
  useUsersDashboardsStore,
  useLoadUsersDashboards,
} from "@/stores/users-dashboards.store";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { Alert } from "@/components/ui/alert";
import { ChevronRightIcon } from "lucide-react";

export default function DashboardSelectPage() {
  useLoadUsersDashboards();

  const dashboards = useUsersDashboardsStore((store) => {
    return Object.values(store.dashboards).sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
  });
  const dashboardsLoading = useUsersDashboardsStore((store) => store.loading);
  const dashboardsError = useUsersDashboardsStore((store) => store.error);

  return (
    <>
      <PageHeader
        title="Your Dashboards"
        action={
          <Button asChild>
            <Link to={pageConfig.dashboardCreate}>Create Dashboard</Link>
          </Button>
        }
      />
      <PageContent p={4} display="flex" flexDirection="column" gap={4}>
        <PageProgressBar loading={dashboardsLoading} />
        {dashboardsError && (
          <Alert status="error" maxW="60ch">
            {dashboardsError}
          </Alert>
        )}
        {dashboards.length > 0 && (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(350px, 1fr))"
            gap={4}
          >
            {dashboards.map((dashboard) => (
              <Card.Root
                asChild
                variant="outline"
                key={dashboard.id}
                h="100%"
                _hover={{ bg: "bg.muted" }}
              >
                <LinkBox>
                  <Card.Body
                    display="flex"
                    flexDir="row"
                    justifyContent={"space-between"}
                    gap={2}
                  >
                    <Heading>
                      <LinkOverlay asChild>
                        <Link to={pageConfig.dashboard(dashboard.id)}>
                          {dashboard.label}
                        </Link>
                      </LinkOverlay>
                    </Heading>
                    <Icon asChild color="fg.subtle" alignSelf="center">
                      <ChevronRightIcon />
                    </Icon>
                  </Card.Body>
                </LinkBox>
              </Card.Root>
            ))}
          </Box>
        )}
        {!dashboardsLoading && dashboards.length === 0 && (
          <Alert status="info" title="No Dashboards" maxW="60ch">
            You don't have any dashboards yet. You can either create a dashboard
            or ask an admin of an existing dashboard to add you to it.
          </Alert>
        )}
      </PageContent>
    </>
  );
}
