import { PropsWithChildren } from "react";

import { Provider } from "@/components/ui/provider";

export function ThemeProvider(props: PropsWithChildren) {
  const { children } = props;
  return <Provider>{children}</Provider>;
}
