import { AuthStatus, useAuthStatus } from "@/stores/auth.store";
import { Redirect } from "wouter";
import { pageConfig } from "../pageConfig";

export default function HomePage() {
  const authStatus = useAuthStatus();

  if (authStatus === AuthStatus.Loading) {
    return <></>;
  }
  if (authStatus === AuthStatus.Authenticated) {
    return <Redirect to={pageConfig.dashboards} />;
  }

  return <Redirect to={pageConfig.auth} />;
}
