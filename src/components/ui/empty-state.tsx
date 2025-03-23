import { EmptyState as ChakraEmptyState, VStack } from "@chakra-ui/react";
import * as React from "react";

export interface EmptyStateProps extends ChakraEmptyState.RootProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, description, icon, children, ...rest } = props;
    return (
      <ChakraEmptyState.Root ref={ref} {...rest} maxW="45ch" mx="auto">
        <ChakraEmptyState.Content>
          {icon && (
            <ChakraEmptyState.Indicator mb={-4}>
              {icon}
            </ChakraEmptyState.Indicator>
          )}
          {description ? (
            <VStack textAlign="center">
              <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
              <ChakraEmptyState.Description>
                {description}
              </ChakraEmptyState.Description>
            </VStack>
          ) : (
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
          )}
          {children}
        </ChakraEmptyState.Content>
      </ChakraEmptyState.Root>
    );
  }
);
