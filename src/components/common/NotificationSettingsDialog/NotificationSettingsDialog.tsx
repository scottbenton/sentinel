import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@/components/common/Dialog/Dialog";
import { Button, Stack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationType } from "@/notifications/notifications.service";
import { useNotificationSettingsStore } from "@/stores/notificationSettings.store";
import { useUID } from "@/stores/auth.store";
import { Alert } from "@/components/ui/alert";

export interface NotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardId: number;
}

export function NotificationSettingsDialog(
  props: NotificationSettingsDialogProps,
) {
  const { isOpen, onClose, dashboardId } = props;

  const uid = useUID();
  const settings = useNotificationSettingsStore((s) => s.settings);
  const isLoading = useNotificationSettingsStore((s) => s.isLoading);
  const error = useNotificationSettingsStore((s) => s.error);
  const updateSettings = useNotificationSettingsStore((s) => s.updateSettings);

  const [notifyOnMeetingCreated, setNotifyOnMeetingCreated] = useState(false);
  const [notifyOnCommentAdded, setNotifyOnCommentAdded] = useState(false);
  const [autoWatchNewMeetings, setAutoWatchNewMeetings] = useState(false);

  // Load current settings into local state
  useEffect(() => {
    if (settings) {
      setNotifyOnMeetingCreated(
        settings.enabledNotificationTypes.includes(
          NotificationType.MeetingCreated,
        ),
      );
      setNotifyOnCommentAdded(
        settings.enabledNotificationTypes.includes(
          NotificationType.CommentAdded,
        ),
      );
      setAutoWatchNewMeetings(settings.autoWatchNewMeetings);
    }
  }, [settings]);

  const handleSave = useCallback(() => {
    if (!uid) return;

    const enabledNotificationTypes: NotificationType[] = [];
    if (notifyOnMeetingCreated) {
      enabledNotificationTypes.push(NotificationType.MeetingCreated);
    }
    if (notifyOnCommentAdded) {
      enabledNotificationTypes.push(NotificationType.CommentAdded);
    }

    updateSettings(
      uid,
      dashboardId,
      enabledNotificationTypes,
      autoWatchNewMeetings,
    ).then(() => {
      onClose();
    });
  }, [
    uid,
    dashboardId,
    notifyOnMeetingCreated,
    notifyOnCommentAdded,
    autoWatchNewMeetings,
    updateSettings,
    onClose,
  ]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      title="Notification Settings"
      content={
        <Stack gap={4}>
          {error && (
            <Alert status="error" title="Error loading settings">
              {error}
            </Alert>
          )}

          <Checkbox
            checked={notifyOnMeetingCreated}
            onCheckedChange={(details) =>
              setNotifyOnMeetingCreated(details.checked === true)
            }
            disabled={isLoading}
          >
            Notify me when a new meeting is created in an organization I am
            watching
          </Checkbox>

          <Checkbox
            checked={notifyOnCommentAdded}
            onCheckedChange={(details) =>
              setNotifyOnCommentAdded(details.checked === true)
            }
            disabled={isLoading}
          >
            Notify me when a comment is added to a meeting I am watching
          </Checkbox>

          <Checkbox
            checked={autoWatchNewMeetings}
            onCheckedChange={(details) =>
              setAutoWatchNewMeetings(details.checked === true)
            }
            disabled={isLoading}
          >
            Automatically watch new meetings in organizations I am watching
          </Checkbox>
        </Stack>
      }
      actions={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </>
      }
    />
  );
}
