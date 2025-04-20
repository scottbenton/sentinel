import { RichTextEditor } from "@/components/common/RichTextEditor/RichTextEditor";
import { useCurrentOrganization } from "@/stores/organizations.store";
import { Box, Heading } from "@chakra-ui/react";

export function OrganizationDescription() {
  const description = useCurrentOrganization((org) => org?.description);
  if (!description) {
    return null;
  }

  return (
    <Box>
      <Heading size="xl" mb={2}>
        Description
      </Heading>
      <Box bg="bg.subtle" p={4} mx={-4}>
        <RichTextEditor readOnly content={description} />
      </Box>
    </Box>
  );
}
