import { AuthSession, RememberedAuthProfile } from './types';

export const AUTH_SESSION_STORAGE_KEY = 'drivewise.auth.session';
export const AUTH_PROFILE_STORAGE_KEY = 'drivewise.auth.rememberedProfile';
export const AUTH_STATE_EVENT = 'drivewise-auth-state-change';

export function readRememberedProfile(): RememberedAuthProfile | null {
  return readJson<RememberedAuthProfile>(localStorage, AUTH_PROFILE_STORAGE_KEY);
}

export function writeRememberedProfile(profile: RememberedAuthProfile): void {
  localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function clearRememberedProfile(): void {
  localStorage.removeItem(AUTH_PROFILE_STORAGE_KEY);
}

export function readAuthSession(): AuthSession | null {
  return readJson<AuthSession>(sessionStorage, AUTH_SESSION_STORAGE_KEY);
}

export function writeAuthSession(session: AuthSession): void {
  sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

function readJson<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    storage.removeItem(key);
    return null;
  }
}
