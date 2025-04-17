import { PageContent } from "@/components/layout/PageContent";
import { PageHeader } from "@/components/layout/PageHeader";
import { useDashboardUserInvitesStore } from "@/stores/dashboardUserInvites.store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { pageConfig } from "../pageConfig";
import { Alert } from "@/components/ui/alert";
import { PageProgressBar } from "@/components/layout/PageProgressBar";
import { toaster } from "@/components/ui/toaster";

export default function InvitePage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const inviteKey = useMemo(() => {
    const parsedCode = parseInt(inviteCode);
    if (isNaN(parsedCode)) {
      return undefined;
    }
    return parsedCode;
  }, [inviteCode]);

  const acceptInvite = useDashboardUserInvitesStore(
    (store) => store.acceptInvite
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(
    inviteKey ? null : "Invalid invite code"
  );

  const isTryingToAcceptInvite = useRef<number | null>(null);
  const navigate = useLocation()[1];
  useEffect(() => {
    if (inviteKey && isTryingToAcceptInvite.current !== inviteKey) {
      isTryingToAcceptInvite.current = inviteKey;
      setError(null);
      acceptInvite(inviteKey)
        .then((dashboardId) => {
          navigate(pageConfig.dashboard(dashboardId));
          toaster.success({
            description: "Invite accepted successfully",
          });
        })
        .catch((e) => {
          setError(e instanceof Error ? e.message : "Failed to accept invite");
          setLoading(false);
        });
    }
  }, [acceptInvite, inviteKey, navigate]);

  return (
    <>
      <PageHeader
        title={error ? "Failed to accept invite" : "Accepting Invite..."}
      />
      <PageContent p={4}>
        <PageProgressBar loading={loading} />
        {error && (
          <Alert status="error" mb={4} title="Error">
            {error}
          </Alert>
        )}
      </PageContent>
    </>
  );
}
