import { useMemo } from "react";
import { IconButton, Menu, Text, Box, Badge, Button } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import {
  useNotificationsStore,
  useSyncNotifications,
} from "../../../notifications/notifications.store";
import { NotificationItem } from "./NotificationItem";
import { useUID } from "@/stores/auth.store";

export function NotificationBell() {
  useSyncNotifications();

  const uid = useUID();
  const notifications = useNotificationsStore((state) =>
    Object.values(state.notifications).sort(
      (n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime(),
    ),
  );
  const deleteAllNotifications = useNotificationsStore(
    (store) => store.deleteAllNotifications,
  );

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.hasBeenRead).length;
  }, [notifications]);

  const handleClearAll = () => {
    if (uid) {
      deleteAllNotifications(uid).catch(console.error);
    }
  };

  return (
    <Box position="relative">
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            colorPalette={"gray"}
            aria-label="Notifications"
            variant="ghost"
          >
            <Bell />
          </IconButton>
        </Menu.Trigger>
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorPalette="red"
            borderRadius="full"
            variant="solid"
          >
            {unreadCount}
          </Badge>
        )}
        <Menu.Positioner>
          <Menu.Content maxH="400px" overflowY="auto">
            {notifications.length === 0 ? (
              <Menu.Item value="empty">
                <Text>No notifications</Text>
              </Menu.Item>
            ) : (
              <>
                <Box p={2} borderBottomWidth={1} borderColor="border">
                  <Button
                    size="sm"
                    variant="ghost"
                    width="100%"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                </Box>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
}
