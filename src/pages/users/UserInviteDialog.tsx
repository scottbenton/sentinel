import { Dialog } from "@/components/common/Dialog";
import { HookFormTextField } from "@/components/common/HookFormTextField";
import { Alert } from "@/components/ui/alert";
import { useDashboardId } from "@/hooks/useDashboardId";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import {
  Box,
  Button,
  DialogActionTrigger,
  Dialog as CDialog,
  Text,
  Group,
  IconButton,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  emails: yup
    .array()
    .of(
      yup.object({
        address: yup.string().email().required(),
      })
    )
    .min(1)
    .required(),
});

export function UserInviteDialog() {
  const [open, setOpen] = useState(false);

  const dashboardId = useDashboardId();
  const createInvites = useDashboardUserInvitesStore(
    (store) => store.createInvites
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      emails: [
        {
          address: "",
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
    rules: {
      minLength: 1,
      required: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSubmit = useCallback(
    (formState: { emails: { address: string }[] }) => {
      setIsLoading(true);
      setErrorMessage(null);
      createInvites(
        dashboardId,
        formState.emails.map((email) => email.address)
      )
        .then(() => {
          setIsLoading(false);
          setOpen(false);
          reset();
        })
        .catch(() => {
          setIsLoading(false);
          setErrorMessage("Error sending invites. Please try again.");
        });
    },
    [dashboardId, createInvites, reset]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Invite Users</Button>}
      title="Invite Users"
      fullContent={
        <CDialog.Body position="relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDir="column" alignItems="stretch" gap={4}>
              <Text>
                Invite users to your dashboard by entering their email
                addresses.
              </Text>
              {fields.map((email, index) => (
                <Box
                  key={email.id}
                  display="flex"
                  alignItems="flex-end"
                  gap={1}
                >
                  <HookFormTextField
                    label="Email Address"
                    formField={`emails.${index}.address`}
                    register={register}
                    required={false}
                    errorMessage={errors.emails?.[index]?.address?.message}
                  />
                  <IconButton
                    aria-label="remove field"
                    onClick={() => remove(index)}
                    variant="subtle"
                    colorPalette={"gray"}
                  >
                    <XIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                alignSelf="start"
                variant="subtle"
                onClick={() => append({ address: "" })}
              >
                Add Email
              </Button>
            </Box>

            {errorMessage && (
              <Alert status="error" mt={4} title="Error">
                <Text>{errorMessage}</Text>
              </Alert>
            )}

            <Group width={"100%"} mt={4} alignSelf="end" justifyContent="end">
              <DialogActionTrigger asChild>
                <Button
                  colorPalette="gray"
                  variant="ghost"
                  disabled={isLoading}
                >
                  Close
                </Button>
              </DialogActionTrigger>
              <Button type="submit" loading={isLoading}>
                Send Invite Emails
              </Button>
            </Group>
          </form>
        </CDialog.Body>
      }
    />
  );
}
