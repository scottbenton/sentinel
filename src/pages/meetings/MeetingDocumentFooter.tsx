import { UserAvatar } from "@/components/common/UserAvatar";
import { WrappingHeader } from "@/components/common/WrappingHeader";
import { useConfirm } from "@/providers/ConfirmProvider";
import { IMeetingDoc } from "@/services/meetingDocuments.service";
import { useUID } from "@/stores/auth.store";
import { useIsMeetingAdmin } from "@/stores/dashboard.store";
import { useMeetingDocumentsStore } from "@/stores/meetingDocuments.store";
import { useUserName } from "@/stores/users.store";
import { Box, Button, Group, Text } from "@chakra-ui/react";

export interface MeetingDocumentFooterProps {
  meetingDocument: IMeetingDoc;
}

export function MeetingDocumentFooter(props: MeetingDocumentFooterProps) {
  const { meetingDocument } = props;

  const userId = useUID();
  const userName = useUserName(meetingDocument.uploadedBy);

  const deleteMeetingDocument = useMeetingDocumentsStore(
    (store) => store.deleteMeetingDocument
  );

  const confirm = useConfirm();
  const handleMeetingDocumentDelete = () => {
    if (!userId) return;
    confirm({
      title: "Delete Meeting Document",
      message: "Are you sure you want to delete this meeting document?",
    }).then(({ confirmed }) => {
      if (confirmed) {
        // Delete the meeting document
        deleteMeetingDocument(
          userId,
          meetingDocument.filename,
          meetingDocument.meetingId,
          meetingDocument.id
        ).catch(() => {});
      }
    });
  };

  const isMeetingAdmin = useIsMeetingAdmin();

  return (
    <WrappingHeader
      contentLeft={
        <Box display="flex" alignItems="center" gap={2}>
          <UserAvatar uid={meetingDocument.uploadedBy} />
          <Text>
            Uploaded by{" "}
            {meetingDocument.uploadedBy
              ? userName ?? "Loading"
              : "Sentinel Bot"}{" "}
            on {meetingDocument.uploadedOn.toLocaleString()}
          </Text>
        </Box>
      }
      contentRight={
        isMeetingAdmin ? (
          <Group>
            <Button
              colorPalette="red"
              variant="subtle"
              onClick={handleMeetingDocumentDelete}
            >
              Delete
            </Button>
          </Group>
        ) : null
      }
      mt={4}
    />
  );
}
