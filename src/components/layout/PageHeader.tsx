import { Box, Container, ContainerProps, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../ui/breadcrumb";
import { Link } from "wouter";
import { DarkMode } from "../ui/color-mode";

export interface PageHeaderProps extends ContainerProps {
  title?: string;
  action?: ReactNode;
  breadcrumbs?: { title: string; href?: string }[];
}

export function PageHeader(props: PageHeaderProps) {
  const {
    title,
    action,
    breadcrumbs,
    maxW = "breakpoint-2xl",
    ...containerProps
  } = props;

  return (
    <DarkMode colorPalette={"blue"}>
      <Box bg="bg.panel" className="dark" mb={-24} pb={24}>
        <Container
          py={4}
          display="flex"
          flexDir={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "start", sm: "center" }}
          maxW={maxW}
          {...containerProps}
        >
          <Box>
            {breadcrumbs && (
              <BreadcrumbRoot variant="underline" colorPalette={"gray"}>
                {breadcrumbs.map((breadcrumb, index) =>
                  breadcrumb.href ? (
                    <BreadcrumbLink key={index} asChild>
                      <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbCurrentLink key={index}>
                      {breadcrumb.title}
                    </BreadcrumbCurrentLink>
                  )
                )}
              </BreadcrumbRoot>
            )}
            {title && <Heading color="fg">{title}</Heading>}
          </Box>
          {action && <Box>{action}</Box>}
        </Container>
      </Box>
    </DarkMode>
  );
}
