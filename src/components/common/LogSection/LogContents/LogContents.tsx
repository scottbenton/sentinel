import { ILog } from "@/services/logValidationUtil.service";
import { useUserName } from "@/stores/users.store";
import { useMemo } from "react";
import { logContentsConfig } from "./log-contents.config";
import { Timeline } from "@chakra-ui/react";
import { useUID } from "@/stores/auth.store";

export interface LogContentsProps {
  log: ILog;
  meetingId: number | null;
  organizationId: number | null;
}

export function LogContents(props: LogContentsProps) {
  const { log, meetingId, organizationId } = props;

  const uid = useUID();

  const createdBy = log.createdBy;
  const userNameIfExists = useUserName(log.createdBy);
  const userName = useMemo(() => {
    if (createdBy) {
      return userNameIfExists ?? "Loading";
    } else {
      return "Sentinel Bot";
    }
  }, [userNameIfExists, createdBy]);

  const { title, description, contents } = useMemo(() => {
    if (logContentsConfig[log.type]) {
      return logContentsConfig[log.type](
        userName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log as any,
        meetingId,
        organizationId,
        uid ?? undefined
      );
    }
    return {
      title: "Unknown log type",
    };
  }, [log, userName, meetingId, organizationId, uid]);

  return (
    <>
      <Timeline.Title>{title}</Timeline.Title>
      {description && (
        <Timeline.Description>{description}</Timeline.Description>
      )}
      {contents}
      <Timeline.Description>
        {log.createdAt.toLocaleString()}
      </Timeline.Description>
    </>
  );
}
