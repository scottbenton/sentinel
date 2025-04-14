import { PageHeader } from "@/components/layout/PageHeader";
import {
  useDashboardStore,
  useIsDashboardAdmin,
  useIsUserAdmin,
} from "@/stores/dashboard.store";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { PageContent } from "@/components/layout/PageContent";
import { Box } from "@chakra-ui/react";
import { useDashboardUsersStore } from "@/stores/dashboardUsers.store";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { Alert } from "@/components/ui/alert";
import { useEffect, useRef } from "react";
import { UserTable } from "./UserTable";
import { UserInviteDialog } from "./UserInviteDialog";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import { UserInviteTable } from "./UserInviteTable";

export default function UserManagementPageWrapper() {
  const canInviteUsers = useIsUserAdmin();
  const canManageUsers = useIsDashboardAdmin();

  if (!canInviteUsers && !canManageUsers) {
    return <></>;
  }

  return (
    <UserManagementPage
      canInviteUsers={canInviteUsers}
      canManageUsers={canManageUsers}
    />
  );
}

function UserManagementPage(props: {
  canInviteUsers: boolean;
  canManageUsers: boolean;
}) {
  const { canInviteUsers, canManageUsers } = props;

  const loadAllUsers = useDashboardUsersStore(
    (store) => store.getAllDashboardUsers
  );

  const hasAtLeastOneInvite = useDashboardUserInvitesStore(
    (store) => store.invites.length > 0
  );
  const loadUserInvites = useDashboardUserInvitesStore(
    (store) => store.loadInvites
  );

  const dashboardId = useDashboardId();
  const hasStartedLoadForId = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (
      !hasStartedLoadForId.current ||
      hasStartedLoadForId.current !== dashboardId
    ) {
      hasStartedLoadForId.current = dashboardId;
      loadAllUsers(dashboardId)
        .catch(() => {})
        .finally(() => {
          hasStartedLoadForId.current = undefined;
        });
      loadUserInvites(dashboardId).catch(() => {});
    }
  }, [dashboardId, loadAllUsers, loadUserInvites]);

  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? "Loading"
  );

  const dashboardUsersLoading = useDashboardUsersStore(
    (store) => store.loading
  );
  const dashboardUsersError = useDashboardUsersStore((store) => store.error);

  return (
    <>
      <PageHeader
        title="Manage Users"
        breadcrumbs={[
          {
            title: dashboardName,
            href: pageConfig.dashboard(dashboardId),
          },
        ]}
        action={canInviteUsers && <UserInviteDialog />}
      />
      <PageContent p={4}>
        <PageProgressBar loading={dashboardUsersLoading} />
        {dashboardUsersError && (
          <Alert status="error">{dashboardUsersError}</Alert>
        )}
        {!dashboardUsersLoading && !dashboardUsersError && (
          <Box>
            {hasAtLeastOneInvite && (
              <UserInviteTable canManageUsers={canManageUsers} />
            )}
            <UserTable canManageUsers={canManageUsers} />
          </Box>
        )}
      </PageContent>
    </>
  );
}
