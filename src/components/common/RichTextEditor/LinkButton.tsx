import { Button, Group, IconButton, Popover, Portal } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCurrentEditor } from "@tiptap/react";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { HookFormTextField } from "../HookFormTextField";
const formSchema = yup.object({
  link: yup
    .string()
    .matches(
      /^(https?:\/\/[^\s/$.?#].[^\s]*)|(mailto:[^\s@]+@[^\s@]+\.[^\s@]+)$/,
      "Invalid link format"
    )
    .required("Link is required"),
});

export function LinkButton() {
  const { editor } = useCurrentEditor();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [isOpen, setIsOpen] = useState(false);

  console.debug("IS OPEN", isOpen);
  const onSubmit = handleSubmit(({ link }) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: link })
        .run();
      reset();
    }
  });

  return (
    <Popover.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
      <Popover.Trigger asChild>
        <IconButton
          colorPalette={"gray"}
          variant={editor?.isActive("link") ? "subtle" : "ghost"}
          size="sm"
          aria-label="Add Link"
          onClick={() => {
            if (editor) {
              const { href } = editor.getAttributes("link");
              setValue("link", href);
            }
          }}
        >
          <LinkIcon />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body as="form" onSubmit={onSubmit}>
              <Popover.Title mb={4}>Set Link</Popover.Title>
              <HookFormTextField
                label="Link"
                required
                register={register}
                formField="link"
                errorMessage={errors.link?.message}
              />
              <Group mt={4} justifyContent={"flex-end"} w="100%">
                <Button
                  variant="subtle"
                  type="reset"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Set Link</Button>
              </Group>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
