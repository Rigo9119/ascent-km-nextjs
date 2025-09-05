"use client";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormInput from "./form-components/form-input";
import FormFileInput from "./form-components/form-file-input";
import { X } from "lucide-react";
import { useState, ChangeEvent } from "react";
import FormTextarea from "./form-components/form-textarea";
import FormPhoneInput from "./form-components/form-phone-input";
import { toast } from "sonner";

export type Preference = {
  id: string;
  name?: string | undefined;
  description: string | null;
};

export type Interest = {
  id: string;
  name: string;
  description: string | null;
};

interface OnboardingFormProps {
  user: User;
  preferenceTypes: Preference[];
  interestsTypes: Interest[];
}

const socialTypes = [
  { type: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourprofile" },
  { type: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourprofile" },
  { type: "kakao", label: "Kakao", placeholder: "https://open.kakao.com/yourprofile" },
  { type: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourprofile" },
];

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

export default function OnboardingForm({ user, preferenceTypes, interestsTypes }: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<Array<{ type: string; url: string }>>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>("");
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
      social_links: [],
      preferences: [],
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
          interests: selectedInterests,
          bio: value.bio,
          city: value.location.city,
          country: value.location.country,
          social_links: socialLinks,
          preferences: selectedPreferences,
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

  const toggleInterest = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest.id) ? prev.filter((id) => id !== interest.id) : [...prev, interest.id],
    );
  };

  const togglePreference = (preference: Preference) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference.id) ? prev.filter((id) => id !== preference.id) : [...prev, preference.id],
    );
  };

  const addSocialLink = (type: string, url: string) => {
    if (url.trim()) {
      setSocialLinks((prev) => [...prev.filter((link) => link.type !== type), { type, url: url.trim() }]);
    }
  };

  const removeSocialLink = (type: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.type !== type));
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
              <FormFileInput
                field={field}
                label="Avatar"
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

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Intereses</CardTitle>
          <p className="text-sm text-gray-600">Selecciona tus intereses para ayudarnos a personalizar tu experiencia</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interestsTypes.map((interest: Interest, index: number) => (
              <Badge
                key={index}
                variant={selectedInterests.includes(interest.id) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${selectedInterests.includes(interest.id)
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "hover:bg-emerald-50"
                  }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest.description}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <p className="text-sm text-gray-600">Conecta tus perfiles de redes sociales (opcional)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialTypes.map((social) => {
            const existingLink = socialLinks.find((link) => link.type === social.type);
            return (
              <div key={social.type} className="flex items-center gap-2">
                <div className="flex-1">
                  <FormInput
                    field={{} as AnyFieldApi}
                    label={social.label}
                    name={social.type}
                    type="url"
                    placeholder={social.placeholder}
                    value={existingLink?.url || ""}
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        addSocialLink(social.type, e.target.value);
                      } else {
                        removeSocialLink(social.type);
                      }
                    }}
                  />
                </div>
                {existingLink && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocialLink(social.type)}
                    className="mt-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <p className="text-sm text-gray-600">Selecciona tus preferencias para personalizar tu experiencia</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {preferenceTypes.map((preference) => (
              <Badge
                key={preference.id}
                variant={selectedPreferences.includes(preference.id) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${selectedPreferences.includes(preference.id)
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "hover:bg-emerald-50"
                  }`}
                onClick={() => togglePreference(preference)}
              >
                {preference.description}
              </Badge>
            ))}
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
