import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormPhoneInputProps {
  field: AnyFieldApi;
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string | undefined) => void;
  onCountryChange?: (countryCode: string | undefined) => void;
  countryCode?: string;
}

export default function FormPhoneInput({
  field,
  label,
  name,
  placeholder = "Enter phone number",
  value,
  onChange,
  onCountryChange,
  countryCode
}: FormPhoneInputProps) {

  // Handle display value safely - avoid double country codes
  const displayValue = (() => {
    if (!value) return value;
    
    // If value already starts with +, use it as-is (already E.164 format)
    if (value.startsWith('+')) return value;
    
    // If we have a country code and value doesn't start with +, reconstruct
    if (countryCode) return `+${countryCode}${value}`;
    
    // Fallback to original value
    return value;
  })();

  const handlePhoneChange = (newValue: string | undefined) => {
    if (!newValue) {
      onChange(undefined);
      return;
    }

    try {
      // Parse the phone number
      const phoneNumber = parsePhoneNumber(newValue);
      
      if (phoneNumber && phoneNumber.country) {
        // Store only the national number (digits only) to match DB constraint
        const nationalNumber = phoneNumber.nationalNumber;
        onChange(nationalNumber);
        
        // Update country code if callback provided
        if (onCountryChange) {
          const callingCode = getCountryCallingCode(phoneNumber.country);
          onCountryChange(callingCode);
        }
      } else {
        // If parsing fails, store as-is
        onChange(newValue);
      }
    } catch (error) {
      console.log('Phone parsing error:', error);
      onChange(newValue); // Fallback to original value if parsing fails
    }
  };
  return (
    <div className='w-full'>
      <Label className='mb-2 block'>{label}</Label>
      <PhoneInput
        placeholder={placeholder}
        value={displayValue}
        name={name}
        onChange={handlePhoneChange}
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
