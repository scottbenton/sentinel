import { Tooltip } from "@/components/ui/tooltip";
import { useIsDashboardAdmin } from "@/stores/dashboard.store";
import {
  Accordion,
  Box,
  Button,
  Group,
  Heading,
  IconButton,
  Span,
  Text,
} from "@chakra-ui/react";
import { CalendarPlus, RefreshCcw } from "lucide-react";
import { Link } from "wouter";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useMeetingsStore } from "@/stores/meetings.store";
import { useCurrentOrganization } from "@/stores/organizations.store";

export function MeetingsSection() {
  const isAdmin = useIsDashboardAdmin();

  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();

  const lastSynced = useCurrentOrganization((org) => org?.lastSynced ?? null);

  const upcomingMeetings = useMeetingsStore((store) => {
    return Object.entries(store.futureMeetings)
      .filter(([, meeting]) => meeting.organizationId === organizationId)
      .sort(
        ([, a], [, b]) => a.meetingDate.getTime() - b.meetingDate.getTime(),
      );
  });

  console.debug(upcomingMeetings);

  return (
    <Box>
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Box>
          <Heading>Organization Meetings</Heading>
          <Text>
            <Span color="fg.muted">Last Synced: </Span>
            {getLastSyncedText(lastSynced)}
          </Text>
        </Box>
        {isAdmin && (
          <Group justifyContent={"flex-end"}>
            <Tooltip content="Sync Now">
              <IconButton aria-label="Sync Now" variant="subtle">
                <RefreshCcw />
              </IconButton>
            </Tooltip>
            <Button variant="subtle" asChild>
              <Link to={pageConfig.meetingCreate(dashboardId, organizationId)}>
                Add Meeting Manually
                <CalendarPlus />
              </Link>
            </Button>
          </Group>
        )}
      </Box>
      <Heading size="lg" mt={4}>
        Upcoming Meetings
      </Heading>
      <Box display="grid" gridTemplateColumns="1fr" gap={4} mt={4}>
        {upcomingMeetings.length > 0 ? (
          upcomingMeetings.map(([meetingId, meeting]) => (
            <Box key={meetingId} p={4} borderWidth="1px" borderRadius="lg">
              <Heading size="md">{meeting.name}</Heading>
              <Text>
                <Span color="fg.muted">Date: </Span>
                {meeting.meetingDate.toDateString()}
              </Text>
              <Text>
                <Span color="fg.muted">Created By: </Span>
                {meeting.createdBy ?? "Unknown"}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No upcoming meetings.</Text>
        )}
      </Box>
      <Accordion.Root mt={8} collapsible variant="plain" mx={-2} w="auto">
        <Accordion.Item value={"past-meetings"}>
          <Accordion.ItemTrigger
            cursor="pointer"
            _hover={{ bg: "bg.muted" }}
            px={2}
          >
            <Box flex="1">
              <Heading size="lg" flex="1">
                Past Meetings
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                Click to expand
              </Text>
            </Box>
            <Accordion.ItemIndicator pr={2} />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody px={2}>Past Meetings Here</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}

function getLastSyncedText(lastSynced: Date | null) {
  return lastSynced?.toDateString() ?? "Never";
}
