import { ProgressBar } from "@/components/common/ProgressBar";
import { AuthStatus, useAuthStatus, useUID } from "@/stores/auth.store";
import { Box, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Redirect } from "wouter";

import { pageConfig } from "../pageConfig";
import { EmailSection } from "./EmailSection";
import { OTPSection } from "./OTPSection";
import { NameSection } from "./NameSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContent } from "@/components/layout/PageContent";
import { useUserNameWithStatus } from "@/stores/users.store";
import { useContinueQueryParam } from "@/hooks/useContinueParam";

enum AuthStep {
  Email,
  OTP,
}

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>(AuthStep.Email);
  const [email, setEmail] = useState<string>("");
  const continuePath = useContinueQueryParam();

  const authStatus = useAuthStatus();
  const uid = useUID();
  const { name, loading } = useUserNameWithStatus(uid);

  if (authStatus === AuthStatus.Loading) {
    return <ProgressBar />;
  }
  if (authStatus === AuthStatus.Authenticated && !loading && name) {
    return <Redirect to={continuePath ?? pageConfig.dashboards} />;
  }

  return (
    <>
      <PageHeader title="Login or Create an Account" maxW="breakpoint-sm" />
      <PageContent maxW="breakpoint-sm" p={4}>
        <Box display="flex" mb={4}>
          <Image src={"/SentinelWordmark.png"} alt="Sentinel" h={16} />
        </Box>
        {authStatus === AuthStatus.Unauthenticated ? (
          <>
            {step === AuthStep.Email && (
              <EmailSection
                onComplete={(email) => {
                  setStep(AuthStep.OTP);
                  setEmail(email);
                }}
              />
            )}
            {step === AuthStep.OTP && (
              <OTPSection email={email} afterVerify={() => {}} />
            )}
          </>
        ) : (
          <NameSection />
        )}
      </PageContent>
    </>
  );
}
