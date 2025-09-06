export type Notifications = {
  email: boolean;
  community_updates: boolean;
  new_discussions: boolean;
  new_comments: boolean;
}

export type Privacy = {
  profile_visibility: "public" | "private";
  show_email: boolean;
}

export interface UserPreferences {
  theme: "system" | "light" | "dark";
  notifications: Notifications;
  privacy: Privacy;
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

export type UserPreferencesUpdate = {
  theme?: UserPreferences['theme'];
  notifications?: Partial<Notifications>;
  privacy?: Partial<Privacy>;
  language?: UserPreferences['language'];
};
