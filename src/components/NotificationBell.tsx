import { useEffect, useRef } from "react";
import {
  IconButton,
  Menu,
  Text,
  Box,
  Badge,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { useNotificationsStore } from "../notifications/notifications.store";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { NotificationWithActions } from "../notifications/notifications.service";
import { toaster } from "./ui/toaster";

interface NotificationItemProps {
  notification: NotificationWithActions;
  onAction: (
    notificationId: string,
    action: "accept" | "decline"
  ) => Promise<void>;
}

const NotificationItem = ({
  notification,
  onAction,
}: NotificationItemProps) => {
  const { additional_context } = notification;

  if (notification.type !== "user_invited") {
    return null;
  }

  return (
    <Menu.Item value={notification.id}>
      <VStack width="100%" gap={2}>
        <Text fontSize="sm">
          {`${additional_context.inviter_name} invited you to join ${additional_context.dashboard_name}`}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </Text>
        <HStack gap={2}>
          <Link href={`/accept-invite/${additional_context.invite_id}`}>
            <Button size="sm" colorScheme="blue">
              Accept
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(notification.id, "decline")}
          >
            Decline
          </Button>
        </HStack>
      </VStack>
    </Menu.Item>
  );
};

export function NotificationBell() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const deleteNotification = useNotificationsStore(
    (state) => state.deleteNotification
  );

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    subscribeToNotifications();
    return () => unsubscribeFromNotifications();
  }, []);

  const handleAction = async (
    notificationId: string,
    action: "accept" | "decline"
  ) => {
    if (action === "decline") {
      await deleteNotification(notificationId);
      toaster.create({
        title: "Invitation declined",
        type: "info",
      });
    }
  };

  return (
    <Box position="relative">
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="Notifications" variant="ghost">
            <Bell />
          </IconButton>
        </Menu.Trigger>
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorScheme="red"
            borderRadius="full"
          >
            {unreadCount}
          </Badge>
        )}
        <Menu.Positioner>
          <Menu.Content maxH="400px" overflowY="auto" ref={menuRef}>
            {notifications.length === 0 ? (
              <Menu.Item value="empty">
                <Text>No notifications</Text>
              </Menu.Item>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onAction={handleAction}
                />
              ))
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
}
