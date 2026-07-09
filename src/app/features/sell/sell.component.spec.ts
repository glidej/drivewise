import { TestBed } from '@angular/core/testing';

import { SellComponent } from './sell.component';

describe('SellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellComponent],
    }).compileComponents();
  });

  it('renders the seller workflow and mocked guidance steps', async () => {
    const fixture = TestBed.createComponent(SellComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('mock seller offer');
    expect(compiled.textContent).toContain('Describe the car');
    expect(compiled.textContent).toContain('Calculate mock offer');
  });

  it('calculates and saves a mock seller offer', async () => {
    const fixture = TestBed.createComponent(SellComponent);
    const component = fixture.componentInstance as unknown as {
      calculateOffer: () => void;
      submitLead: () => void;
    };

    component.calculateOffer();
    fixture.detectChanges();
    await fixture.whenStable();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mock offer');
    expect(compiled.textContent).toContain('Save mock offer');
    expect(compiled.textContent).toContain('DW-SELL-2022-toyota-rav4-36000');

    component.submitLead();
    fixture.detectChanges();
    await fixture.whenStable();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Draft saved');
    expect(compiled.textContent).toContain('Today 2 PM - 5 PM');
  });
});
