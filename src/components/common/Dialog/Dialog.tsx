import { DialogRootProps, IconButton, Portal } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Dialog as CDialog } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { color } from "@/providers/ThemeProvider";
export interface DialogProps {
  trigger?: ReactNode;
  title: ReactNode;
  content?: ReactNode;
  fullContent?: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  onClose?: () => void;
  scrollOutside?: boolean;
  role?: "dialog" | "alertdialog";
  size?: DialogRootProps["size"];
}

export function Dialog(props: DialogProps) {
  const {
    trigger,
    title,
    content,
    fullContent,
    actions,
    open,
    onClose,
    scrollOutside,
    role,
    size,
  } = props;

  return (
    <CDialog.Root
      role={role}
      open={open}
      onOpenChange={() => onClose && onClose()}
      lazyMount
      scrollBehavior={scrollOutside ? "outside" : "inside"}
      size={size}
      placement={"center"}
    >
      <CDialog.Backdrop />
      {trigger && <CDialog.Trigger asChild>{trigger}</CDialog.Trigger>}
      <Portal>
        <CDialog.Positioner>
          <CDialog.Content colorPalette={color}>
            <CDialog.Header>
              {typeof title === "string" ? (
                <CDialog.Title>{title}</CDialog.Title>
              ) : (
                title
              )}
            </CDialog.Header>
            <CDialog.CloseTrigger asChild>
              <IconButton
                aria-label="Close Dialog"
                colorPalette={"gray"}
                variant="ghost"
              >
                <XIcon />
              </IconButton>
            </CDialog.CloseTrigger>
            {fullContent ? fullContent : null}
            {content && (
              <CDialog.Body position={scrollOutside ? undefined : "relative"}>
                {content}
              </CDialog.Body>
            )}
            {actions && <CDialog.Footer px={4}>{actions}</CDialog.Footer>}
          </CDialog.Content>
        </CDialog.Positioner>
      </Portal>
    </CDialog.Root>
  );
}
