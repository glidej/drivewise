import { computed, Injectable, signal } from '@angular/core';

interface AppFeatureFlags {
  legalReactEnabled: boolean;
}

const DEFAULT_FEATURE_FLAGS: AppFeatureFlags = {
  legalReactEnabled: true,
};

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly flags = signal<AppFeatureFlags>(DEFAULT_FEATURE_FLAGS);

  readonly legalReactEnabled = computed(() => this.flags().legalReactEnabled);

  setLegalReactEnabled(enabled: boolean): void {
    this.flags.update((current) => ({
      ...current,
      legalReactEnabled: enabled,
    }));
  }
}
