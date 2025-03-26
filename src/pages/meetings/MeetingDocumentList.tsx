import { useMeetingDocumentsStore } from "@/stores/meetingDocuments.store";
import { Accordion, Box, Card, Text } from "@chakra-ui/react";
import { MeetingDocumentRenderer } from "./MeetingDocumentRenderer";
import { MeetingDocumentFooter } from "./MeetingDocumentFooter";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { FileIcon } from "lucide-react";

export function MeetingDocumentList() {
  const meetingDocuments = useMeetingDocumentsStore((store) => {
    return Object.values(store.meetingDocuments).sort((a, b) => {
      return b.uploadedOn.getTime() - a.uploadedOn.getTime();
    });
  });
  const meetingDocumentsLoading = useMeetingDocumentsStore(
    (store) => store.meetingDocumentsLoading
  );
  const meetingDocumentsError = useMeetingDocumentsStore(
    (store) => store.meetingDocumentsError
  );

  if (meetingDocumentsLoading) {
    return <Text>Loading meeting documents...</Text>;
  }
  if (meetingDocumentsError) {
    return <Alert status="error">{meetingDocumentsError}</Alert>;
  }

  if (meetingDocuments.length === 0) {
    return (
      <Card.Root variant="subtle" mt={2}>
        <EmptyState
          icon={<FileIcon />}
          title="No Meeting Documents"
          description="There are no documents for this meeting."
        />
      </Card.Root>
    );
  }

  return (
    <Accordion.Root multiple collapsible variant="enclosed" mt={2} lazyMount>
      {meetingDocuments.map((doc) => (
        <Accordion.Item value={doc.id + ""} key={doc.id}>
          <Accordion.ItemTrigger cursor={"pointer"}>
            <Box flex="1">
              <Text>{doc.filename}</Text>
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <MeetingDocumentRenderer meetingDocument={doc} />
              <MeetingDocumentFooter meetingDocument={doc} />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
