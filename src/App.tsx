import { lazy } from "react";
import { Route, Switch } from "wouter";
import { PageWrapper } from "./components/layout/PageWrapper";
import { DashboardLoadWrapper } from "./pages/dashboard/DashboardLoadWrapper";
import { MeetingLoadWrapper } from "./pages/meetings/MeetingLoadWrapper";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

const DashboardSelectPage = lazy(
  () => import("./pages/dashboard/DashboardSelectPage")
);
const DashboardCreatePage = lazy(
  () => import("./pages/dashboard/DashboardCreatePage")
);
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const DashboardEditPage = lazy(
  () => import("./pages/dashboard/DashboardEditPage")
);

const OrganizationCreatePage = lazy(
  () => import("./pages/organizations/OrganizationCreatePage")
);
const OrganizationPage = lazy(
  () => import("./pages/organizations/OrganizationSheetPage")
);
const OrganizationEditPage = lazy(
  () => import("./pages/organizations/OrganizationEditPage")
);

const MeetingCreatePage = lazy(
  () => import("./pages/meetings/MeetingCreatePage")
);
const MeetingPage = lazy(() => import("./pages/meetings/MeetingSheetPage"));
const MeetingEditPage = lazy(() => import("./pages/meetings/MeetingEditPage"));

const UserManagementPage = lazy(
  () => import("./pages/users/UserManagementPage")
);

const AcceptInvitePage = lazy(() => import("./pages/invite/InvitePage"));

function App() {
  return (
    <>
      <Switch>
        <Route path="/">
          <PageWrapper lazy={HomePage} />
        </Route>
        <Route path="/invite/:inviteCode">
          <PageWrapper requiresAuth lazy={AcceptInvitePage} />
        </Route>
        <Route path="/dashboards" nest>
          <Switch>
            <Route path="/">
              <PageWrapper requiresAuth lazy={DashboardSelectPage} />
            </Route>
            <Route path="/create">
              <PageWrapper requiresAuth lazy={DashboardCreatePage} />
            </Route>
            <Route path="/:dashboardId" nest>
              <DashboardLoadWrapper>
                <Switch>
                  <Route path={"/"}>
                    <PageWrapper requiresAuth lazy={DashboardPage} />
                  </Route>
                  <Route path="/edit">
                    <PageWrapper requiresAuth lazy={DashboardEditPage} />
                  </Route>
                  <Route path="/organizations/create">
                    <PageWrapper requiresAuth lazy={OrganizationCreatePage} />
                  </Route>
                  <Route path="/organizations/:organizationId" nest>
                    <Switch>
                      <Route path="/">
                        <PageWrapper requiresAuth lazy={OrganizationPage} />
                      </Route>
                      <Route path="/edit">
                        <PageWrapper requiresAuth lazy={OrganizationEditPage} />
                      </Route>
                      <Route path="/meetings/create">
                        <PageWrapper requiresAuth lazy={MeetingCreatePage} />
                      </Route>
                      <Route path="/meetings/:meetingId" nest>
                        <MeetingLoadWrapper>
                          <Switch>
                            <Route path="/">
                              <PageWrapper requiresAuth lazy={MeetingPage} />
                            </Route>
                            <Route path="/edit">
                              <PageWrapper
                                requiresAuth
                                lazy={MeetingEditPage}
                              />
                            </Route>
                          </Switch>
                        </MeetingLoadWrapper>
                      </Route>
                    </Switch>
                  </Route>
                  <Route path="/users">
                    <PageWrapper requiresAuth lazy={UserManagementPage} />
                  </Route>
                </Switch>
              </DashboardLoadWrapper>
            </Route>
          </Switch>
        </Route>
        <Route path="/tags">Tags Page</Route>
        <Route path="/auth">
          <PageWrapper lazy={AuthPage} />
        </Route>
      </Switch>
    </>
  );
}

export default App;
