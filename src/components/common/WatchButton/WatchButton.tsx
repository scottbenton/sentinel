import { Button } from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useWatchersStore } from "@/stores/watchers.store";
import { useUID } from "@/stores/auth.store";
import { useCallback, useState } from "react";

export interface WatchButtonProps {
  type: "organization" | "meeting";
  id: number;
  dashboardId: number;
}

export function WatchButton(props: WatchButtonProps) {
  const { type, id, dashboardId } = props;

  const uid = useUID();
  const isWatchingOrganization = useWatchersStore(
    (s) => s.isWatchingOrganization
  );
  const isWatchingMeeting = useWatchersStore((s) => s.isWatchingMeeting);
  const toggleOrganizationWatch = useWatchersStore(
    (s) => s.toggleOrganizationWatch
  );
  const toggleMeetingWatch = useWatchersStore((s) => s.toggleMeetingWatch);

  const [isLoading, setIsLoading] = useState(false);

  const isWatching =
    type === "organization"
      ? isWatchingOrganization(id)
      : isWatchingMeeting(id);

  const handleToggle = useCallback(async () => {
    if (!uid) return;

    setIsLoading(true);
    try {
      if (type === "organization") {
        await toggleOrganizationWatch(uid, dashboardId, id);
      } else {
        await toggleMeetingWatch(uid, dashboardId, id);
      }
    } catch (error) {
      console.error("Failed to toggle watch:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    uid,
    type,
    id,
    dashboardId,
    toggleOrganizationWatch,
    toggleMeetingWatch,
  ]);

  return (
    <Button
      variant={isWatching ? "solid" : "outline"}
      size="sm"
      onClick={handleToggle}
      loading={isLoading}
    >
      {isWatching ? <EyeOff size={16} /> : <Eye size={16} />}
      {isWatching ? "Unwatch" : "Watch"}
    </Button>
  );
}
