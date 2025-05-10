import { LogSection } from "@/components/common/LogSection/LogSection";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { BoxProps } from "@chakra-ui/react";

export function OrganizationLog(props: BoxProps) {
  const organizationId = useOrganizationId();
  return (
    <LogSection meetingId={null} organizationId={organizationId} {...props} />
  );
}
