"use client";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormInput } from "./form-components/form-input";
import FormSelect from "./form-components/form-select";
import FormFileInput from "./form-components/form-file-input";
import { X } from "lucide-react";
import { useState, ChangeEvent } from "react";
import FormTextarea from "./form-components/form-textarea";
import FormPhoneInput from "./form-components/form-phone-input";

interface OnboardingFormProps {
  user: User;
}

const socialTypes = [
  { type: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourprofile" },
  { type: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourprofile" },
  { type: "kakao", label: "Kakao", placeholder: "https://open.kakao.com/yourprofile" },
  { type: "twitter", label: "Twitter", placeholder: "https://twitter.com/yourprofile" },
];

const availableInterests = [
  "Hiking",
  "Photography",
  "Travel",
  "Food",
  "Culture",
  "Nature",
  "Adventure",
  "Art",
  "Music",
  "Sports",
  "Technology",
  "History",
  "Shopping",
  "Nightlife",
];

const countryOptions = [
  { value: "KR", label: "South Korea" },
  { value: "US", label: "United States" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
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

export default function OnboardingForm({ user }: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<Array<{ type: string; url: string }>>([]);
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
      const avatarBlob = dataURLtoBlob(value.avatar_url);
      let avatarPath;
      //stores the avatar image on the avatars bucket and gets the path
      const { data: avatarUrl, error: avartUploadError } = await supabase.storage
        .from("user_avatars")
        .upload(`${user.id}.png`, avatarBlob, {
          cacheControl: "3600",
          upsert: true,
        });
      if (avartUploadError) {
        throw new Error(avartUploadError.message);
      } else {
        const { data } = supabase.storage.from("user_avatars").getPublicUrl(avatarUrl.path);
        avatarPath = data.publicUrl;
      }

      const profileData = {
        id: user.id,
        username: value.username,
        full_name: value.full_name,
        avatar_url: avatarPath,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        phone_number: value.phone_number,
        email: user.email,
        country_code: value.country_code,
        interests: selectedInterests,
        bio: value.bio,
        city: value.location.city,
        country: value.location.country,
        social_links: socialLinks,
        preferences: value.preferences,
        last_active: new Date().toISOString(),
      };

      // updates user profile
      const { error: updateUserProfileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });

      if (updateUserProfileError) {
        throw new Error(updateUserProfileError.message);
      } else {
        router.push("/profile");
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onboardingForm.handleSubmit();
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
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
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Tell us a bit about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <onboardingForm.Field name="avatar_url">
              {(field: AnyFieldApi) => (
                <FormFileInput
                  label="Avatar"
                  id={field.name}
                  name={field.name}
                  src={field.state.value}
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
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <onboardingForm.Field name="username">
                {(field: AnyFieldApi) => (
                  <FormInput
                    field={field}
                    label="Username"
                    name={field.name}
                    type="text"
                    placeholder="johndoe"
                    value={field.state.value}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value)}
                  />
                )}
              </onboardingForm.Field>

              <onboardingForm.Field name="full_name">
                {(field: AnyFieldApi) => (
                  <FormInput
                    field={field}
                    label="Full Name"
                    name={field.name}
                    type="text"
                    placeholder="John Doe"
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
                    label="Phone Number"
                    name={field.name}
                    placeholder="Enter your phone number"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value || "")}
                  />
                )}
              </onboardingForm.Field>

              <onboardingForm.Field name="country_code">
                {(field: AnyFieldApi) => (
                  <FormSelect
                    field={field}
                    label="Country"
                    value={field.state.value}
                    placeholder="Select your country"
                    options={countryOptions}
                    onValueChange={(value) => field.handleChange(value)}
                  />
                )}
              </onboardingForm.Field>
            </div>

            <onboardingForm.Field name="bio">
              {(field: AnyFieldApi) => (
                <FormTextarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={field.state.value}
                  name={field.name}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={4}
                />
              )}
            </onboardingForm.Field>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <onboardingForm.Field name="location">
                {(field: AnyFieldApi) => (
                  <>
                    <FormInput
                      field={field}
                      label="City"
                      name="city"
                      type="text"
                      placeholder="Seoul"
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
                      label="Country"
                      name="country"
                      type="text"
                      placeholder="South Korea"
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
            <CardTitle>Interests</CardTitle>
            <p className="text-sm text-gray-600">Select your interests to help us personalize your experience</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${selectedInterests.includes(interest) ? "bg-emerald-500 hover:bg-emerald-600" : "hover:bg-emerald-50"
                    }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <p className="text-sm text-gray-600">Connect your social media profiles (optional)</p>
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

        {/* Submit Button */}
        <onboardingForm.Subscribe>
          {({ isSubmitting }) => (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-lg"
            >
              {isSubmitting ? "Creating Profile..." : "Complete Profile"}
            </Button>
          )}
        </onboardingForm.Subscribe>
      </form>
    </div>
  );
}
