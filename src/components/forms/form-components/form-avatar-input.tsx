import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { FieldInfo } from "./field-info";
import { AnyFieldApi } from "@tanstack/react-form";

interface FormAvatarInputProps {
  field: AnyFieldApi;
  label: string;
  src: string;
  alt: string;
  name: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormAvatarInput({ 
  field, 
  label, 
  src, 
  alt, 
  name, 
  id, 
  onChange, 
  value 
}: FormAvatarInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const imageSource = value || src;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file select
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <Label className="block text-sm font-medium mb-4 text-gray-900 dark:text-gray-100">
        {label}
      </Label>

      <div className="flex flex-col items-center space-y-3">
        {/* Modern Avatar with Drag & Drop */}
        <div 
          className={`relative group cursor-pointer transition-all duration-200 ${
            isDragOver ? 'scale-105' : 'hover:scale-102'
          }`}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Main Avatar */}
          <Avatar className={`size-32 ring-4 shadow-lg transition-all duration-200 ${
            isDragOver 
              ? 'ring-emerald-400 shadow-emerald-200' 
              : imageSource 
                ? 'ring-emerald-100 hover:ring-emerald-200' 
                : 'ring-dashed ring-gray-300 hover:ring-emerald-300'
          }`}>
            {imageSource && (
              <AvatarImage src={imageSource} alt={alt} className="object-cover" />
            )}
            <AvatarFallback className={`transition-colors duration-200 ${
              isDragOver
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'
            }`}>
              {imageSource ? (
                <Upload className="w-8 h-8" />
              ) : (
                <Plus className={`w-12 h-12 transition-transform duration-200 ${
                  isDragOver ? 'scale-110' : 'group-hover:scale-110'
                }`} />
              )}
            </AvatarFallback>
          </Avatar>

          {/* Remove button for uploaded images */}
          {imageSource && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {/* Drag overlay indicator */}
          {isDragOver && (
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <div className="bg-emerald-500 text-white p-2 rounded-full">
                <Upload className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>

        {/* Subtle instruction text */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {imageSource ? (
              <>
                <span className="text-emerald-600 font-medium">Clic</span> para cambiar foto
              </>
            ) : (
              <>
                <span className="text-emerald-600 font-medium">Clic</span> o arrastra para subir foto
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PNG, JPG, GIF hasta 10MB
          </p>
        </div>

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