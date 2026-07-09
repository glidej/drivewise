import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { LegalPageHostComponent } from './legal-page-host.component';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('LegalPageHostComponent', () => {
  it('renders terms through the React microfrontend when the flag is enabled', async () => {
    const compiled = await setup('terms', true);

    await waitForText(compiled, 'Terms data fetched inside legal-react');

    expect(compiled.textContent).toContain('Terms of Service');
  });

  it('injects Angular privacy data into the React microfrontend', async () => {
    const compiled = await setup('privacy', true);

    await waitForText(compiled, 'Privacy data supplied by Angular');

    expect(compiled.textContent).toContain('Privacy Policy');
    expect(compiled.textContent).toContain('Information We Collect');
  });

  it('renders the Angular legal page when the React flag is disabled', async () => {
    const compiled = await setup('terms', false);

    expect(compiled.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Demo legal structure');
    expect(compiled.textContent).not.toContain('Terms data fetched inside legal-react');
  });
});

async function setup(documentId: 'terms' | 'privacy', reactEnabled: boolean): Promise<HTMLElement> {
  await TestBed.configureTestingModule({
    imports: [LegalPageHostComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          data: of({ documentId }),
        },
      },
      {
        provide: FeatureFlagsService,
        useValue: {
          legalReactEnabled: signal(reactEnabled),
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(LegalPageHostComponent);
  fixture.detectChanges();
  await fixture.whenStable();

  return fixture.nativeElement as HTMLElement;
}

async function waitForText(element: HTMLElement, text: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (element.textContent?.includes(text)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  throw new Error(`Timed out waiting for "${text}"`);
}
