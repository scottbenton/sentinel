import { useSyncMeetingDocuments } from "@/stores/meetingDocuments.store";
import { useSyncCurrentMeeting } from "@/stores/meetings.store";
import { PropsWithChildren } from "react";

export function MeetingLoadWrapper(props: PropsWithChildren) {
  const { children } = props;

  useSyncCurrentMeeting();
  useSyncMeetingDocuments();

  return children;
}
