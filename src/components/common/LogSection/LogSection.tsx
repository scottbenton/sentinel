import { useLogsStore, useSyncLogsForItem } from "@/stores/logs.store";
import { Box, BoxProps, Timeline } from "@chakra-ui/react";
import { ProgressBar } from "../ProgressBar";
import { Alert } from "../../ui/alert";
import { UserAvatar } from "../UserAvatar";
import { LogContents } from "./LogContents/LogContents";
import { LogRTE } from "./LogRTE";
import { useUID } from "@/stores/auth.store";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";

export interface LogSectionProps extends BoxProps {
  meetingId: number | null;
  organizationId: number | null;
}

export function LogSection(props: LogSectionProps) {
  const { meetingId, organizationId, ...boxProps } = props;

  const uid = useUID();

  useSyncLogsForItem({
    meetingId,
    organizationId,
  });

  const [onlyShowComments, setOnlyShowComments] = useState(false);

  const logs = useLogsStore((store) =>
    [...store.logs].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )
  );

  const filteredLogs = useMemo(() => {
    if (onlyShowComments) {
      return logs.filter((log) => log.type === "comment");
    }
    return logs;
  }, [logs, onlyShowComments]);

  const areLogsLoading = useLogsStore((store) => store.loading);
  const logsError = useLogsStore((store) => store.error);

  return (
    <Box
      height="100%"
      maxH="100%"
      display="flex"
      flexDir={"column"}
      overflow="hidden"
      {...boxProps}
    >
      <Box
        flexShrink={0}
        px={4}
        py={3}
        borderBottomWidth={1}
        borderColor="border"
      >
        <Checkbox
          checked={onlyShowComments}
          onCheckedChange={(details) =>
            setOnlyShowComments(details.checked === true)
          }
          cursor={"pointer"}
        >
          Only show comments
        </Checkbox>
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDir="column-reverse"
        overflow="auto"
        p={4}
        pt={0}
        overflowAnchor={"none"}
      >
        <Timeline.Root variant="subtle" size="xl" mb={-2} ml={-2} flexGrow={1}>
          {filteredLogs.map((log) => (
            <Timeline.Item key={log.id}>
              <Timeline.Connector>
                <Timeline.Separator />
                <Timeline.Indicator>
                  <UserAvatar uid={log.createdBy} size="full" />
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content>
                <LogContents
                  log={log}
                  meetingId={meetingId}
                  organizationId={organizationId}
                />
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
        {filteredLogs.length === 0 && <EmptyState title="No logs to show" />}
        {logsError && (
          <Alert status="error" title="Error loading logs">
            {logsError}
          </Alert>
        )}
        <Box
          flexShrink={0}
          height={"1px"}
          style={{ overflowAnchor: "auto" }}
          pt={4}
        />
        {areLogsLoading && <ProgressBar mx={-4} />}
      </Box>

      <Timeline.Root
        size="xl"
        variant="subtle"
        p={4}
        pl={2}
        borderTopWidth={1}
        borderColor="border"
      >
        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Indicator>
              <UserAvatar uid={uid} size="full" />
            </Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content pb={0}>
            <Timeline.Title>Add a comment</Timeline.Title>
            <LogRTE organizationId={organizationId} meetingId={meetingId} />
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>
    </Box>
  );
}
