export interface BuyingGuide {
  id: string;
  title: string;
  summary: string;
  category: 'Budget' | 'Financing' | 'Inspection' | 'Ownership';
  readTimeMinutes: number;
  highlights: string[];
}

export interface LearningStep {
  title: string;
  description: string;
  action: string;
}

export interface PaymentEstimate {
  price: number;
  downPayment: number;
  apr: number;
  termMonths: number;
}
