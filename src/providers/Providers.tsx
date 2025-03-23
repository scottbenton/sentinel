import { PropsWithChildren } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ConfirmProvider } from "./ConfirmProvider";

export function Providers(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ThemeProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ThemeProvider>
  );
}
