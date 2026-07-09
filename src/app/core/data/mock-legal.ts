import { LegalDocument } from '../models/legal';

const sharedLorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae ipsum sed justo efficitur facilisis. Donec sed lectus nec neque porta dignissim.';

const secondaryLorem =
  'Suspendisse potenti. Praesent non risus vitae mi porttitor tincidunt. Curabitur gravida, magna nec luctus pharetra, turpis justo vulputate mi, at egestas lorem ante vitae est.';

export const MOCK_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    eyebrow: 'Demo legal structure',
    summary:
      'Placeholder terms page using realistic document structure and lorem ipsum body copy for demo purposes.',
    effectiveDate: '2026-07-09',
    lastUpdated: '2026-07-09',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Marketplace Information',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Vehicle Listings and Offers',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'User Responsibilities',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Limitations and Disclaimers',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Contact and Notices',
        body: [sharedLorem, secondaryLorem],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'Demo privacy structure',
    summary:
      'Placeholder privacy page using realistic policy sections and lorem ipsum body copy for demo purposes.',
    effectiveDate: '2026-07-09',
    lastUpdated: '2026-07-09',
    sections: [
      {
        heading: 'Information We Collect',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'How Information Is Used',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Mock Data and Demonstration Records',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Sharing and Service Providers',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Choices and Controls',
        body: [sharedLorem, secondaryLorem],
      },
      {
        heading: 'Retention and Contact',
        body: [sharedLorem, secondaryLorem],
      },
    ],
  },
];
