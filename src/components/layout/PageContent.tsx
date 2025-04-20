import { Box, BoxProps, Container, ContainerProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export interface PageContentProps extends BoxProps {
  containerProps?: ContainerProps;
}

export function PageContent(props: PropsWithChildren<PageContentProps>) {
  const {
    containerProps,
    maxW = "breakpoint-2xl",
    children,
    ...boxProps
  } = props;

  return (
    <Container {...containerProps} maxW={maxW} flexGrow={1} display="flex">
      <Box
        w="100%"
        borderTopRadius={"md"}
        bg="bg.panel"
        flexGrow={1}
        borderWidth={1}
        borderBottomWidth={0}
        borderColor="border"
        {...boxProps}
      >
        {children}
      </Box>
    </Container>
  );
}
