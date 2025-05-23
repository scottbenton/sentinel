import { PropsWithChildren } from "react";

import { Provider } from "@/components/ui/provider";

export const color = "blue";

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props;
  return <Provider>{children}</Provider>;
}
