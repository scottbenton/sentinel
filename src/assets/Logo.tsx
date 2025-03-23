import { Icon, IconProps } from "@chakra-ui/react";

export function LogoIcon(props: IconProps) {
  return (
    <Icon asChild {...props}>
      <svg viewBox="0 0 144 144" fill="currentColor">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22 24C22 15.1634 29.1634 8 38 8H102C110.837 8 118 15.1634 118 24V40H58C54 40 54 44 54 44V72H38C29.1634 72 22 64.8366 22 56V40V24ZM118 120C118 128.837 110.837 136 102 136H38C29.1634 136 22 128.837 22 120V104H82C86 104 86 100 86 100V72H102C110.837 72 118 79.1634 118 88V104V120Z"
        />
      </svg>
    </Icon>
  );
}
