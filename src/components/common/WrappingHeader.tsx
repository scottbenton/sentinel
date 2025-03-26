import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

interface WrappingHeaderProps extends BoxProps {
  contentLeft: ReactNode;
  contentRight?: ReactNode;
}

export function WrappingHeader(props: WrappingHeaderProps) {
  const { contentLeft, contentRight, ...boxProps } = props;

  return (
    <Box
      display="flex"
      flexDir={{ base: "column", sm: "row" }}
      alignItems={{ base: "start", sm: "center" }}
      justifyContent="space-between"
      gap={1}
      {...boxProps}
    >
      <Box>{contentLeft}</Box>
      {contentRight && <Box>{contentRight}</Box>}
    </Box>
  );
}
