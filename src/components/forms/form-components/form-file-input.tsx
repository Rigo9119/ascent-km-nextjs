import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFileInputProps {
  label: string;
  src: string;
  alt: string
  name: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormFileInput({ label, src, alt, name, id, onChange, value }: FormFileInputProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div>
        <Avatar className="size-24">
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <Input type='file' name={name} id={id} onChange={onChange} value={value} />
      </div>
    </div>
  )
}
