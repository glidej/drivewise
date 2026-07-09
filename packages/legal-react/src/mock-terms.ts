import { LegalDocument } from './types';

const sharedLorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae ipsum sed justo efficitur facilisis. Donec sed lectus nec neque porta dignissim.';

const secondaryLorem =
  'Suspendisse potenti. Praesent non risus vitae mi porttitor tincidunt. Curabitur gravida, magna nec luctus pharetra, turpis justo vulputate mi, at egestas lorem ante vitae est.';

const TERMS_DOCUMENT: LegalDocument = {
  id: 'terms',
  title: 'Terms of Service',
  eyebrow: 'React Query demo legal structure',
  summary:
    'Placeholder terms page fetched by the legal-react package with React Query and lorem ipsum body copy.',
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
};

export async function fetchTermsDocument(): Promise<LegalDocument> {
  return cloneDocument(TERMS_DOCUMENT);
}

function cloneDocument(document: LegalDocument): LegalDocument {
  return {
    ...document,
    sections: document.sections.map((section) => ({
      ...section,
      body: [...section.body],
    })),
  };
}
