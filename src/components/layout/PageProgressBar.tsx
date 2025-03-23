import { Bleed, BleedProps } from "@chakra-ui/react";
import { ProgressBar } from "../common/ProgressBar";

interface PageProgressBarProps extends BleedProps {
  loading: boolean;
}
export function PageProgressBar(props: PageProgressBarProps) {
  const { loading, ...bleedProps } = props;

  if (!loading) return null;

  return (
    <Bleed blockStart={4} inline={4} {...bleedProps}>
      <ProgressBar />
    </Bleed>
  );
}
