import { useDashboardUsersStore } from "@/stores/dashboardUsers.store";
import { Box, Button, Clipboard, Table, Text } from "@chakra-ui/react";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import { IDashboardUserInvite } from "@/services/dashboardUserInvites.service";

interface UserInviteTableProps {
  canManageUsers: boolean;
}

export function UserInviteTable(props: UserInviteTableProps) {
  const { canManageUsers } = props;

  const users = useDashboardUsersStore((store) => store.dashboardUsers);
  const dashboardUserInvites = useDashboardUserInvitesStore(
    (store) => store.invites
  );

  const confirm = useConfirm();
  const deleteInvite = useDashboardUserInvitesStore(
    (store) => store.deleteInvite
  );

  const handleRemoveInvite = (user: IDashboardUserInvite) => {
    confirm({
      title: `Delete the invite for ${user.email}?`,
      message: `This action cannot be undone.`,
      cancelText: "Cancel",
      confirmText: "Remove",
    })
      .then(({ confirmed }) => {
        if (confirmed) {
          deleteInvite(user.id).catch(() => {});
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <Text fontSize="lg" fontWeight="bold">
        Invited Users
      </Text>
      <Table.Root mb={8} mx={-2}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Invited By</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"end"}>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dashboardUserInvites.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                {users[user.invitedBy]?.name ?? "Unknown User"}
              </Table.Cell>
              <Table.Cell>
                <Box display="flex" gap={1} justifyContent="end">
                  {canManageUsers && (
                    <>
                      <Clipboard.Root
                        value={`${window.location.origin}/invite/${user.id}`}
                      >
                        <Clipboard.Trigger asChild>
                          <Button variant="ghost">
                            <Clipboard.Indicator />
                            Copy Invite Link
                          </Button>
                        </Clipboard.Trigger>
                      </Clipboard.Root>
                      <Button
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => handleRemoveInvite(user)}
                      >
                        Rescind Invitation
                      </Button>
                    </>
                  )}
                </Box>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
