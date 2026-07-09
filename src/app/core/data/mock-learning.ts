import { BuyingGuide, LearningStep } from '../models/learning';

export const MOCK_BUYING_GUIDES: BuyingGuide[] = [
  {
    id: 'budget-like-a-buyer',
    title: 'Budget like a buyer, not a browser',
    summary:
      'Turn sticker price into a practical monthly target with taxes, fees, insurance, and maintenance included.',
    category: 'Budget',
    readTimeMinutes: 5,
    highlights: ['Total cost of ownership', 'Emergency buffer', 'Down payment strategy'],
  },
  {
    id: 'compare-financing',
    title: 'Compare financing offers without the fog',
    summary:
      'Understand APR, term length, loan-to-value, and why a lower payment can still cost more over time.',
    category: 'Financing',
    readTimeMinutes: 7,
    highlights: ['APR basics', 'Term tradeoffs', 'Preapproval checklist'],
  },
  {
    id: 'test-drive-playbook',
    title: 'A test drive playbook for real life',
    summary:
      'Use a repeatable route and checklist to evaluate comfort, tech, visibility, cargo space, and road noise.',
    category: 'Inspection',
    readTimeMinutes: 6,
    highlights: ['Cold start checks', 'Highway merge', 'Parking fit'],
  },
  {
    id: 'ev-readiness',
    title: 'Know whether an EV fits your week',
    summary:
      'Map your commute, charging access, weather swings, and road trips before you fall in love with range.',
    category: 'Ownership',
    readTimeMinutes: 4,
    highlights: ['Home charging', 'Winter range', 'Route planning'],
  },
];

export const MOCK_LEARNING_STEPS: LearningStep[] = [
  {
    title: 'Learn the numbers',
    description: 'Start with a payment range and ownership budget before comparing cars.',
    action: 'Use the estimator',
  },
  {
    title: 'Shortlist confidently',
    description: 'Filter inventory by body style, mileage, fuel type, and location fit.',
    action: 'Browse matching cars',
  },
  {
    title: 'Validate the details',
    description: 'Review history, features, and dealer notes before scheduling the next step.',
    action: 'Open a vehicle detail',
  },
];
