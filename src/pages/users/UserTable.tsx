import { IDashboardUser } from "@/services/dashboardUsers.service";
import { useUID } from "@/stores/auth.store";
import { useDashboardUsersStore } from "@/stores/dashboardUsers.store";
import { Box, Button, Table, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UserRoleDialog } from "./UserRoleDialog";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useLocation } from "wouter";
import { pageConfig } from "../pageConfig";

interface UserTableProps {
  canManageUsers: boolean;
}

export function UserTable(props: UserTableProps) {
  const { canManageUsers } = props;
  const uid = useUID();
  const dashboardUsers = useDashboardUsersStore((store) =>
    Object.values(store.dashboardUsers).sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
  );

  const [roleDialogState, setRoleDialogState] = useState<
    | {
        open: false;
        user: IDashboardUser | null;
      }
    | {
        open: true;
        user: IDashboardUser;
      }
  >({
    open: false,
    user: null,
  });

  const handleOpenRoleDialog = (user: IDashboardUser) => {
    setRoleDialogState({
      open: true,
      user,
    });
  };
  const handleCloseRoleDialog = () => {
    setRoleDialogState((prev) => ({ ...prev, open: false }));
  };

  const confirm = useConfirm();
  const deleteDashboardUser = useDashboardUsersStore(
    (store) => store.deleteDashboardUser
  );
  const navigate = useLocation()[1];
  const handleRemoveUser = (user: IDashboardUser) => {
    confirm({
      title: `Remove ${user.name} from this dashboard?`,
      message: `This action cannot be undone.`,
      cancelText: "Cancel",
      confirmText: "Remove",
    })
      .then(({ confirmed }) => {
        if (confirmed) {
          deleteDashboardUser(user.user_id, user.dashboard_id).catch(() => {});
          if (user.user_id === uid) {
            navigate(pageConfig.dashboards);
          }
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <Text fontSize="lg" fontWeight="bold">
        Users
      </Text>
      <Table.Root mb={8} mx={-2}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Roles</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"end"}>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dashboardUsers.map((user) => (
            <Table.Row key={user.user_id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{getUserRoles(user).join(", ")}</Table.Cell>
              <Table.Cell>
                <Box display="flex" gap={1} justifyContent="end">
                  {canManageUsers && (
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenRoleDialog(user)}
                    >
                      Edit Roles
                    </Button>
                  )}
                  {canManageUsers && uid !== user.user_id && (
                    <Button
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleRemoveUser(user)}
                    >
                      Remove
                    </Button>
                  )}
                  {uid === user.user_id && (
                    <Button
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleRemoveUser(user)}
                    >
                      Leave
                    </Button>
                  )}
                </Box>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <UserRoleDialog
        isOpen={roleDialogState.open}
        onClose={handleCloseRoleDialog}
        user={roleDialogState.user}
      />
    </>
  );
}
enum UserRoles {
  Viewer = "Viewer",
  Editor = "Meeting Editor",
  Inviter = "Inviter",
  Admin = "Admin",
}

function getUserRoles(user: IDashboardUser): UserRoles[] {
  if (user.isAdmin) {
    return [UserRoles.Admin];
  }
  const roles: UserRoles[] = [];
  if (user.canManageUsers) {
    roles.push(UserRoles.Inviter);
  }
  if (user.canManageMeetings) {
    roles.push(UserRoles.Editor);
  }
  if (roles.length === 0) {
    return [UserRoles.Viewer];
  }
  return roles;
}
