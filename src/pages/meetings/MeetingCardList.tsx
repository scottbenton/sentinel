import { IMeeting } from "@/services/meetings.service";
import { Box, Text } from "@chakra-ui/react";
import { MeetingCard } from "./MeetingCard";

export interface MeetingCardListProps {
  meetings: IMeeting[];
  emptyText: string;
  showOrganizationName?: boolean;
}

export function MeetingCardList(props: MeetingCardListProps) {
  const { meetings, emptyText, showOrganizationName } = props;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "1fr",
        sm: "repeat(auto-fill, minmax(350px, 1fr))",
      }}
      gap={4}
      mt={4}
    >
      {meetings.length > 0 ? (
        meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            showOrganizationName={showOrganizationName}
          />
        ))
      ) : (
        <Text>{emptyText}</Text>
      )}
    </Box>
  );
}
