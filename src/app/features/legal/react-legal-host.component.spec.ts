import { TestBed } from '@angular/core/testing';

import { ReactLegalHostComponent } from './react-legal-host.component';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ReactLegalHostComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactLegalHostComponent],
    }).compileComponents();
  });

  it('mounts the React legal page inside Angular', async () => {
    const fixture = TestBed.createComponent(ReactLegalHostComponent);
    fixture.componentRef.setInput('documentId', 'terms');
    fixture.detectChanges();

    await waitForText(fixture.nativeElement, 'Terms data fetched inside legal-react');

    expect(fixture.nativeElement.textContent).toContain('Terms of Service');
  });

  it('updates the React legal page when Angular inputs change', async () => {
    const fixture = TestBed.createComponent(ReactLegalHostComponent);
    fixture.componentRef.setInput('documentId', 'terms');
    fixture.detectChanges();
    await waitForText(fixture.nativeElement, 'Terms of Service');

    fixture.componentRef.setInput('documentId', 'privacy');
    fixture.componentRef.setInput('privacyDocument', {
      id: 'privacy',
      title: 'Privacy Policy',
      eyebrow: 'Injected by Angular',
      summary: 'Lorem ipsum privacy summary.',
      effectiveDate: '2026-07-09',
      lastUpdated: '2026-07-09',
      sections: [{ heading: 'Information We Collect', body: ['Lorem ipsum dolor sit amet.'] }],
    });
    fixture.detectChanges();

    await waitForText(fixture.nativeElement, 'Injected by Angular');

    expect(fixture.nativeElement.textContent).toContain('Privacy data supplied by Angular');
  });
});

async function waitForText(element: HTMLElement, text: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (element.textContent?.includes(text)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  throw new Error(`Timed out waiting for "${text}"`);
}
