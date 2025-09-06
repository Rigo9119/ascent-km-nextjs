"use client";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "./form-components/form-input";
import FormAvatarInput from "./form-components/form-avatar-input";
import FormCommunityTypesSelect from "./form-components/form-community-types-select";
import { useState, ChangeEvent } from "react";
import FormTextarea from "./form-components/form-textarea";
import FormPhoneInput from "./form-components/form-phone-input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { defaultPreferences, UserPreferences } from "@/types/preferences";
import { CommunityType } from "@/types/community-type";

interface OnboardingFormProps {
  user: User;
  communityTypes: CommunityType[];
}


export type LocationValue = { city: string; country: string };

export function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function OnboardingForm({ user, communityTypes }: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [selectedCommunityTypes, setSelectedCommunityTypes] = useState<string[]>([]);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("");
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const onboardingForm = useForm({
    defaultValues: {
      username: "",
      full_name: "",
      avatar_url: "",
      updated_at: "",
      created_at: "",
      phone_number: "",
      country_code: "",
      interests: [],
      bio: "",
      location: {} as LocationValue,
      last_active: "",
    },
    onSubmit: async ({ value }) => {
      console.log('Form submission started with values:', value);
      try {
        console.log('Step 1: Starting avatar processing...');
        let avatarPath = null;

        // Temporarily skip avatar upload due to timeout issues
        if (false && value.avatar_url && value.avatar_url.startsWith("data:")) {
          console.log('Step 2: Processing avatar upload...');
          try {
            const avatarBlob = dataURLtoBlob(value.avatar_url);
            console.log('Step 3: Avatar blob created, uploading to storage...');
            //stores the avatar image on the avatars bucket and gets the path
            
            // Create upload promise with timeout
            const uploadPromise = supabase.storage
              .from("user_avatars")
              .upload(`${user.id}.png`, avatarBlob, {
                cacheControl: "3600",
                upsert: true,
              });
            
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Upload timeout after 10 seconds')), 10000);
            });
            
            const { data: avatarUrl, error: avartUploadError } = await Promise.race([
              uploadPromise,
              timeoutPromise
            ]);
            console.log('Step 4: Upload response received:', { avatarUrl, avartUploadError });
            if (avartUploadError) {
              throw new Error(avartUploadError.message);
            } else {
              const { data } = supabase.storage.from("user_avatars").getPublicUrl(avatarUrl.path);
              avatarPath = data.publicUrl;
              console.log('Step 5: Avatar URL obtained:', avatarPath);
            }
          } catch (error) {
            console.error("Avatar upload error:", error);
            console.log('Step 5: Avatar upload failed, continuing without avatar...');
            toast.error("Error al subir el avatar, continuando sin foto de perfil", {
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
              },
            });
            avatarPath = null;
          }
        } else {
          console.log('Step 2: No avatar to upload, skipping...');
        }

        console.log('Step 6: Creating profile data...');
        const profileData = {
          id: user.id,
          username: value.username,
          full_name: value.full_name,
          avatar_url: avatarPath,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          phone_number: value.phone_number,
          email: user.email,
          country_code: phoneCountryCode || value.country_code || null,
          interests: selectedCommunityTypes,
          bio: value.bio,
          city: value.location.city,
          country: value.location.country,
          preferences: userPreferences,
          last_active: new Date().toISOString(),
        };

        console.log('Step 7: Inserting profile into database...');
        const { error: updateUserProfileError } = await supabase
          .from("profiles")
          .upsert(profileData, { onConflict: "id" });

        if (updateUserProfileError) {
          throw new Error(updateUserProfileError.message);
        }
        console.log("profileData", profileData);
        console.log('Profile created successfully, redirecting...');
        // Success toast
        toast.success("¡Perfil creado exitosamente! ¡Bienvenido a la plataforma!", {
          style: {
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#059669',
          },
        });

        // Redirect after a short delay to show the toast
        setTimeout(() => {
          console.log('Attempting redirect to home...');
          router.push("/");
        }, 1500);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast.error(`Error al crear el perfil: ${errorMessage}`, {
          style: {
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
          },
        });
        console.error('Profile creation error:', error);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onboardingForm.handleSubmit();
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <onboardingForm.Field name="avatar_url">
            {(field: AnyFieldApi) => (
              <FormAvatarInput
                field={field}
                label="Foto de Perfil"
                id={field.name}
                name={field.name}
                src={field.state.value || "?"}
                alt={field.name}
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              />
            )}
          </onboardingForm.Field>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <onboardingForm.Field name="username">
              {(field: AnyFieldApi) => (
                <FormInput
                  field={field}
                  label="Nombre de Usuario"
                  name={field.name}
                  type="text"
                  placeholder="usuario123"
                  value={field.state.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
                />
              )}
            </onboardingForm.Field>

            <onboardingForm.Field name="full_name">
              {(field: AnyFieldApi) => (
                <FormInput
                  field={field}
                  label="Nombre Completo"
                  name={field.name}
                  type="text"
                  placeholder="Juan Pérez"
                  value={field.state.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
                />
              )}
            </onboardingForm.Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <onboardingForm.Field name="phone_number">
              {(field: AnyFieldApi) => (
                <FormPhoneInput
                  field={field}
                  label="Número de Teléfono"
                  name={field.name}
                  placeholder="Ingresa tu número de teléfono"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value || "")}
                  onCountryChange={(countryCode) => setPhoneCountryCode(countryCode || "")}
                  countryCode={phoneCountryCode}
                />
              )}
            </onboardingForm.Field>
          </div>

          <onboardingForm.Field name="bio">
            {(field: AnyFieldApi) => (
              <FormTextarea
                field={field}
                label="Biografía"
                placeholder="Cuéntanos sobre ti..."
                value={field.state.value}
                name={field.name}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                rows={4}
              />
            )}
          </onboardingForm.Field>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <onboardingForm.Field name="location">
              {(field: AnyFieldApi) => (
                <>
                  <FormInput
                    field={field}
                    label="Ciudad"
                    name="city"
                    type="text"
                    placeholder="Buenos Aires"
                    value={field.state.value?.city || ""}
                    onChange={(e) =>
                      field.handleChange({
                        ...field.state.value,
                        city: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    field={field}
                    label="País"
                    name="country"
                    type="text"
                    placeholder="Argentina"
                    value={field.state.value?.country || ""}
                    onChange={(e) =>
                      field.handleChange({
                        ...field.state.value,
                        country: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </onboardingForm.Field>
          </div>
        </CardContent>
      </Card>

      {/* Community Types */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Comunidades</CardTitle>
          <p className="text-sm text-gray-600">Selecciona los tipos de comunidades que te interesan</p>
        </CardHeader>
        <CardContent>
          <FormCommunityTypesSelect
            field={{} as AnyFieldApi}
            label=""
            communityTypes={communityTypes}
            selectedIds={selectedCommunityTypes}
            onChange={setSelectedCommunityTypes}
          />
        </CardContent>
      </Card>


      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de la Aplicación</CardTitle>
          <p className="text-sm text-gray-600">Configura cómo quieres usar la aplicación</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Preference */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Tema</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Claro" },
                { value: "dark", label: "Oscuro" },
                { value: "system", label: "Sistema" }
              ].map((theme) => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => setUserPreferences(prev => ({ ...prev, theme: theme.value as UserPreferences['theme'] }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    userPreferences.theme === theme.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Notificaciones</h4>
            <div className="space-y-3">
              {[
                { key: "email", label: "Notificaciones por email" },
                { key: "community_updates", label: "Actualizaciones de comunidades" },
                { key: "new_discussions", label: "Nuevas discusiones" },
                { key: "new_comments", label: "Nuevos comentarios" }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    {notification.label}
                  </label>
                  <Switch
                    checked={userPreferences.notifications[notification.key as keyof UserPreferences['notifications']]}
                    onCheckedChange={(checked) => 
                      setUserPreferences(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [notification.key]: checked
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Preferences */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Privacidad</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visibilidad del perfil
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "public", label: "Público" },
                    { value: "private", label: "Privado" }
                  ].map((visibility) => (
                    <button
                      key={visibility.value}
                      type="button"
                      onClick={() => setUserPreferences(prev => ({ 
                        ...prev, 
                        privacy: { 
                          ...prev.privacy, 
                          profile_visibility: visibility.value as "public" | "private" 
                        } 
                      }))}
                      className={`p-2 rounded-lg border text-sm transition-colors ${
                        userPreferences.privacy.profile_visibility === visibility.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {visibility.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrar email en el perfil
                </label>
                <Switch
                  checked={userPreferences.privacy.show_email}
                  onCheckedChange={(checked) => 
                    setUserPreferences(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        show_email: checked
                      }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Idioma</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "es", label: "Español" },
                { value: "en", label: "English" }
              ].map((language) => (
                <button
                  key={language.value}
                  type="button"
                  onClick={() => setUserPreferences(prev => ({ ...prev, language: language.value as UserPreferences['language'] }))}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    userPreferences.language === language.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Submit Button */}
      <onboardingForm.Subscribe>
        {({ isSubmitting }) => (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-lg"
          >
            {isSubmitting ? "Creando Perfil..." : "Completar Perfil"}
          </Button>
        )}
      </onboardingForm.Subscribe>
    </form>
  );
}
