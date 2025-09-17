import { AnyFieldApi, useForm } from "@tanstack/react-form";
import FormInput from "./form-components/form-input";
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
});

export default function ResetPasswordForm() {
  const { resetPassword, isLoading } = useAuth();

  const resetForm = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = resetPasswordSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
    onSubmit: async ({ value }) => {
      await resetPassword(value.email);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resetForm.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <resetForm.Field
        name="email"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const result = resetPasswordSchema.shape.email.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          }
        }}
      >
        {(field: AnyFieldApi) => (
          <FormInput
            field={field}
            name={field.name}
            value={field.state.value}
            type="email"
            placeholder="example@email.com"
            label="Correo Electrónico"
            onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </resetForm.Field>
      
      <div className="text-sm text-gray-600 mb-4">
        <p>Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
      </div>

      <resetForm.Subscribe>
        {({ isSubmitting }) => (
          <Button type="submit" disabled={isSubmitting || isLoading} className="bg-red-500 hover:bg-red-600">
            {isSubmitting || isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        )}
      </resetForm.Subscribe>
    </form>
  );
}