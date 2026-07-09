export interface ProfileVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  relationship: 'Owned' | 'Shopping' | 'Selling';
  valueEstimate: number;
}

export interface SavedSearch {
  id: string;
  label: string;
  filters: string;
  newMatches: number;
}

export interface ProfileActivity {
  id: string;
  label: string;
  happenedAt: string;
}

export interface ProfilePreferences {
  marketArea: string;
  emailUpdates: boolean;
  smsAlerts: boolean;
  preferredContactWindow: string;
}

export interface LegacyProfile {
  userId: string;
  displayName: string;
  email: string;
  memberSince: string;
  loyaltyTier: string;
  preferredDealer: string;
  garage: ProfileVehicle[];
  savedSearches: SavedSearch[];
  activity: ProfileActivity[];
  preferences: ProfilePreferences;
}
