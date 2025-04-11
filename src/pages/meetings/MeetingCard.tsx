import { IMeeting } from "@/services/meetings.service";
import {
  Box,
  Card,
  CardRootProps,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { Link } from "wouter";
import { useOrganizationsStore } from "@/stores/organizations.store";

export interface MeetingCardProps extends CardRootProps {
  meeting: IMeeting;
  showOrganizationName?: boolean;
}

export function MeetingCard(props: MeetingCardProps) {
  const { meeting, showOrganizationName, ...cardProps } = props;

  const dashboardId = useDashboardId();
  const organizationName = useOrganizationsStore((store) => {
    return store.organizations[meeting.organizationId]?.name ?? "";
  });

  return (
    <Card.Root
      asChild
      {...cardProps}
      size="sm"
      cursor="pointer"
      _hover={{ bg: "bg.muted" }}
    >
      <LinkBox>
        <Card.Body
          flexDir="row"
          justifyContent={"space-between"}
          alignItems={"flex-start"}
          gap={2}
        >
          <Box>
            {showOrganizationName && <Text>{organizationName}</Text>}
            <Text>{getMeetingDate(meeting.meetingDate)}</Text>
            <Heading size="lg" asChild>
              <LinkOverlay asChild>
                <Link
                  to={pageConfig.meeting(
                    dashboardId,
                    meeting.organizationId,
                    meeting.id
                  )}
                >
                  {meeting.name}
                </Link>
              </LinkOverlay>
            </Heading>
          </Box>
          <Icon asChild color="fg.muted" alignSelf="center">
            <ChevronRight />
          </Icon>
        </Card.Body>
      </LinkBox>
    </Card.Root>
  );
}

// Returns a string representation of the date of the meeting, in UTC time
function getMeetingDate(meetingDate: Date): string {
  return meetingDate.toLocaleDateString("en-US", { timeZone: "UTC" });
}

// function getLastSyncedText(lastSynced: Date | null) {
//   return lastSynced?.toDateString() ?? "Never";
// }
