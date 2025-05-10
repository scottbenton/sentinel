import { HookFormTextField } from "@/components/common/HookFormTextField";
import { IMeeting } from "@/services/meetings.service";
import { Button, Group, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import * as yup from "yup";
import { pageConfig } from "../pageConfig";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useMeetingsStore } from "@/stores/meetings.store";
import { useUID } from "@/stores/auth.store";
import { useState } from "react";

const schema = yup.object({
  name: yup.string().required(),
  meetingDate: yup.date().required(),
});

export interface MeetingFormProps {
  existingMeeting?: IMeeting;
}

export function MeetingForm(props: MeetingFormProps) {
  const { existingMeeting } = props;

  const dashboardId = useDashboardId();
  const organizationId = useOrganizationId();
  const uid = useUID();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: props.existingMeeting?.name ?? "",
      meetingDate: (props.existingMeeting?.meetingDate ?? new Date())
        .toISOString()
        .substring(0, 10) as unknown as Date,
    },
  });

  const createMeeting = useMeetingsStore((store) => store.createMeeting);
  const updateMeeting = useMeetingsStore((store) => store.updateMeeting);

  const navigate = useLocation()[1];

  const [loading, setLoading] = useState(false);
  const onSubmit = handleSubmit((data) => {
    if (!uid) return;
    setLoading(true);
    if (existingMeeting) {
      updateMeeting(
        uid,
        existingMeeting.id,
        existingMeeting.name,
        data.name,
        existingMeeting.meetingDate,
        data.meetingDate
      )
        .then(() => {
          navigate(
            pageConfig.meeting(dashboardId, organizationId, existingMeeting.id)
          );
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      createMeeting(uid, organizationId, data.name, data.meetingDate)
        .then((id) => {
          navigate(pageConfig.meeting(dashboardId, organizationId, id));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  });

  return (
    <Stack asChild gap={4}>
      <form onSubmit={onSubmit}>
        <HookFormTextField
          register={register}
          label="Name"
          formField="name"
          errorMessage={errors.name?.message}
          required
        />
        <HookFormTextField
          register={register}
          label="Meeting Date"
          formField="meetingDate"
          errorMessage={errors.meetingDate?.message}
          required
          type="date"
        />
        <Group>
          <Button colorPalette="gray" variant="ghost" asChild>
            <Link
              to={
                existingMeeting
                  ? pageConfig.meeting(
                      dashboardId,
                      organizationId,
                      existingMeeting.id
                    )
                  : pageConfig.organization(dashboardId, organizationId)
              }
            >
              Cancel
            </Link>
          </Button>
          <Button type="submit" loading={loading}>
            {existingMeeting ? "Update Meeting" : "Create Meeting"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
