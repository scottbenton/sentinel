import { Prose } from "@/components/ui/prose";
import {
  Content,
  EditorEvents,
  EditorProvider,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { useCallback, useEffect, useRef } from "react";

const extensions = [StarterKit, UnderlineExtension, LinkExtension];

export interface BaseEditorProps {
  content?: Content;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  slotBefore?: React.ReactNode;
  slotAfter?: React.ReactNode;
}

export function BaseEditor(props: BaseEditorProps) {
  const { content, onChange, readOnly, slotBefore, slotAfter } = props;

  const handleUpdate = useCallback(
    ({ editor }: EditorEvents["update"]) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    [onChange]
  );

  return (
    <Prose
      css={{
        w: "100%",
        "& .tiptap": {
          w: "100%",
          minH: readOnly ? "unset" : "48",
          p: readOnly ? 0 : 4,

          wordBreak: "break-word",

          borderWidth: 0,
          borderStyle: "solid",
          borderColor: "transparent",

          "&:focus": {
            outline: "none",
          },

          "&>:first-of-type": {
            marginTop: 0,
          },

          "& a": {
            color: "colorPalette.solid",
            textDecorationColor: "colorPalette.subtle",
            textDecorationThickness: "1px",
            cursor: "pointer",
          },
        },
      }}
    >
      <EditorProvider
        slotBefore={slotBefore}
        slotAfter={slotAfter}
        extensions={extensions}
        content={content}
        editable={!readOnly}
        onUpdate={handleUpdate}
      >
        {readOnly && <EditorUpdater content={content} />}
      </EditorProvider>
    </Prose>
  );
}

function EditorUpdater(props: { content?: Content }) {
  const { content } = props;

  const mostRecentlyUpdatedContent = useRef<Content | undefined>(null);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && content !== mostRecentlyUpdatedContent.current) {
      editor.commands.setContent(content ?? null);
      mostRecentlyUpdatedContent.current = content;
    }
  }, [editor, content]);

  return null;
}
