import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";

interface FormInputProps {
  field: AnyFieldApi;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  defaultValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export default function FormInput({
  field,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  defaultValue,
}: FormInputProps) {
  return (
    <div className="w-full">
      <Label className="mb-4 text-gray-900 dark:text-gray-100">{label}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
      />
      <FieldInfo field={field} />
    </div>
  );
}
