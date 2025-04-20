import { Tooltip } from "@/components/ui/tooltip";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export interface ToggleIconButtonProps
  extends Omit<IconButtonProps, "onClick"> {
  isActive: boolean | undefined;
  onClick: () => void;
  label: string;
}

export function ToggleIconButton(
  props: PropsWithChildren<ToggleIconButtonProps>
) {
  const { isActive, onClick, label, children, ...buttonProps } = props;

  return (
    <Tooltip content={label}>
      <IconButton
        size="sm"
        type="button"
        onClick={onClick}
        aria-label={label}
        variant={isActive ? "subtle" : "ghost"}
        colorPalette="gray"
        aria-pressed={isActive}
        {...buttonProps}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
