import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { FieldInfo } from "./field-info";
import { AnyFieldApi } from "@tanstack/react-form";

interface FormFileInputProps {
  field: AnyFieldApi;
  label: string;
  src: string;
  alt: string;
  name: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormFileInput({ field, label, src, alt, name, id, onChange, value }: FormFileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Use value as the image source since that's what the form is managing
  const imageSource = value || src;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      // Create a synthetic event to trigger onChange with empty value
      const event = {
        target: { ...fileInputRef.current, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (fileInputRef.current) {
        // Create a synthetic event with the base64 data
        const event = {
          target: { ...fileInputRef.current, value: result }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      }
    }
  };

  return (
    <div className="w-full">
      <Label className="block text-sm font-medium mb-4">{label}</Label>

      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Preview */}
        <div className="relative group">
          <Avatar className="size-32 ring-4 ring-emerald-100 shadow-lg">
            {imageSource && <AvatarImage src={imageSource} alt={alt} className="object-cover" />}
            <AvatarFallback className="bg-emerald-50 text-emerald-600 text-2xl">
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          {/* Remove button (only show if there's an image) */}
          {imageSource && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Camera overlay on hover */}
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleFileSelect}>
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`relative w-full max-w-md p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${isDragOver
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
        >
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-emerald-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleFileSelect}
          className="w-full max-w-md border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose Photo
        </Button>

        {/* Hidden File Input */}
        <Input
          ref={fileInputRef}
          type="file"
          name={name}
          id={id}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <FieldInfo field={field} />
    </div>
  );
}
