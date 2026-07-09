import { AuthUser } from '@drivewise/auth-state';

import { LegacyProfile } from './types';

const DEFAULT_PROFILE: LegacyProfile = {
  userId: 'user-taylor-brooks',
  displayName: 'Taylor Brooks',
  email: 'taylor.brooks@example.test',
  memberSince: '2024-03-18',
  loyaltyTier: 'Drivewise Plus',
  preferredDealer: 'Drivewise Detroit',
  garage: [
    {
      id: 'garage-rav4',
      year: 2021,
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      relationship: 'Owned',
      valueEstimate: 24750,
    },
    {
      id: 'garage-model-3',
      year: 2023,
      make: 'Tesla',
      model: 'Model 3 Long Range',
      relationship: 'Shopping',
      valueEstimate: 36400,
    },
  ],
  savedSearches: [
    {
      id: 'search-hybrid-suv',
      label: 'Hybrid SUVs under $40k',
      filters: 'SUV · Hybrid · under $40,000 · under 30,000 miles',
      newMatches: 4,
    },
    {
      id: 'search-ev-commuter',
      label: 'EV commuter cars',
      filters: 'Electric · sedan or hatchback · 250+ mile range',
      newMatches: 2,
    },
  ],
  activity: [
    {
      id: 'activity-offer',
      label: 'Reviewed a mock seller offer',
      happenedAt: '2026-07-08T14:20:00.000Z',
    },
    {
      id: 'activity-vehicle',
      label: 'Opened Honda Accord Touring details',
      happenedAt: '2026-07-07T19:45:00.000Z',
    },
    {
      id: 'activity-guide',
      label: 'Read Compare financing offers without the fog',
      happenedAt: '2026-07-06T16:10:00.000Z',
    },
  ],
  preferences: {
    marketArea: 'Metro Detroit',
    emailUpdates: true,
    smsAlerts: false,
    preferredContactWindow: 'Weekdays after 3 PM',
  },
};

export function getLegacyProfileForUser(user: AuthUser): LegacyProfile {
  return cloneProfile({
    ...DEFAULT_PROFILE,
    userId: user.id,
    displayName: user.name,
    email: user.email,
  });
}

export function getAnonymousProfilePreview(): Pick<LegacyProfile, 'garage' | 'savedSearches'> {
  return {
    garage: DEFAULT_PROFILE.garage.map((vehicle) => ({ ...vehicle })),
    savedSearches: DEFAULT_PROFILE.savedSearches.map((search) => ({ ...search })),
  };
}

function cloneProfile(profile: LegacyProfile): LegacyProfile {
  return {
    ...profile,
    garage: profile.garage.map((vehicle) => ({ ...vehicle })),
    savedSearches: profile.savedSearches.map((search) => ({ ...search })),
    activity: profile.activity.map((activity) => ({ ...activity })),
    preferences: { ...profile.preferences },
  };
}
