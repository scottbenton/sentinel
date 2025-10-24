import {
  INotification,
  NotificationType,
} from "@/notifications/notifications.service";
import { useNotificationsStore } from "@/notifications/notifications.store";
import { pageConfig } from "@/pages/pageConfig";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import { Box, Button, HStack, Menu, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { ReactNode } from "react";
import { Link, useLocation } from "wouter";

export interface NotificationItemProps {
  notification: INotification;
}

export function NotificationItem(props: NotificationItemProps) {
  const { notification } = props;
  const [, setLocation] = useLocation();

  const deleteNotification = useNotificationsStore(
    (store) => store.deleteNotification,
  );
  const deleteInvite = useDashboardUserInvitesStore(
    (store) => store.deleteInvite,
  );

  const markNotificationAsRead = useNotificationsStore(
    (store) => store.markNotificationAsRead,
  );

  if (notification.type === NotificationType.UserInvitation) {
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

  if (notification.type === NotificationType.MeetingCreated) {
    const meetingUrl = `/dashboard/${notification.organizationId}/meeting/${notification.meetingId}`;
    return (
      <NotificationItemWrapper
        notification={notification}
        text={`New meeting: ${notification.meetingName} in ${notification.organizationName}`}
        onClick={() => {
          markNotificationAsRead(notification.id);
          setLocation(meetingUrl);
        }}
      />
    );
  }

  if (notification.type === NotificationType.CommentAdded) {
    const url = notification.meetingId
      ? `/dashboard/${notification.organizationId}/meeting/${notification.meetingId}`
      : `/dashboard/${notification.organizationId}`;

    const locationText = notification.meetingName
      ? `on ${notification.meetingName}`
      : `in ${notification.organizationName}`;

    return (
      <NotificationItemWrapper
        notification={notification}
        text={`New comment ${locationText}`}
        onClick={() => {
          markNotificationAsRead(notification.id);
          setLocation(url);
        }}
      />
    );
  }

  if (notification.type === NotificationType.MeetingDocumentAdded) {
    const meetingUrl = `/dashboard/${notification.organizationId}/meeting/${notification.meetingId}`;
    return (
      <NotificationItemWrapper
        notification={notification}
        text={`New document added to ${notification.meetingName}`}
        onClick={() => {
          markNotificationAsRead(notification.id);
          setLocation(meetingUrl);
        }}
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
  const { notification, text, actions, onClick } = props;

  return (
    <Menu.Item
      value={notification.id}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
    >
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
