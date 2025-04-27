import { PropsWithChildren, useCallback, useMemo } from "react";
import { LogoIcon } from "../../assets/Logo";
import { Box, Button, Container, IconButton, Menu } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "wouter";
import { ColorModeButton, DarkMode } from "../ui/color-mode";
import {
  AuthStatus,
  useAuthStatus,
  useAuthStore,
  useListenToAuth,
} from "@/stores/auth.store";
import { ProgressBar } from "../common/ProgressBar";
import { SettingsIcon } from "lucide-react";
import { Toaster } from "../ui/toaster";
import { color } from "@/providers/ThemeProvider";

export function Layout(props: PropsWithChildren) {
  const { children } = props;

  useListenToAuth();
  const authStatus = useAuthStatus();

  const location = useLocation()[0];
  const isOnDashboardPage = useMemo(() => {
    return location.includes("dashboard");
  }, [location]);

  const signOut = useAuthStore((store) => store.signOut);
  const handleSignOut = useCallback(() => {
    signOut().then(() => {
      window.location.reload();
    });
  }, [signOut]);

  if (authStatus === AuthStatus.Loading) {
    return <ProgressBar value={null} colorPalette={color} />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg="bg.muted"
      colorPalette={color}
    >
      <DarkMode colorPalette={color}>
        <Box bg="bg.panel" className="dark">
          <Container as="header" maxW="breakpoint-2xl" fluid>
            <Box
              borderColor="border"
              borderBottomWidth={1}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display={"flex"} alignItems="center" gap={4}>
                <LogoIcon
                  color={`${color}.500`}
                  size={"xl"}
                  aria-label="Sentinel"
                />
                <Box display="flex" gap={1}>
                  <Button
                    variant={isOnDashboardPage ? "subtle" : "ghost"}
                    colorPalette={isOnDashboardPage ? undefined : "gray"}
                    asChild
                  >
                    <RouterLink to="/dashboards">Dashboards</RouterLink>
                  </Button>
                  <Button variant="ghost" colorPalette="gray" asChild>
                    <a
                      href="https://docs.google.com/document/d/1bT0stDRKtAQXqri9UyU2z6X09VYOkkX1kh5ZtYZ0S-8/edit?usp=sharing"
                      target="_blank"
                    >
                      Help
                    </a>
                  </Button>
                </Box>
              </Box>
              <Box display={"flex"} alignItems="center" gap={1}>
                <ColorModeButton colorPalette={"gray"} />
                {authStatus === AuthStatus.Authenticated && (
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton variant="ghost" colorPalette="gray">
                        <SettingsIcon />
                      </IconButton>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item value="logout" onClick={handleSignOut}>
                          Sign Out
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </DarkMode>
      <Box as="main" flexGrow={1} display="flex" flexDirection="column">
        {children}
      </Box>
      <Toaster />
    </Box>
  );
}
