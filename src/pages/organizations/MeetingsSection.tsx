import { Tooltip } from "@/components/ui/tooltip";
import { useIsMeetingAdmin } from "@/stores/dashboard.store";
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
import {
  useCurrentOrganization,
  useOrganizationsStore,
} from "@/stores/organizations.store";
import { MeetingCardList } from "../meetings/MeetingCardList";
import { useCallback } from "react";
import { toaster } from "@/components/ui/toaster";
import { Alert } from "@/components/ui/alert";
import { PastMeetings } from "./PastMeetings";

export function MeetingsSection() {
  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();

  const lastSynced = useCurrentOrganization((org) => org?.lastSynced ?? null);
  const syncError = useCurrentOrganization((org) => org?.syncError ?? null);
  const syncLoading = useCurrentOrganization(
    (org) => org?.syncLoading ?? false
  );

  const upcomingMeetings = useMeetingsStore((store) => {
    return Object.values(store.futureMeetings)
      .filter((meeting) => meeting.organizationId === organizationId)
      .sort((a, b) => a.meetingDate.getTime() - b.meetingDate.getTime());
  });

  const isMeetingAdmin = useIsMeetingAdmin();

  const runOrganizationSync = useOrganizationsStore(
    (store) => store.runOrganizationSync
  );
  const handleRunOrganizationSync = useCallback(() => {
    runOrganizationSync(organizationId)
      .then(() => {
        toaster.create({
          type: "success",
          title: "Sync Started",
          description:
            "Organization sync requested. This process may take a few minutes.",
        });
      })
      .catch((e) => {
        toaster.create({
          type: "error",
          title: "Sync Failed",
          description: e.message,
        });
      });
  }, [runOrganizationSync, organizationId]);

  return (
    <Box>
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        flexWrap="wrap"
      >
        <Box>
          <Heading>Organization Meetings</Heading>
          <Text>
            <Span color="fg.muted">Last Synced: </Span>
            {getLastSyncedText(lastSynced)}
          </Text>
        </Box>
        {isMeetingAdmin && (
          <Group justifyContent={"flex-end"}>
            <Tooltip content="Sync Now">
              <IconButton
                aria-label="Sync Now"
                variant="subtle"
                onClick={handleRunOrganizationSync}
                loading={syncLoading}
              >
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

      {syncError && (
        <Alert status="error" title="Sync Error" mt={2}>
          {syncError}
        </Alert>
      )}

      <Heading size="lg" mt={4}>
        Upcoming Meetings
      </Heading>
      <MeetingCardList
        meetings={upcomingMeetings}
        emptyText="No upcoming meetings"
      />
      <Accordion.Root
        mt={8}
        collapsible
        variant="subtle"
        colorPalette={"gray"}
        mx={-4}
        w="auto"
        lazyMount
      >
        <Accordion.Item value={"past-meetings"} borderRadius={0}>
          <Accordion.ItemTrigger cursor="pointer" _hover={{ bg: "bg.muted" }}>
            <Box flex="1">
              <Heading size="lg" flex="1">
                Past Meetings
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                Click to expand
              </Text>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <PastMeetings />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}

function getLastSyncedText(lastSynced: Date | null) {
  return lastSynced?.toLocaleString() ?? "Never";
}
