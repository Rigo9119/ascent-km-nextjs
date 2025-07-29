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
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FormInput = ({ field, label, name, type, placeholder, value, onChange }: FormInputProps) => (
  <div>
    <Label>{label}</Label>
    <Input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    <FieldInfo field={field} />
  </div>
)
