import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlertTitle } from "@chakra-ui/react";
import { Alert } from "@/components/ui/alert";
import { DashboardForm } from "./components/DashboardForm";

export default function DashboardCreatePage() {
  return (
    <>
      <PageHeader title="Create a Dashboard" maxW="breakpoint-sm" />
      <PageContent
        p={4}
        maxW="breakpoint-sm"
        display="flex"
        flexDir="column"
        gap={4}
      >
        <Alert status="info">
          <AlertTitle>What is a Dashboard?</AlertTitle>
          Dashboards are used for groups to share information and data on
          organization meetings. If you were invited to Sentinel by someone, you
          should ask them to add you to their dashboard rather than creating
          your own.
        </Alert>
        <DashboardForm />
      </PageContent>
    </>
  );
}
