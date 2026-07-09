import { TestBed } from '@angular/core/testing';

import { FeatureFlagsService } from './feature-flags.service';

describe('FeatureFlagsService', () => {
  let service: FeatureFlagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagsService);
  });

  it('enables React legal pages by default', () => {
    expect(service.legalReactEnabled()).toBe(true);
  });

  it('can toggle React legal pages for rollback paths', () => {
    service.setLegalReactEnabled(false);

    expect(service.legalReactEnabled()).toBe(false);
  });
});
