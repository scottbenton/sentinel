import { Icon, Input, InputGroup, InputGroupProps } from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";

export interface MeetingFilterBarProps
  extends Omit<InputGroupProps, "children"> {
  searchText: string;
  onSearchTextChange: (search: string) => void;
}
export function MeetingFilterBar(props: MeetingFilterBarProps) {
  const { searchText, onSearchTextChange, ...groupProps } = props;
  return (
    <InputGroup
      startElement={
        <Icon asChild size="sm">
          <SearchIcon />
        </Icon>
      }
      {...groupProps}
    >
      <Input
        placeholder="Search by meeting or organization name"
        value={searchText}
        onChange={(evt) => onSearchTextChange(evt.currentTarget.value)}
      />
    </InputGroup>
  );
}
