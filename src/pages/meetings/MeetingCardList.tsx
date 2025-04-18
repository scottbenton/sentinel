import { IMeeting } from "@/services/meetings.service";
import { Box, Text } from "@chakra-ui/react";
import { MeetingCard } from "./MeetingCard";
import { MeetingFilterBar } from "./MeetingFilterBar";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { useOrganizationsStore } from "@/stores/organizations.store";

export interface MeetingCardListProps {
  meetings: IMeeting[];
  emptyText: string;
  showOrganizationName?: boolean;
}

export function MeetingCardList(props: MeetingCardListProps) {
  const { meetings, emptyText, showOrganizationName } = props;

  const [meetingSearchText, setMeetingSearchText] = useState("");
  const deferredSearchText = useDeferredValue(meetingSearchText);

  return (
    <Box mt={4}>
      {meetings.length > 0 && (
        <MeetingFilterBar
          searchText={meetingSearchText}
          onSearchTextChange={setMeetingSearchText}
          maxW={"40ch"}
        />
      )}
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
          <Cards
            meetings={meetings}
            searchText={deferredSearchText}
            showOrganizationName={showOrganizationName}
          />
        ) : (
          <Text>{emptyText}</Text>
        )}
      </Box>
    </Box>
  );
}

const Cards = memo(function Cards(props: {
  meetings: IMeeting[];
  searchText: string;
  showOrganizationName?: boolean;
}) {
  const { meetings, searchText, showOrganizationName } = props;

  const organizations = useOrganizationsStore((store) => store.organizations);

  const filteredMeetings = useMemo(() => {
    const search = searchText.toLowerCase();
    return meetings.filter((meeting) => {
      const org = organizations[meeting.organizationId];
      return (
        meeting.name.toLowerCase().includes(search) ||
        org.name.toLowerCase().includes(search)
      );
    });
  }, [meetings, searchText, organizations]);

  return (
    <>
      {filteredMeetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          showOrganizationName={showOrganizationName}
        />
      ))}
    </>
  );
});
