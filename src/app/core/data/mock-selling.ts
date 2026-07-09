import { SellingStep } from '../models/selling';

export const MOCK_SELLING_STEPS: SellingStep[] = [
  {
    title: 'Describe the car',
    description: 'Enter year, make, model, mileage, condition, ZIP code, and loan status.',
  },
  {
    title: 'Review a mock offer',
    description: 'The valuation service combines demand, age, mileage, and condition into an estimate.',
  },
  {
    title: 'Save the draft',
    description: 'A mocked confirmation captures the next step without authentication or real data storage.',
  },
];
