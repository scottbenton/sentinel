import { ProgressBar } from "@/components/common/ProgressBar";
import { useUID } from "@/stores/auth.store";
import { Box, Button, Field, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import * as yup from "yup";

import { pageConfig } from "../pageConfig";
import { useUserNameWithStatus, useUsersStore } from "@/stores/users.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContinueQueryParam } from "@/hooks/useContinueParam";

const nameSchema = yup.object({
  name: yup.string().required(),
});

export function NameSection() {
  const continuePath = useContinueQueryParam();

  const uid = useUID();

  const navigate = useLocation()[1];

  const usersName = useUserNameWithStatus(uid ?? null);
  const updateName = useUsersStore((store) => store.setUserName);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(nameSchema),
  });

  const onSubmit = handleSubmit((data) => {
    return new Promise((resolve, reject) => {
      const newName = data.name;
      if (!uid) {
        reject(new Error("UID is required"));
        return;
      }
      updateName(uid, newName)
        .then(() => {
          navigate(continuePath ?? pageConfig.dashboards);
          resolve(null);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    });
  });

  if (usersName.loading) {
    return <ProgressBar />;
  }

  if (usersName.name) {
    return null;
  }

  return (
    <Box w="100%" as="form" onSubmit={onSubmit}>
      <Field.Root
        mt={4}
        required
        invalid={!!errors.name}
        disabled={isSubmitting}
      >
        <Field.Label>
          Display Name
          <Field.RequiredIndicator />
        </Field.Label>
        <Input required {...register("name")} />
        {errors.name && (
          <Field.ErrorText>{errors.name.message}</Field.ErrorText>
        )}
      </Field.Root>
      <Button type="submit" mt={6} w="100%" loading={isSubmitting}>
        Continue
      </Button>
    </Box>
  );
}
