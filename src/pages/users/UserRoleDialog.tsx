import { Dialog } from "@/components/common/Dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { IDashboardUser } from "@/services/dashboardUsers.service";
import { useDashboardUsersStore } from "@/stores/dashboardUsers.store";
import { Box, Button, DialogActionTrigger } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

export interface UserRoleDialogProps {
  user: IDashboardUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserRoleDialog(props: UserRoleDialogProps) {
  const { user, isOpen, onClose } = props;

  const [isMeetingEditor, setIsMeetingEditor] = useState(
    user?.canManageMeetings ?? false
  );
  const [isInviter, setIsInviter] = useState(user?.canManageUsers ?? false);
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin ?? false);
  useEffect(() => {
    if (isOpen) {
      setIsMeetingEditor(user?.canManageMeetings ?? false);
      setIsInviter(user?.canManageUsers ?? false);
      setIsAdmin(user?.isAdmin ?? false);
    }
  }, [user, isOpen]);

  const updateUsersRoles = useDashboardUsersStore(
    (store) => store.updateDashboardUserPermissions
  );

  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateUsersRoles = useCallback(() => {
    if (!user) return;
    setIsLoading(true);
    updateUsersRoles(
      user.user_id,
      user.dashboard_id,
      isMeetingEditor,
      isInviter,
      isAdmin
    )
      .then(() => onClose())
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [user, isMeetingEditor, isInviter, isAdmin, updateUsersRoles, onClose]);

  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={`Edit ${user.name ?? ""}'s roles`}
      content={
        <Box
          display="flex"
          flexDirection="column"
          gap={4}
          alignItems={"flex-start"}
        >
          <Checkbox
            disabled
            checked
            secondaryText="All dashboard users are able to view every organization and its meetings."
          >
            Viewer
          </Checkbox>
          <Checkbox
            checked={isMeetingEditor}
            onCheckedChange={(details) =>
              setIsMeetingEditor(details.checked === true)
            }
            disabled={isAdmin}
            secondaryText="Editors can manage meetings, including creating new ones and adding or removing meeting documents."
          >
            Meeting Editor
          </Checkbox>
          <Checkbox
            checked={isInviter}
            onCheckedChange={(details) =>
              setIsInviter(details.checked === true)
            }
            disabled={isAdmin}
            secondaryText="Inviters can send users a link to join this dashboard. These users will have the Viewer role by default."
          >
            Inviter
          </Checkbox>
          <Checkbox
            checked={isAdmin}
            onCheckedChange={(details) => {
              const isAdmin = details.checked === true;
              setIsAdmin(isAdmin);
              if (isAdmin) {
                setIsMeetingEditor(true);
                setIsInviter(true);
              }
            }}
            secondaryText="Admins can do everything the other roles can, as well as changing other users' roles and creating or deleting organizations."
          >
            Admin
          </Checkbox>
        </Box>
      }
      actions={
        <>
          {" "}
          <DialogActionTrigger>
            <Button variant="ghost">Cancel</Button>
          </DialogActionTrigger>
          <Button loading={isLoading} onClick={handleUpdateUsersRoles}>
            Save Changes
          </Button>
        </>
      }
    />
  );
}
