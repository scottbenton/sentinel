import { PageHeader } from "@/components/layout/PageHeader";
import { MeetingForm } from "./MeetingForm";
import { PageContent } from "@/components/layout/PageContent";
import { useMeetingsStore } from "@/stores/meetings.store";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { Alert } from "@/components/ui/alert";

export default function MeetingEditPage() {
  const meeting = useMeetingsStore((store) => store.currentMeeting);
  const meetingLoading = useMeetingsStore(
    (store) => store.loadingCurrentMeeting
  );
  const meetingError = useMeetingsStore((store) => store.currentMeetingError);

  return (
    <>
      <PageHeader title="Edit Meeting" maxW="breakpoint-sm" />
      <PageContent p={4} maxW="breakpoint-sm">
        <PageProgressBar loading={meetingLoading} />
        {meetingError && (
          <Alert status="error" title="Error loading meeting">
            {meetingError}
          </Alert>
        )}
        {meeting && <MeetingForm existingMeeting={meeting} />}
      </PageContent>
    </>
  );
}
