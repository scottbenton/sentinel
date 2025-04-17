import { useUserNameWithStatus } from "@/stores/users.store";
import { Avatar, AvatarRootProps, ColorPalette } from "@chakra-ui/react";
import { BotIcon } from "lucide-react";

export interface UserAvatarProps extends AvatarRootProps {
  uid: string | null;
}

const colorPalette: ColorPalette[] = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
];

const pickPalette = (uid: string): ColorPalette => {
  const index = uid.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export function UserAvatar(props: UserAvatarProps) {
  const { uid, ...avatarProps } = props;

  const { name } = useUserNameWithStatus(uid);

  return (
    <Avatar.Root
      {...avatarProps}
      colorPalette={uid ? pickPalette(uid) : "gray"}
      variant={uid ? "subtle" : "solid"}
    >
      <Avatar.Fallback
        css={
          !uid && {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }
        }
        name={uid ? name ?? "Loading" : "Sentinel Bot"}
      >
        {!uid && <BotIcon width="60%" height="60%" />}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
