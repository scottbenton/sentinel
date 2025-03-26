import { ProgressBar } from "@/components/common/ProgressBar";
import { Alert } from "@/components/ui/alert";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useMeetingId } from "@/hooks/useMeetingId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { IMeetingDoc } from "@/services/meetingDocuments.service";
import { useMeetingDocumentsStore } from "@/stores/meetingDocuments.store";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export interface MeetingDocumentRendererProps {
  meetingDocument: IMeetingDoc;
}

export function MeetingDocumentRenderer(props: MeetingDocumentRendererProps) {
  const { meetingDocument } = props;

  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();
  const meetingId = useMeetingId();

  const [urlState, setUrlState] = useState<{
    url: string | null;
    loading: boolean;
    error: string | null;
  }>({
    url: null,
    loading: true,
    error: null,
  });
  const getUrl = useMeetingDocumentsStore(
    (store) => store.getMeetingDocumentURL
  );

  const filename = meetingDocument.filename;
  useEffect(() => {
    getUrl(dashboardId, organizationId, meetingId, filename)
      .then((url) => {
        setUrlState({
          url,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        setUrlState({
          url: null,
          loading: false,
          error: error.message,
        });
      });
  }, [getUrl, dashboardId, organizationId, meetingId, filename]);

  if (urlState.loading) {
    return <ProgressBar />;
  }
  if (urlState.error) {
    return <Alert status="error">{urlState.error}</Alert>;
  }
  return (
    <Box mx={-4}>
      <object
        data={urlState.url ?? undefined}
        type="application/pdf"
        width="100%"
        style={{
          height: "75vh",
        }}
      />
    </Box>
  );
}
