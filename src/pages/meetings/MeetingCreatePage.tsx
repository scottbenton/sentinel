import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { MeetingForm } from "./MeetingForm";
import { Alert } from "@/components/ui/alert";

export default function MeetingCreatePage() {
  return (
    <>
      <PageHeader title="Add Meeting" maxW="breakpoint-sm" />
      <PageContent p={4} maxW="breakpoint-sm">
        <Alert
          status="warning"
          title="You might not need to add meetings manually"
          mb={4}
        >
          If this organization's sync integration is working, any upcoming
          meetings that appear on the linked page will be added automatically
          the next time the sync job runs.
        </Alert>
        <MeetingForm />
      </PageContent>
    </>
  );
}
