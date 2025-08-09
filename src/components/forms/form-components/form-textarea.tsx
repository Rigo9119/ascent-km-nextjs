import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";

interface FormTextareaProps {
  field: AnyFieldApi;
  label: string;
  placeholder: string;
  value: string;
  rows: number;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export default function FormTextarea({ field, label, placeholder, value, rows = 3, onChange, onBlur, name }: FormTextareaProps) {
  return (
    <div className="w-full">
      <Label className="mb-4">{label}</Label>
      <Textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} name={name} onBlur={onBlur} />
      <FieldInfo field={field} />
    </div>
  );
}
