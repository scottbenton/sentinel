import { useCurrentEditor } from "@tiptap/react";
import { HeadingLevelSelect } from "./HeadingLevelSelect";
import { Box, IconButton, Separator } from "@chakra-ui/react";
import { ToggleIconButton } from "./ToggleIconButton";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { LinkButton } from "./LinkButton";

export function RichTextEditorToolbar() {
  const { editor } = useCurrentEditor();

  return (
    <Box display="flex" alignItems="center" justifyContent={"flex-start"}>
      <Tooltip content="Undo">
        <IconButton
          colorPalette={"gray"}
          variant="ghost"
          size="sm"
          aria-label="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2Icon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Redo">
        <IconButton
          colorPalette={"gray"}
          variant="ghost"
          size="sm"
          aria-label="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2Icon />
        </IconButton>
      </Tooltip>
      <Separator orientation="vertical" alignSelf={"stretch"} mx={1} />
      <HeadingLevelSelect />
      <ToggleIconButton
        label="Bold"
        isActive={editor?.isActive("bold")}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        ml={1}
      >
        <BoldIcon />
      </ToggleIconButton>
      <ToggleIconButton
        label="Italics"
        isActive={editor?.isActive("italic")}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </ToggleIconButton>
      <ToggleIconButton
        label="Underline"
        isActive={editor?.isActive("underline")}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </ToggleIconButton>
      <ToggleIconButton
        label="Strikethrough"
        isActive={editor?.isActive("strike")}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon />
      </ToggleIconButton>
      <Separator orientation="vertical" alignSelf={"stretch"} mx={1} />
      <ToggleIconButton
        label="Bullet List"
        isActive={editor?.isActive("bulletList")}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <ListIcon />
      </ToggleIconButton>
      <ToggleIconButton
        label="Ordered List"
        isActive={editor?.isActive("orderedList")}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon />
      </ToggleIconButton>
      <LinkButton />
      <ToggleIconButton
        label="Quote"
        isActive={editor?.isActive("blockquote")}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon />
      </ToggleIconButton>
      <ToggleIconButton
        label="Divider"
        isActive={editor?.isActive("horizontalRule")}
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <MinusIcon />
      </ToggleIconButton>
    </Box>
  );
}
