import { ProgressBar } from "@/components/common/ProgressBar";
import { AuthStatus, useAuthStatus } from "@/stores/auth.store";
import { Box, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Redirect } from "wouter";

import { pageConfig } from "../pageConfig";
import { EmailSection } from "./EmailSection";
import { OTPSection } from "./OTPSection";
import { NameSection } from "./NameSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContent } from "@/components/layout/PageContent";

enum AuthStep {
  Email,
  OTP,
  Name,
}

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>(AuthStep.Email);
  const [email, setEmail] = useState<string>("");

  const authStatus = useAuthStatus();

  if (authStatus === AuthStatus.Loading) {
    return <ProgressBar />;
  }
  if (authStatus === AuthStatus.Authenticated) {
    return <Redirect to={pageConfig.dashboards} />;
  }

  return (
    <>
      <PageHeader title="Login or Create an Account" maxW="breakpoint-sm" />
      <PageContent maxW="breakpoint-sm" p={4}>
        <Box display="flex" mb={4}>
          <Image src={"/SentinelWordmark.png"} alt="Sentinel" h={16} />
        </Box>
        {step === AuthStep.Email && (
          <EmailSection
            onComplete={(email) => {
              setStep(AuthStep.OTP);
              setEmail(email);
            }}
          />
        )}
        {step === AuthStep.OTP && (
          <OTPSection
            email={email}
            afterVerify={() => setStep(AuthStep.Name)}
          />
        )}
        {step === AuthStep.Name && <NameSection />}
      </PageContent>
    </>
  );
}
