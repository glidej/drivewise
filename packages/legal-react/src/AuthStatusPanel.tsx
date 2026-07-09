import {
  getAuthSnapshot,
  resumeMockSession,
  signInMockUser,
  signOutMockUser,
  subscribeAuthState,
} from '@drivewise/auth-state';
import { PrimaryButton, StatusPanel } from '@drivewise/react-ui';
import { useSyncExternalStore } from 'react';

export function AuthStatusPanel() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeAuthState(() => onStoreChange()),
    getAuthSnapshot,
    getAuthSnapshot,
  );

  if (snapshot.status === 'authenticated' && snapshot.user) {
    return (
      <StatusPanel
        eyebrow="Shared auth state"
        title={`Signed in as ${snapshot.user.name}`}
        ariaLabel="Synchronized mock authentication"
        actions={
          <PrimaryButton type="button" onClick={() => signOutMockUser()}>
            Sign out from React
          </PrimaryButton>
        }
      >
        <p>
          React is reading the same sessionStorage token and localStorage profile used by Angular.
        </p>
      </StatusPanel>
    );
  }

  if (snapshot.rememberedProfile) {
    return (
      <StatusPanel
        eyebrow="Shared auth state"
        title={`${snapshot.rememberedProfile.user.name} is remembered`}
        ariaLabel="Synchronized mock authentication"
        actions={
          <PrimaryButton type="button" onClick={() => resumeMockSession()}>
            Resume from React
          </PrimaryButton>
        }
      >
        <p>React can resume a mock session from the remembered localStorage profile.</p>
      </StatusPanel>
    );
  }

  return (
    <StatusPanel
      eyebrow="Shared auth state"
      title="Viewing legal pages anonymously"
      ariaLabel="Synchronized mock authentication"
      actions={
        <PrimaryButton type="button" onClick={() => signInMockUser({ rememberDevice: true })}>
          Sign in from React
        </PrimaryButton>
      }
    >
      <p>Sign in here to update Angular chrome and React content from the same auth store.</p>
    </StatusPanel>
  );
}
