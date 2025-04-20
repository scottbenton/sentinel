import {
  createListCollection,
  HStack,
  Icon,
  IconButton,
  Portal,
  Select,
  useSelectContext,
} from "@chakra-ui/react";
import { useCurrentEditor } from "@tiptap/react";
import {
  ChevronDown,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
} from "lucide-react";

export function HeadingLevelSelect() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const getActiveTextType = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";

    return "normal";
  };

  const setActiveTextType = (value: string) => {
    switch (value) {
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "h4":
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      default:
        editor.chain().focus().setParagraph().run();
    }
  };
  return (
    <Select.Root
      positioning={{ sameWidth: false }}
      collection={headingItems}
      value={[getActiveTextType()]}
      onValueChange={(value) => {
        setActiveTextType(value.value[0]);
      }}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <SelectTrigger />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content minW="32">
            {headingItems.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                <HStack>
                  {framework.icon}
                  {framework.label}
                </HStack>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

const SelectTrigger = () => {
  const select = useSelectContext();
  const items = select.selectedItems as HeadingConfig[];
  return (
    <IconButton
      px="2"
      variant="subtle"
      colorPalette={"gray"}
      size="sm"
      {...select.getTriggerProps()}
    >
      {select.hasSelectedItems ? items[0].icon : <Heading />}
      <Icon asChild size="xs" strokeWidth={3} color="inherit">
        <ChevronDown />
      </Icon>
    </IconButton>
  );
};

const headingItems = createListCollection({
  items: [
    { label: "Normal Text", value: "normal", icon: <Heading /> },
    { label: "Heading 1", value: "h1", icon: <Heading1 /> },
    { label: "Heading 2", value: "h2", icon: <Heading2 /> },
    { label: "Heading 3", value: "h3", icon: <Heading3 /> },
    { label: "Heading 4", value: "h4", icon: <Heading4 /> },
  ],
});

interface HeadingConfig {
  label: string;
  value: string;
  icon: React.ReactNode;
}
