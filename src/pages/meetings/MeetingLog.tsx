import { LogSection } from "@/components/common/LogSection/LogSection";
import { useMeetingId } from "@/hooks/useMeetingId";
import { BoxProps } from "@chakra-ui/react";

export function MeetingLog(props: BoxProps) {
  const meetingId = useMeetingId();
  return <LogSection meetingId={meetingId} organizationId={null} {...props} />;
}
