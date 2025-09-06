import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AnyFieldApi } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FormPasswordInputProps {
  field: AnyFieldApi;
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}

export default function FormPasswordInput({
  field,
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <Label className="mb-4 text-gray-900 dark:text-gray-100">{label}</Label>
      <div className="relative">
        <Input
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      <FieldInfo field={field} />
    </div>
  );
}