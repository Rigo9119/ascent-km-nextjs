import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { FormInput } from "./form-components/form-input";
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm({ mode }: { mode: string }) {
  const { signInWithPassword, signUp, isLoading } = useAuth();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
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
      <loginForm.Field name="email">
        {(field: AnyFieldApi) => (
          <FormInput
            field={field}
            name={field.name}
            value={field.state.value}
            type="email"
            placeholder="example@email.com"
            label="Email"
            onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
          />
        )}
      </loginForm.Field>
      <loginForm.Field name="password">
        {(field: AnyFieldApi) => (
          <FormInput
            field={field}
            name={field.name}
            value={field.state.value}
            type="password"
            placeholder="password"
            label="Password"
            onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
          />
        )}
      </loginForm.Field>
      <loginForm.Subscribe>
        {({ isSubmitting }) => (
          <Button type="submit" disabled={isSubmitting || isLoading} className="bg-emerald-500">
            {isSubmitting || isLoading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </Button>
        )}
      </loginForm.Subscribe>
    </form>
  );
}
