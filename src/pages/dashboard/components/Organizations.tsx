import { ProgressBar } from "@/components/common/ProgressBar";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Tag } from "@/components/ui/tag";
import { useDashboardId } from "@/hooks/useDashboardId";
import { getDateString } from "@/lib/getDateString";
import { pageConfig } from "@/pages/pageConfig";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useIsDashboardAdmin } from "@/stores/dashboard.store";
import { useOrganizationsStore } from "@/stores/organizations.store";
import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Menu,
  Span,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  AlertTriangle,
  LandmarkIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import { useCallback } from "react";
import { Link } from "wouter";

export function Organizations() {
  const dashboardId = useDashboardId();

  const error = useOrganizationsStore((store) => store.organizationsError);
  const loading = useOrganizationsStore((store) => store.organizationsLoading);
  const organizations = useOrganizationsStore((store) =>
    Object.values(store.organizations).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  );

  const isAdmin = useIsDashboardAdmin();
  const confirm = useConfirm();

  const deleteOrganization = useOrganizationsStore(
    (store) => store.deleteOrganization
  );
  const handleDeleteOrganization = useCallback(
    (orgId: number) => {
      confirm({
        title: "Delete Organization",
        message: "Are you sure you want to delete this organization?",
      })
        .then(({ confirmed }) => {
          if (confirmed) {
            deleteOrganization(orgId).catch((e) => {
              console.error(e);
            });
          }
        })
        .catch(() => {});
    },
    [confirm, deleteOrganization]
  );

  return (
    <Box mt={8}>
      <Box display="flex" alignItems="center" justifyContent={"space-between"}>
        <Heading>Organizations</Heading>
        {isAdmin && (
          <Button variant="subtle" asChild>
            <Link to={pageConfig.organizationCreate(dashboardId)}>
              Add Organization <PlusIcon />
            </Link>
          </Button>
        )}
      </Box>
      {error && (
        <Alert status="error" mt={4}>
          <Icon as={AlertTriangle} />
          <Text ml={2}>{error}</Text>
        </Alert>
      )}
      {loading && <ProgressBar mt={4} />}
      {!loading &&
        (organizations.length > 0 ? (
          <Table.Root variant="outline" mt={4} borderRadius="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Organization</Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"end"}>
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {organizations.map((org) => (
                <Table.Row key={org.id}>
                  <Table.Cell display="flex" alignItems="center">
                    <Box>
                      <Heading
                        as="span"
                        size="md"
                        display="flex"
                        alignItems="baseline"
                      >
                        {org.name}
                        {org.syncError && (
                          <Tag ml={1} colorPalette={"red"}>
                            Sync Error
                          </Tag>
                        )}
                      </Heading>
                      <Text color="fg.muted">
                        Last Synced{" "}
                        <Span color="fg">{getDateString(org.lastSynced)}</Span>
                      </Text>
                    </Box>
                  </Table.Cell>
                  <Table.Cell textAlign={"end"}>
                    <Button asChild variant="ghost">
                      <Link to={pageConfig.organization(dashboardId, org.id)}>
                        View
                      </Link>
                    </Button>
                    {isAdmin && (
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <IconButton
                            aria-label="More Actions"
                            variant="ghost"
                            colorPalette="gray"
                          >
                            <MoreVerticalIcon />
                          </IconButton>
                        </Menu.Trigger>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value={"edit"} asChild>
                              <Link
                                to={pageConfig.organizationEdit(
                                  dashboardId,
                                  org.id
                                )}
                              >
                                Edit
                              </Link>
                            </Menu.Item>
                            <Menu.Item
                              value={"delete"}
                              onClick={() => handleDeleteOrganization(org.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Menu.Root>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : (
          <EmptyState
            title="No Organizations"
            description="Use organizations to keep track of meetings for groups (such as a school board or local government)."
            icon={<LandmarkIcon />}
          />
        ))}
    </Box>
  );
}
