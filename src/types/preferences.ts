export interface UserPreferences {
  theme: "system" | "light" | "dark";
  notifications: {
    email: boolean;
    community_updates: boolean;
    new_discussions: boolean;
    new_comments: boolean;
  };
  privacy: {
    profile_visibility: "public" | "private";
    show_email: boolean;
  };
  language: "es" | "en";
}

export const defaultPreferences: UserPreferences = {
  theme: "system",
  notifications: {
    email: true,
    community_updates: true,
    new_discussions: false,
    new_comments: true
  },
  privacy: {
    profile_visibility: "public",
    show_email: false
  },
  language: "es"
};

export type PreferenceSection = keyof UserPreferences;
export type NotificationPreference = keyof UserPreferences['notifications'];
export type PrivacyPreference = keyof UserPreferences['privacy'];