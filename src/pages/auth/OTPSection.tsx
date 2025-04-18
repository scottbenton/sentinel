import { PinInput } from "@/components/common/PinInput";
import { useAuthStore } from "@/stores/auth.store";
import { Alert, Box, Button, Field, Link } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const otpSchema = yup.object({
  code: yup.string().length(6).required(),
});

export interface OTPSectionProps {
  email: string;
  afterVerify: () => void;
}

export function OTPSection(props: OTPSectionProps) {
  const { email, afterVerify } = props;

  const verifyOTP = useAuthStore((state) => state.verifyOTPCode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  const onSubmit = handleSubmit((data) => {
    return new Promise((resolve, reject) => {
      const otp = data.code;
      verifyOTP(email, otp)
        .then(() => {
          afterVerify();
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
      {import.meta.env.DEV && (
        <Alert.Root status="info">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              In a local environment, emails are sent to fake inboxes. You can
              check the inbox for {email} to get the OTP{" "}
              <Link href={`http://localhost:44324/`} target="_blank">
                here
              </Link>
              .
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
      <Field.Root
        mt={4}
        required
        invalid={!!errors.code}
        disabled={isSubmitting}
      >
        <Field.Label>
          One Time Passcode
          <Field.RequiredIndicator />
        </Field.Label>
        <PinInput count={6} required {...register("code")} />
        {errors.code && (
          <Field.ErrorText>{errors.code.message}</Field.ErrorText>
        )}
      </Field.Root>
      <Button type="submit" mt={6} w="100%" loading={isSubmitting}>
        Continue
      </Button>
    </Box>
  );
}
