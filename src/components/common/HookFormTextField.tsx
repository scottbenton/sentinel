import { Field, Input } from "@chakra-ui/react";
import { HTMLInputTypeAttribute } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface HookFormTextFieldProps<Form extends FieldValues> {
  register: UseFormRegister<Form>;
  label: string;
  formField: Path<Form>;
  errorMessage?: string;
  helperText?: string;
  required: boolean;
  type?: HTMLInputTypeAttribute;
}

export function HookFormTextField<Form extends FieldValues>(
  props: HookFormTextFieldProps<Form>
) {
  const {
    register,
    label,
    required,
    formField,
    errorMessage,
    helperText,
    type,
  } = props;

  return (
    <Field.Root invalid={!!errorMessage} required={required}>
      <Field.Label>
        {label}
        <Field.RequiredIndicator />
      </Field.Label>
      <Input {...register(formField)} type={type} />
      <Field.ErrorText>{errorMessage}</Field.ErrorText>
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
    </Field.Root>
  );
}
