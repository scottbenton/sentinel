import { Dialog } from "@/components/common/Dialog";
import { HookFormTextField } from "@/components/common/HookFormTextField";
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
import { useCallback } from "react";
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
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
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

  const onSubmit = useCallback(
    (formState: { emails: { address: string }[] }) => {
      console.log(formState);
    },
    []
  );

  console.debug(errors);
  return (
    <Dialog
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

            <Group width={"100%"} mt={4} alignSelf="end" justifyContent="end">
              <DialogActionTrigger asChild>
                <Button colorPalette="gray" variant="ghost">
                  Close
                </Button>
              </DialogActionTrigger>
              <Button type="submit">Send Invite Emails</Button>
            </Group>
          </form>
        </CDialog.Body>
      }
    />
  );
}
