import { Box, BoxProps, Container, ContainerProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export interface PageContentProps extends BoxProps {
  containerProps?: ContainerProps;
  sidebarContent?: React.ReactNode;
}

export function PageContent(props: PropsWithChildren<PageContentProps>) {
  const {
    containerProps,
    maxW = "breakpoint-2xl",
    children,
    sidebarContent,
    ...boxProps
  } = props;

  return (
    <Container
      {...containerProps}
      maxW={maxW}
      flexGrow={1}
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "1fr auto" }}
      gap={2}
      px={{ base: 0, sm: 4, md: 6, lg: 8 }}
    >
      <Box
        w="100%"
        borderTopRadius={"md"}
        borderBottomRadius={
          sidebarContent ? { base: "md", lg: "none" } : "none"
        }
        bg="bg.panel"
        flexGrow={sidebarContent ? { base: 0, lg: 1 } : 1}
        borderWidth={1}
        borderBottomWidth={sidebarContent ? { base: 1, lg: 0 } : 0}
        borderColor="border"
        {...boxProps}
      >
        {children}
      </Box>
      {sidebarContent && (
        <Box
          w={{ base: "100%", lg: "sm" }}
          position={{ base: "initial", lg: "sticky" }}
          top={2}
          borderRadius={"md"}
          bg="bg.panel"
          borderWidth={1}
          borderColor="border"
          flexShrink={0}
          maxH={"85vh"}
          h="100%"
          mb={2}
        >
          {sidebarContent}
        </Box>
      )}
    </Container>
  );
}
