import { Progress as ChakraProgress } from "@chakra-ui/react";
import * as React from "react";

interface ProgressProps extends ChakraProgress.RootProps {
  showValueText?: boolean;
  valueText?: React.ReactNode;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const {
      showValueText,
      valueText,
      value = null,
      variant = "subtle",
      ...rest
    } = props;
    return (
      <ChakraProgress.Root
        value={value}
        size={"xs"}
        variant={variant}
        {...rest}
        ref={ref}
      >
        <ChakraProgress.Track borderRadius={"sm"}>
          <ChakraProgress.Range />
        </ChakraProgress.Track>
        {showValueText && (
          <ChakraProgress.ValueText>{valueText}</ChakraProgress.ValueText>
        )}
      </ChakraProgress.Root>
    );
  }
);
