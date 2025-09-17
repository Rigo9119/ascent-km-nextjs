import { AnyFieldApi, useForm } from "@tanstack/react-form";
import FormInput from "./form-components/form-input";
import FormPasswordInput from "./form-components/form-password-input";
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, signUpSchema } from "@/lib/validations/auth";
import Link from "next/link";

export default function LoginForm({ mode }: { mode: string }) {
  const { signInWithPassword, signUp, isLoading } = useAuth();

  const schema = mode === "sign-up" ? signUpSchema : loginSchema;

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = schema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },
    onSubmit: async ({ value }) => {
      if (mode === "sign-up") {
        await signUp(value.email, value.password);
      } else {
        await signInWithPassword(value.email, value.password);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    loginForm.handleSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <loginForm.Field
        name="email"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const result = schema.shape.email.safeParse(value);
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
            label="Correo"
            onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </loginForm.Field>
      <loginForm.Field
        name="password"
        validators={{
          onChange: ({ value }: { value: string }) => {
            const result = schema.shape.password.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          }
        }}
      >
        {(field: AnyFieldApi) => (
          <FormPasswordInput
            field={field}
            name={field.name}
            value={field.state.value}
            placeholder={mode === "sign-up" ? "Mínimo 8 caracteres" : "contraseña"}
            label="Contraseña"
            onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </loginForm.Field>
      <loginForm.Subscribe>
        {({ isSubmitting }) => (
          <Button type="submit" disabled={isSubmitting || isLoading} className="bg-emerald-500">
            {isSubmitting || isLoading ? "Cargando..." : mode === "login" ? "Iniciar Sesión" : "Registrarse"}
          </Button>
        )}
      </loginForm.Subscribe>
      
      {mode === "login" && (
        <div className="text-center space-y-3">
          <Link 
            href="/auth?mode=reset" 
            className="text-sm text-gray-600 hover:text-emerald-600 block"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <div className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              href="/auth?mode=sign-up" 
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      )}
      
      {mode === "sign-up" && (
        <div className="text-center">
          <div className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link 
              href="/auth?mode=login" 
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
