import { Alert } from "@/components/ui/alert";
import { Button, Field, Group, Input, Stack } from "@chakra-ui/react";
import { Link, useLocation } from "wouter";
import { pageConfig } from "../pageConfig";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUID } from "@/stores/auth.store";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useOrganizationsStore } from "@/stores/organizations.store";
import { IOrganization } from "@/services/organizations.service";
import { HookFormRichTextEditor } from "@/components/common/RichTextEditor/HookFormRichTextEditor";

interface OrganizationFormProps {
  existingOrganization?: IOrganization;
}

const schema = yup.object({
  name: yup.string().required(),
  url: yup.string().url().required(),
  description: yup.string().nullable(),
});

export function OrganizationForm(props: OrganizationFormProps) {
  const { existingOrganization } = props;

  const dashboardId = useDashboardId();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: existingOrganization?.name ?? "",
      url: existingOrganization?.url ?? "",
      description: existingOrganization?.description ?? null,
    },
  });

  const [error, setError] = useState<string | null>(null);

  const uid = useUID();
  const navigate = useLocation()[1];

  const createOrganization = useOrganizationsStore(
    (state) => state.createOrganization
  );
  const updateOrganization = useOrganizationsStore(
    (state) => state.updateOrganization
  );

  const [submitLoading, setSubmitLoading] = useState(false);

  if (!uid) return <></>;

  const onSubmit = handleSubmit((data) => {
    setError(null);
    setSubmitLoading(true);

    if (existingOrganization) {
      updateOrganization(
        existingOrganization.id,
        data.name,
        data.url,
        data.description || null
      )
        .then(() => {
          navigate(
            pageConfig.organization(dashboardId, existingOrganization.id)
          );
        })
        .catch((e) => {
          console.error(e);
          setError("Failed to update organization");
          setSubmitLoading(false);
        });
    } else {
      createOrganization(
        dashboardId,
        data.name,
        data.url,
        data.description || null
      )
        .then((organizationId) => {
          navigate(pageConfig.organization(dashboardId, organizationId));
        })
        .catch((e) => {
          console.error(e);
          setError("Failed to create organization");
          setSubmitLoading(false);
        });
    }
  });

  return (
    <Stack gap={4} asChild>
      <form onSubmit={onSubmit}>
        {error && (
          <Alert status="error" title="error">
            {error}
          </Alert>
        )}
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Organization Name</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.url}>
          <Field.Label>URL</Field.Label>
          <Input {...register("url")} />
          <Field.HelperText>
            Use the URL of the website that contain's the organization's meeting
            agendas. This is usually different from the organization's homepage.
          </Field.HelperText>
          <Field.ErrorText>{errors.url?.message}</Field.ErrorText>
        </Field.Root>

        <HookFormRichTextEditor
          label="Description"
          control={control}
          formField="description"
          errorMessage={errors.description?.message}
          required={false}
        />

        <Group justifyContent={"flex-end"} mt={2}>
          <Button asChild variant="ghost" colorPalette={"gray"}>
            <Link
              to={
                existingOrganization
                  ? pageConfig.organization(
                      dashboardId,
                      existingOrganization.id
                    )
                  : pageConfig.dashboard(dashboardId)
              }
            >
              Cancel
            </Link>
          </Button>
          <Button type="submit" loading={submitLoading}>
            Save Organization
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
