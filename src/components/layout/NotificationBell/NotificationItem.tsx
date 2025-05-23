import { INotification } from "@/notifications/notifications.service";
import { useNotificationsStore } from "@/notifications/notifications.store";
import { pageConfig } from "@/pages/pageConfig";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import { Box, Button, HStack, Menu, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { Link } from "wouter";

export interface NotificationItemProps {
  notification: INotification;
}

export function NotificationItem(props: NotificationItemProps) {
  const { notification } = props;

  const deleteNotification = useNotificationsStore(
    (store) => store.deleteNotification
  );
  const deleteInvite = useDashboardUserInvitesStore(
    (store) => store.deleteInvite
  );

  if (notification.type === "user_invited") {
    return (
      <NotificationItemWrapper
        notification={notification}
        text={`${notification.inviterName} invited you to join ${notification.dashboardName}`}
        actions={
          <>
            <Button size="sm" asChild variant="subtle">
              <Link href={pageConfig.inviteLink(notification.inviteId)}>
                Accept
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={() => {
                deleteInvite(notification.inviteId).catch(() => {});
                deleteNotification(notification.id).catch(() => {});
              }}
            >
              Decline
            </Button>
          </>
        }
      />
    );
  }

  return null;
}

function NotificationItemWrapper(props: {
  notification: INotification;
  href?: string;
  onClick?: () => void;
  text: string;
  actions?: ReactNode;
}) {
  const { notification, text, actions } = props;

  return (
    <Menu.Item value={notification.id}>
      <Box width="100%">
        <Text fontSize="sm">{text}</Text>
        <Text fontSize="xs" color="fg.muted">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </Text>
        {actions && (
          <HStack mt={1} gap={1}>
            {actions}
          </HStack>
        )}
      </Box>
    </Menu.Item>
  );
}
