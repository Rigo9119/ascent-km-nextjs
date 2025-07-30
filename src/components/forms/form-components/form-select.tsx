import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";

export type Option = {
  value: string;
  label: string;
}

interface FormSelectProps {
  field: AnyFieldApi;
  id?: string;
  name?: string;
  label: string;
  value: string;
  placeholder: string;
  optionsLabel?: string;
  options: { value: string, label: string }[]
  onValueChange: (value: string) => void;
}

export default function FormSelect({ field, id, name, label, value, placeholder, optionsLabel, options, onValueChange }: FormSelectProps) {
  return (
    <div id={id} className='w-full'>
      <Label className='mb-2'>{label}</Label>
      <Select value={value} onValueChange={onValueChange} name={name}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {optionsLabel && <SelectLabel>{optionsLabel}</SelectLabel>}
            {options.map((option: Option, index: number) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldInfo field={field} />
    </div>
  )
}
