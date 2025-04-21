import { Alert } from "@/components/ui/alert";
import { useAuthStore } from "@/stores/auth.store";
import { Box, Button, Field, Input } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const emailSchema = yup.object({
  email: yup.string().email().required(),
});

interface EmailSectionProps {
  onComplete: (email: string) => void;
}

export function EmailSection(props: EmailSectionProps) {
  const { onComplete } = props;

  const requestOTP = useAuthStore((state) => state.sendOTPCodeToEmail);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const onSubmit = handleSubmit((data) => {
    return new Promise((resolve, reject) => {
      const email = data.email;
      requestOTP(email)
        .then(() => {
          onComplete(email);
          resolve(null);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    });
  });

  return (
    <Box w="100%" as="form" onSubmit={onSubmit}>
      <Alert status="info">
        Sentinel will send a one-time code to your email address to verify your
        identity.
      </Alert>
      {import.meta.env.DEV && (
        <Alert status="info" mt={2}>
          The following accounts are configured for local testing:
          <ul>
            <li>admin@scottbenton.dev</li>
            <li>inviter@scottbenton.dev</li>
            <li>meeting-editor@scottbenton.dev</li>
            <li>viewer@scottbenton.dev</li>
          </ul>
        </Alert>
      )}
      <Field.Root
        mt={4}
        required
        invalid={!!errors.email}
        disabled={isSubmitting}
      >
        <Field.Label>
          Email Address
          <Field.RequiredIndicator />
        </Field.Label>
        <Input type="email" required {...register("email")} />
        {errors.email && (
          <Field.ErrorText>{errors.email.message}</Field.ErrorText>
        )}
      </Field.Root>
      <Button type="submit" mt={6} w="100%" loading={isSubmitting}>
        Continue
      </Button>
    </Box>
  );
}
