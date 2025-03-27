import {
  Box,
  Container,
  ContainerProps,
  Heading,
  Icon,
  Span,
  Link as StyledLink,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../ui/breadcrumb";
import { Link } from "wouter";
import { DarkMode } from "../ui/color-mode";
import { ChevronLeft } from "lucide-react";

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

  const lastActiveBreadcrumb = useMemo(() => {
    if (!breadcrumbs) return null;
    return breadcrumbs.reverse().find((breadcrumb) => breadcrumb.href) ?? null;
  }, [breadcrumbs]);

  return (
    <DarkMode colorPalette={"blue"}>
      <Box bg="bg.panel" className="dark" mb={-24} pb={24}>
        <Container
          py={4}
          gap={2}
          display="flex"
          flexDir={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "start", sm: "center" }}
          maxW={maxW}
          overflow="hidden"
          {...containerProps}
        >
          <Box overflow="hidden" maxW={"100%"}>
            {lastActiveBreadcrumb && (
              <StyledLink
                display={{ base: "flex", md: "none" }}
                asChild
                fontSize="sm"
                color="fg"
                maxW={"100%"}
              >
                <Link to={lastActiveBreadcrumb.href ?? ""}>
                  <Icon size="sm" asChild>
                    <ChevronLeft />
                  </Icon>
                  <Span
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    minW={0}
                  >
                    {lastActiveBreadcrumb.title}
                  </Span>
                </Link>
              </StyledLink>
            )}
            {breadcrumbs && (
              <BreadcrumbRoot
                variant="underline"
                colorPalette={"gray"}
                size="sm"
                display={{
                  base: "none",
                  md: "flex",
                }}
                css={{
                  "&>ol": {
                    w: "100%",
                    "&>li": {
                      minW: 0,
                    },
                    "&>li:not(.chakra-breadcrumb__separator)": {
                      minW: "24px",
                    },
                  },
                }}
              >
                {breadcrumbs.map((breadcrumb, index) =>
                  breadcrumb.href ? (
                    <BreadcrumbLink
                      key={index}
                      asChild
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                      overflow="hidden"
                      display="block"
                    >
                      <Link to={breadcrumb.href}>{breadcrumb.title}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbCurrentLink
                      key={index}
                      textOverflow={"ellipsis"}
                      whiteSpace={"nowrap"}
                      overflow="hidden"
                      display="block"
                    >
                      {breadcrumb.title}
                    </BreadcrumbCurrentLink>
                  )
                )}
              </BreadcrumbRoot>
            )}
            {title && <Heading color="fg">{title}</Heading>}
          </Box>
          {action && <Box flexShrink={0}>{action}</Box>}
        </Container>
      </Box>
    </DarkMode>
  );
}
