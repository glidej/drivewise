import { computed, Injectable, signal } from '@angular/core';

interface AppFeatureFlags {
  bidsReactEnabled: boolean;
  legalReactEnabled: boolean;
}

const DEFAULT_FEATURE_FLAGS: AppFeatureFlags = {
  bidsReactEnabled: true,
  legalReactEnabled: true,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly flags = signal<AppFeatureFlags>(DEFAULT_FEATURE_FLAGS);

  readonly legalReactEnabled = computed(() => this.flags().legalReactEnabled);
  readonly bidsReactEnabled = computed(() => this.flags().bidsReactEnabled);

  setBidsReactEnabled(enabled: boolean): void {
    this.flags.update((current) => ({ ...current, bidsReactEnabled: enabled }));
  }

  setLegalReactEnabled(enabled: boolean): void {
    this.flags.update((current) => ({
      ...current,
      legalReactEnabled: enabled,
    }));
  }
}
