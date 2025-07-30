import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";

interface FormDatePickerProps {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const FormDatePicker = ({
  field,
  label,
  placeholder = "Pick a date",
  value,
  onChange,
  disabled = false,
  className
}: FormDatePickerProps) => (
  <div className='w-full'>
    <Label className='mb-2'>{label}</Label>
    <DatePicker
      date={value}
      onDateChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
    <FieldInfo field={field} />
  </div>
)
