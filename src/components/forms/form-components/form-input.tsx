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
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void
}

export const FormInput = ({ field, label, name, type, placeholder, value, onChange, onBlur, defaultValue }: FormInputProps) => (
  <div className='w-full'>
    <Label className='mb-4'>{label}</Label>
    <Input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} defaultValue={defaultValue} />
    <FieldInfo field={field} />
  </div>
)
