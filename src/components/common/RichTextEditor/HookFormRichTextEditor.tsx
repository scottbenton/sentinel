import { Field } from "@chakra-ui/react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { RichTextEditor } from "./RichTextEditor";

export interface HookFormRichTextEditorProps<Form extends FieldValues> {
  label: string;
  control: Control<Form>;
  formField: Path<Form>;
  errorMessage?: string;
  helperText?: string;
  required: boolean;
}

export function HookFormRichTextEditor<Form extends FieldValues>(
  props: HookFormRichTextEditorProps<Form>
) {
  const { label, control, formField, errorMessage, helperText, required } =
    props;

  return (
    <Field.Root invalid={!!errorMessage} required={required}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Controller
        name={formField}
        control={control}
        rules={{ required }}
        render={({ field: { onChange, value } }) => (
          <RichTextEditor
            readOnly={false}
            content={value}
            onChange={onChange}
          />
        )}
      />
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  );
}
