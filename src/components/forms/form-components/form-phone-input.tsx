import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormPhoneInputProps {
  field: AnyFieldApi;
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

export default function FormPhoneInput({ 
  field, 
  label, 
  name, 
  placeholder = "Enter phone number", 
  value, 
  onChange 
}: FormPhoneInputProps) {
  return (
    <div className='w-full'>
      <Label className='mb-2 block'>{label}</Label>
      <PhoneInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultCountry="KR"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        numberInputProps={{
          className: "flex h-10 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        }}
      />
      <FieldInfo field={field} />
    </div>
  );
}