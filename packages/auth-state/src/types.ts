export type AuthStatus = 'anonymous' | 'authenticated';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Buyer' | 'Seller' | 'Admin';
  preferredDealerId: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  issuedAt: string;
  expiresAt: string;
  lastSeenAt: string;
}

export interface RememberedAuthProfile {
  user: AuthUser;
  rememberDevice: boolean;
  lastAuthenticatedAt: string;
}

export interface AuthSnapshot {
  status: AuthStatus;
  user: AuthUser | null;
  rememberedProfile: RememberedAuthProfile | null;
  session: AuthSession | null;
}

export interface SignInOptions {
  rememberDevice?: boolean;
  user?: AuthUser;
}

export type AuthSubscriber = (snapshot: AuthSnapshot) => void;

export type AuthUnsubscribe = () => void;
