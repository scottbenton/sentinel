import { UserAvatar } from "@/components/common/UserAvatar";
import { WrappingHeader } from "@/components/common/WrappingHeader";
import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDashboardStore, useIsMeetingAdmin } from "@/stores/dashboard.store";
import { useMeetingsStore } from "@/stores/meetings.store";
import { useUserName } from "@/stores/users.store";
import {
  Box,
  Button,
  Group,
  Heading,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { CalendarFold, TrashIcon } from "lucide-react";
import { MeetingFileUploadButton } from "./MeetingFileUploadButton";
import { MeetingDocumentList } from "./MeetingDocumentList";
import { Link, useLocation } from "wouter";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useMeetingId } from "@/hooks/useMeetingId";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useCurrentOrganization } from "@/stores/organizations.store";

export default function MeetingSheetPage() {
  const meeting = useMeetingsStore((store) => store.currentMeeting);

  const userName = useUserName(meeting?.createdBy ?? null);
  const isMeetingAdmin = useIsMeetingAdmin();

  const dashboardId = useDashboardId();
  const dashboardName = useDashboardStore(
    (store) => store.dashboard?.label ?? ""
  );
  const organizationId = useOrganizationId();
  const organizationName = useCurrentOrganization((org) => org?.name ?? "");
  const meetingId = useMeetingId();

  const deleteMeeting = useMeetingsStore((store) => store.deleteMeeting);
  const confirm = useConfirm();
  const navigate = useLocation()[1];
  const handleDelete = () => {
    confirm({
      title: "Delete Meeting",
      message: "Are you sure you want to delete this meeting?",
    }).then(({ confirmed }) => {
      if (confirmed) {
        deleteMeeting(meetingId)
          .then(() => {
            navigate(pageConfig.organization(dashboardId, organizationId));
          })
          .catch(() => {});
      }
    });
  };

  return (
    <>
      <PageHeader
        title={meeting?.name ?? "Loading"}
        breadcrumbs={[
          {
            title: dashboardName,
            href: pageConfig.dashboard(dashboardId),
          },
          {
            title: organizationName,
            href: pageConfig.organization(dashboardId, organizationId),
          },
          { title: meeting?.name ?? "Loading" },
        ]}
        action={
          <Group>
            <Button variant="subtle" asChild>
              <Link
                to={pageConfig.meetingEdit(
                  dashboardId,
                  organizationId,
                  meetingId
                )}
              >
                Edit Meeting
              </Link>
            </Button>
            <IconButton
              aria-label="Delete Meeting"
              variant="ghost"
              colorPalette={"gray"}
              onClick={handleDelete}
            >
              <TrashIcon />
            </IconButton>
          </Group>
        }
      />
      <PageContent p={4}>
        {meeting && (
          <>
            <Box display="flex" alignItems={"center"} gap={2}>
              <Icon asChild color="fg.muted">
                <CalendarFold />
              </Icon>
              {meeting && <Text>{getMeetingDate(meeting.meetingDate)}</Text>}
            </Box>
            <Box mt={4}>
              <WrappingHeader
                contentLeft={<Heading>Meeting Documents</Heading>}
                contentRight={isMeetingAdmin && <MeetingFileUploadButton />}
              />
              <MeetingDocumentList />
            </Box>
            <Box display="flex" alignItems="center" gap={2} mt={4}>
              <UserAvatar uid={meeting?.createdBy ?? null} />
              <Text>
                Added by {meeting?.createdBy ? userName : "Sentinel Bot"} on{" "}
                {meeting?.createdAt.toLocaleString()}
              </Text>
            </Box>
          </>
        )}
      </PageContent>
    </>
  );
}

// Returns a string representation of the date of the meeting, in UTC time
function getMeetingDate(meetingDate: Date): string {
  return meetingDate.toLocaleDateString("en-US", { timeZone: "UTC" });
}
