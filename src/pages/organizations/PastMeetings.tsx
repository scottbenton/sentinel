import { ProgressBar } from "@/components/common/ProgressBar";
import { Alert } from "@/components/ui/alert";
import { useMeetingsStore, useSyncPastMeetings } from "@/stores/meetings.store";
import { MeetingCardList } from "../meetings/MeetingCardList";

export function PastMeetings() {
  useSyncPastMeetings();

  const pastMeetingsLoading = useMeetingsStore(
    (store) => store.loadingPastMeetings
  );
  const pastMeetingsError = useMeetingsStore(
    (store) => store.pastMeetingsError
  );
  const pastMeetings = useMeetingsStore((store) =>
    Object.values(store.pastMeetings).sort(
      (a, b) => b.meetingDate.getTime() - a.meetingDate.getTime()
    )
  );

  return (
    <>
      {pastMeetingsLoading && <ProgressBar />}
      {pastMeetingsError && <Alert status="error">{pastMeetingsError}</Alert>}
      {!pastMeetingsLoading && (
        <MeetingCardList meetings={pastMeetings} emptyText="No past meetings" />
      )}
    </>
  );
}
