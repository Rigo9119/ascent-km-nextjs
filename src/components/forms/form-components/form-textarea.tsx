import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps {
  label: string;
  placeholder: string;
  value: string;
  rows: number;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
}

export default function FormTextarea({ label, placeholder, value, rows = 3, onChange, name }: FormTextareaProps) {
  return (
    <div className="w-full">
      <Label>{label}</Label>
      <Textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} name={name} />
    </div>
  );
}
