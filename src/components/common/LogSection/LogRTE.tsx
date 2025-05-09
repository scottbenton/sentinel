import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  Menu,
} from "@chakra-ui/react";
import { ICommentLog } from "@/services/logValidationUtil.service";
import { BaseEditor } from "../RichTextEditor/BaseEditor";
import { RichTextEditorToolbar } from "../RichTextEditor/RichTextEditorToolbar";
import { useLogsStore } from "@/stores/logs.store";
import { useUID } from "@/stores/auth.store";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { useState } from "react";
import { EllipsisIcon } from "lucide-react";

export interface LogRTEProps {
  meetingId: number | null;
  organizationId: number | null;
  log?: ICommentLog;
  readOnly?: boolean;
  canTriggerEdit?: boolean;
}

export function LogRTE(props: LogRTEProps) {
  const { meetingId, organizationId, readOnly, log, canTriggerEdit } = props;

  const [isEditing, setIsEditing] = useState(false);
  const isCurrentlyReadOnly = readOnly && (canTriggerEdit ? !isEditing : true);

  const uid = useUID();

  const addComment = useLogsStore((store) => store.addLog);
  const updateComment = useLogsStore((store) => store.updateLog);
  const deleteComment = useLogsStore((store) => store.deleteLog);

  const handleSave = (content: string, editor: Editor) => {
    if (!uid) {
      console.error("No user id");
      return;
    }
    if (log) {
      setIsEditing(false);

      editor.options.editable = false;
      editor.view.update(editor.view.props);
      updateComment(log.id, content).catch(() => {});
    } else {
      addComment({
        uid,
        meetingId,
        organizationId,
        content,
      }).catch(() => {});
    }
  };

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

        borderWidth: 1,
        p: readOnly ? 2 : 0,
        borderColor: "border",

        borderRadius: "sm",

        "&:focus-within": isCurrentlyReadOnly
          ? {}
          : {
              borderColor: "colorPalette.solid",
              outlineColor: "colorPalette.solid",
            },
        "& .tiptap>:last-of-type": {
          mb: 0,
        },
      }}
    >
      <BaseEditor
        oneLineEditor
        readOnly={isCurrentlyReadOnly}
        slotBefore={
          !isCurrentlyReadOnly ? (
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
              <RichTextEditorToolbar minimal />
            </Box>
          ) : canTriggerEdit && log ? (
            <ActionsMenu
              zIndex={1}
              onEdit={() => {
                setIsEditing(true);
              }}
              onDelete={() => {
                deleteComment(log.id).catch(() => {});
              }}
              variant="ghost"
              aria-label="Comment Options"
              colorPalette="gray"
              size="sm"
              float="right"
            >
              <EllipsisIcon />
            </ActionsMenu>
          ) : (
            <></>
          )
        }
        content={log?.content ?? undefined}
        slotAfter={
          !isCurrentlyReadOnly && (
            <Box display="flex" justifyContent={"flex-end"} p={1}>
              <SaveButton variant="subtle" onClick={handleSave}>
                {log ? "Save" : "Comment"}
              </SaveButton>
            </Box>
          )
        }
      />
    </Box>
  );
}

const SaveButton = (
  props: Omit<ButtonProps, "onClick"> & {
    onClick: (content: string, editor: Editor) => void;
  }
) => {
  const { onClick, ...buttonProps } = props;
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        onClick(editor.getHTML(), editor);
        editor?.chain().focus().clearContent().run();
      }}
      {...buttonProps}
    />
  );
};

const ActionsMenu = (
  props: Omit<IconButtonProps, "onClick"> & {
    onEdit: (editor: Editor) => void;
    onDelete: () => void;
  }
) => {
  const { onEdit, onDelete, ...buttonProps } = props;
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton {...buttonProps} />
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item
            value="edit"
            onClick={() => {
              editor.options.editable = true;
              editor.view.update(editor.view.props);
              onEdit(editor);
            }}
          >
            Edit
          </Menu.Item>
          <Menu.Item value="delete" onClick={onDelete}>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
