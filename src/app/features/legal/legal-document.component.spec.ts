import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LegalDocumentComponent } from './legal-document.component';

describe('LegalDocumentComponent', () => {
  async function setup(documentId: 'terms' | 'privacy' | 'missing') {
    await TestBed.configureTestingModule({
      imports: [LegalDocumentComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ documentId }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LegalDocumentComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  it('renders a realistic terms page with lorem ipsum placeholder content', async () => {
    const compiled = await setup('terms');

    expect(compiled.querySelector('h1')?.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Acceptance of Terms');
    expect(compiled.textContent).toContain('Lorem ipsum dolor sit amet');
    expect(compiled.textContent).toContain('Placeholder content');
  });

  it('renders a realistic privacy page with lorem ipsum placeholder content', async () => {
    const compiled = await setup('privacy');

    expect(compiled.querySelector('h1')?.textContent).toContain('Privacy Policy');
    expect(compiled.textContent).toContain('Information We Collect');
    expect(compiled.textContent).toContain('Mock Data and Demonstration Records');
    expect(compiled.textContent).toContain('lorem ipsum body copy');
  });

  it('renders a missing state for unknown document ids', async () => {
    const compiled = await setup('missing');

    expect(compiled.textContent).toContain('Document not found');
    expect(compiled.textContent).toContain('Back home');
  });
});
