import { Box } from "@chakra-ui/react";
import { BaseEditor } from "./BaseEditor";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";

export interface RichTextEditorProps {
  readOnly?: boolean;
  content: string | null;
  onChange?: (content: string) => void;
}

export function RichTextEditor(props: RichTextEditorProps) {
  const { readOnly, content, onChange } = props;

  return (
    <Box
      css={{
        display: "inline-flex",
        maxW: "65ch",
        fontSize: "sm",
        w: "100%",
        outlineWidth: 1,
        outlineColor: "transparent",
        outlineStyle: "solid",
        outlineOffset: 0,

        borderWidth: readOnly ? 0 : 1,
        borderColor: "border",

        borderRadius: "sm",

        "&:focus-within": {
          borderColor: "colorPalette.solid",
          outlineColor: "colorPalette.solid",
        },
      }}
    >
      <BaseEditor
        readOnly={readOnly}
        slotBefore={
          !readOnly && (
            <Box
              css={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 2,
                borderBottomWidth: 1,
                borderBottomColor: "border",
                borderTopRadius: "sm",
                overflowX: "auto",
              }}
            >
              <RichTextEditorToolbar />
            </Box>
          )
        }
        content={content ?? undefined}
        onChange={onChange}
      />
    </Box>
  );
}
