import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ReactBidListHostComponent } from './react-bid-list-host.component';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('ReactBidListHostComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactBidListHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('mounts the React bid list inside Angular', async () => {
    const fixture = TestBed.createComponent(ReactBidListHostComponent);
    fixture.detectChanges();

    await waitForText(fixture.nativeElement, 'Track active mock vehicle bids.');

    expect(fixture.nativeElement.textContent).toContain('4 active bids');
    expect(fixture.nativeElement.textContent).toContain('RAV4 Hybrid XSE');
  });

  it('routes to the Angular vehicle detail page from the React callback', async () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(ReactBidListHostComponent);
    fixture.detectChanges();

    await waitForText(fixture.nativeElement, 'View details');

    const detailsButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('View details'));

    detailsButton?.click();

    expect(navigate).toHaveBeenCalledWith(['/buy', 'rav4-hybrid-xse-2024']);
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
