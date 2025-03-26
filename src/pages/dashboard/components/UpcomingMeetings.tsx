import { MeetingCardList } from "@/pages/meetings/MeetingCardList";
import { useMeetingsStore } from "@/stores/meetings.store";
import { Box, Heading } from "@chakra-ui/react";

export function UpcomingMeetings() {
  const upcomingMeetings = useMeetingsStore((store) => {
    return Object.values(store.futureMeetings).sort(
      (a, b) => a.meetingDate.getTime() - b.meetingDate.getTime()
    );
  });

  return (
    <Box>
      <Heading>Upcoming Meetings (next 30 Days)</Heading>
      <MeetingCardList
        meetings={upcomingMeetings}
        emptyText="No upcoming meetings"
        showOrganizationName
      />
    </Box>
  );
}
