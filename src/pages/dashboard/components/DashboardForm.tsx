import { HookFormTextField } from "@/components/common/HookFormTextField";
import { Alert } from "@/components/ui/alert";
import { pageConfig } from "@/pages/pageConfig";
import { IDashboard } from "@/services/dashboards.service";
import { useUID } from "@/stores/auth.store";
import { useDashboardStore } from "@/stores/dashboard.store";
import { useUsersDashboardsStore } from "@/stores/users-dashboards.store";
import { Button, Group, Stack, StackProps } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required(),
});

interface DashboardFormProps extends StackProps {
  existingDashboard?: IDashboard;
}
export function DashboardForm(props: DashboardFormProps) {
  const { existingDashboard, ...stackProps } = props;
  const uid = useUID();

  const createDashboard = useUsersDashboardsStore(
    (store) => store.createDashboard
  );
  const updateDashboardLabel = useDashboardStore(
    (store) => store.updateDashboardLabel
  );

  const navigate = useLocation()[1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: props.existingDashboard?.label ?? "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit((data) => {
    if (uid) {
      setLoading(true);
      setError(null);
      if (!existingDashboard) {
        createDashboard(data.name, uid)
          .then((dashboardId) => {
            navigate(pageConfig.dashboard(dashboardId));
          })
          .catch(() => {
            setError("Failed to create dashboard");
            setLoading(false);
          });
      } else {
        updateDashboardLabel(data.name)
          .then(() => {
            navigate(pageConfig.dashboard(existingDashboard.id));
          })
          .catch(() => {
            setError("Failed to update dashboard");
            setLoading(false);
          });
      }
    } else {
      setError("You must be signed in to create a dashboard");
    }
  });

  return (
    <Stack asChild gap={4} {...stackProps}>
      <form onSubmit={onSubmit}>
        {error && <Alert status="error">{error}</Alert>}
        <HookFormTextField
          register={register}
          label="Name"
          formField="name"
          required
          errorMessage={errors.name?.message}
        />
        <Group justifyContent={"flex-end"}>
          <Button colorPalette={"gray"} variant="ghost" asChild>
            <Link
              to={
                existingDashboard
                  ? pageConfig.dashboard(existingDashboard.id)
                  : pageConfig.dashboards
              }
            >
              Cancel
            </Link>
          </Button>
          <Button type="submit" loading={loading}>
            {existingDashboard ? "Save Changes" : "Create Dashboard"}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
