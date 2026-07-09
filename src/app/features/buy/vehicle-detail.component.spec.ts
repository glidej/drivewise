import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VehicleDetailComponent } from './vehicle-detail.component';

describe('VehicleDetailComponent', () => {
  async function setup(id: string) {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id })),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(VehicleDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
  }

  it('renders a vehicle detail page for a valid inventory id', async () => {
    const compiled = await setup('model-3-long-range-2023');

    expect(compiled.textContent).toContain('Model 3 Long Range');
    expect(compiled.textContent).toContain('$36,400');
    expect(compiled.textContent).toContain('Glass roof');
    expect(compiled.textContent).toContain('Drivewise Detroit');
  });

  it('renders a not-found state for an unknown inventory id', async () => {
    const compiled = await setup('missing-car');

    expect(compiled.textContent).toContain('Vehicle not found');
    expect(compiled.textContent).toContain('Return to inventory');
  });
});
