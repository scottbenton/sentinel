import { ProgressBar } from "@/components/common/ProgressBar";
import { Alert } from "@/components/ui/alert";
import { FileStorageService } from "@/services/fileStorage.service";
import { IMeeting } from "@/types/Meeting.type";
import { Accordion, Box, Card, Heading, Span, Text } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

interface OrganizationMeetingCardProps {
  orgId: string;
  meeting: IMeeting;
}

export function OrganizationMeetingCard(props: OrganizationMeetingCardProps) {
  const { orgId, meeting } = props;
  const meetingId = meeting.id;

  const [pdfState, setPDFState] = useState<{
    loading: boolean;
    error: string | null;
    pdf: string | null;
  }>({
    loading: false,
    error: null,
    pdf: null,
  });
  const { loading, error, pdf } = pdfState;
  const loadingRef = useRef(false);
  const hasPDF = useRef(false);

  const filename = meeting.attachedFilename;
  const loadPDF = useCallback(() => {
    if (!loading && !pdf) {
      loadingRef.current = true;
      setPDFState({
        loading: true,
        error: null,
        pdf: null,
      });
      FileStorageService.getOrganizationMeetingAgenda(orgId, filename)
        .then((url) => {
          hasPDF.current = true;
          setPDFState({
            loading: false,
            error: null,
            pdf: url,
          });
        })
        .catch((e) => {
          console.error(e);
          setPDFState({
            loading: false,
            error: "Failed to load PDF",
            pdf: null,
          });
        })
        .finally(() => {
          loadingRef.current = false;
        });
    }
  }, [orgId, filename, loading, pdf]);

  return (
    <Card.Root>
      <Card.Body>
        <Heading size="lg">{meeting.meetingLabel}</Heading>
        <Text>{meeting.meetingDate.toDateString()}</Text>
      </Card.Body>
      <Card.Footer>
        <Accordion.Root collapsible variant="plain" onValueChange={loadPDF}>
          <Accordion.Item value={"file"}>
            <Accordion.ItemTrigger cursor="pointer">
              <Span flex="1">Meeting Agenda</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody pb={0}>
                {loading && <ProgressBar />}
                {error && <Alert status="error">{error}</Alert>}
                {pdf && (
                  <Box asChild borderWidth={1} borderColor="border">
                    <object data={pdf} width="100%" height="500" />
                  </Box>
                )}
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Card.Footer>
    </Card.Root>
  );
}
