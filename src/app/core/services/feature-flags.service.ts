import { computed, Injectable, signal } from '@angular/core';

interface AppFeatureFlags {
  bidListReactEnabled: boolean;
  legalReactEnabled: boolean;
}

const DEFAULT_FEATURE_FLAGS: AppFeatureFlags = {
  bidListReactEnabled: false,
  legalReactEnabled: true,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly flags = signal<AppFeatureFlags>(DEFAULT_FEATURE_FLAGS);

  readonly bidListReactEnabled = computed(() => this.flags().bidListReactEnabled);
  readonly legalReactEnabled = computed(() => this.flags().legalReactEnabled);

  setBidListReactEnabled(enabled: boolean): void {
    this.flags.update((current) => ({
      ...current,
      bidListReactEnabled: enabled,
    }));
  }

  setLegalReactEnabled(enabled: boolean): void {
    this.flags.update((current) => ({
      ...current,
      legalReactEnabled: enabled,
    }));
  }
}
