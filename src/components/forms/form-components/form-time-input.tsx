import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";
import { Clock } from "lucide-react";

interface FormTimeInputProps {
  field: AnyFieldApi;
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export const FormTimeInput = ({
  field,
  label,
  name,
  placeholder = "Select time",
  value,
  onChange,
  onBlur
}: FormTimeInputProps) => (
  <div className="w-full">
    <Label className="mb-4 flex items-center gap-2">
      <Clock className="w-4 h-4" />
      {label}
    </Label>
    <Input
      name={name}
      type="time"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="w-full"
    />
    <FieldInfo field={field} />
  </div>
);
