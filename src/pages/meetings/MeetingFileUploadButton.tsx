import { toaster } from "@/components/ui/toaster";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useMeetingId } from "@/hooks/useMeetingId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUID } from "@/stores/auth.store";
import { useMeetingDocumentsStore } from "@/stores/meetingDocuments.store";
import {
  Button,
  FileUpload,
  FileUploadFileRejectDetails,
} from "@chakra-ui/react";
import { FileUpIcon } from "lucide-react";
import { useRef } from "react";

export function MeetingFileUploadButton() {
  const ref = useRef<HTMLInputElement>(null);

  const uid = useUID();
  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();
  const meetingId = useMeetingId();

  const uploadFile = useMeetingDocumentsStore(
    (store) => store.uploadMeetingDocument
  );

  const handleFiles = (files: File[]) => {
    if (!uid) return;

    const promises = files.map((file) =>
      uploadFile(uid, dashboardId, organizationId, meetingId, file)
    );
    // Clear the input value to allow re-uploading the same file
    if (ref.current) {
      ref.current.value = "";
      ref.current.files = null;
    }
    Promise.all(promises)
      .then(() => {
        toaster.success({
          description: "Files uploaded successfully",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFilesRejected = (details: FileUploadFileRejectDetails) => {
    if (details.files.length > 0) {
      // Clear the input value to allow re-uploading the same file
      if (ref.current) {
        ref.current.value = "";
        ref.current.files = null;
      }
      const filenames = details.files.map((file) => file.file.name).join(", ");
      toaster.error({
        description: `The following files were rejected: ${filenames}`,
      });
    }
  };

  return (
    <FileUpload.Root
      maxFiles={10}
      accept="application/pdf"
      onFileAccept={(details) => handleFiles(details.files)}
      onFileReject={handleFilesRejected}
    >
      <FileUpload.HiddenInput ref={ref} />
      <FileUpload.Trigger asChild>
        <Button variant="subtle">
          Upload Documents
          <FileUpIcon />
        </Button>
      </FileUpload.Trigger>
    </FileUpload.Root>
  );
}
