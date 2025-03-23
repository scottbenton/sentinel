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

export function MeetingsSection() {
  const isAdmin = useIsDashboardAdmin();

  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();

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
            <Span color="fg.muted">Last Synced: </Span> 2 days ago
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
