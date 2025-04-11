import { Box, Checkbox as ChakraCheckbox, Text } from "@chakra-ui/react";
import * as React from "react";

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  secondaryText?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { icon, children, inputProps, rootRef, secondaryText, ...rest } =
      props;
    return (
      <Box>
        <ChakraCheckbox.Root ref={rootRef} {...rest}>
          <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
          <ChakraCheckbox.Control>
            {icon || <ChakraCheckbox.Indicator />}
          </ChakraCheckbox.Control>
          {children != null && (
            <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
          )}
        </ChakraCheckbox.Root>
        {secondaryText && (
          <Text color="fg.muted" fontSize="sm" ml={8}>
            {secondaryText}
          </Text>
        )}
      </Box>
    );
  }
);
