import { LogTypes } from "@/services/logs.service";
import {
  ICommentLog,
  IMeetingCreatedLog,
  IMeetingDateChangedLog,
  IMeetingDeletedLog,
  IMeetingDocumentAddedLog,
  IMeetingDocumentDeletedLog,
  IMeetingNameChangedLog,
} from "@/services/logValidationUtil.service";
import { ReactNode } from "react";
import { LogRTE } from "../LogRTE";
// Map LogTypes to their corresponding log interfaces
type LogTypeToInterfaceMap = {
  [LogTypes.Comment]: ICommentLog;
  [LogTypes.MeetingCreated]: IMeetingCreatedLog;
  [LogTypes.MeetingNameChanged]: IMeetingNameChangedLog;
  [LogTypes.MeetingDateChanged]: IMeetingDateChangedLog;
  [LogTypes.MeetingDocumentAdded]: IMeetingDocumentAddedLog;
  [LogTypes.MeetingDocumentDeleted]: IMeetingDocumentDeletedLog;
  [LogTypes.MeetingDeleted]: IMeetingDeletedLog;
};

export const logContentsConfig: {
  [key in LogTypes]: (
    username: string,
    log: LogTypeToInterfaceMap[key],
    meetingId: number | null,
    organizationId: number | null,
    uid: string | undefined
  ) => {
    title: ReactNode;
    description?: ReactNode;
    contents?: ReactNode;
  };
} = {
  [LogTypes.MeetingCreated]: (username, log, meetingId) => ({
    title: meetingId
      ? `${username} created this meeting`
      : `${username} created meeting ${log.initialMeetingName}`,
  }),
  [LogTypes.MeetingDateChanged]: (username, log) => ({
    title: `${username} changed the meeting date`,
    description: `From ${log.previousDate.toDateString()} to ${log.newDate.toDateString()}`,
  }),
  [LogTypes.Comment]: (
    username,
    log: ICommentLog,
    meetingId,
    organizationId,
    uid
  ) => ({
    title: `${username}`,
    contents: (
      <LogRTE
        meetingId={meetingId}
        organizationId={organizationId}
        readOnly
        canTriggerEdit={uid === log.createdBy}
        log={log}
      />
    ),
  }),
  [LogTypes.MeetingNameChanged]: (username, log: IMeetingNameChangedLog) => ({
    title: `${username} changed the name`,
    description: `From ${log.previousName} to ${log.newName}`,
  }),
  [LogTypes.MeetingDocumentAdded]: (
    username,
    log: IMeetingDocumentAddedLog
  ) => ({
    title: `${username} uploaded ${log.documentNames.length} document(s)`,
    description: log.documentNames.join(", "),
  }),
  [LogTypes.MeetingDocumentDeleted]: (
    username,
    log: IMeetingDocumentDeletedLog
  ) => ({
    title: `${username} deleted ${log.documentNames.length} document(s)`,
    description: log.documentNames.join(", "),
  }),
  [LogTypes.MeetingDeleted]: (username, log: IMeetingDeletedLog) => ({
    title: `${username} deleted meeting ${log.meetingName}`,
  }),
};
