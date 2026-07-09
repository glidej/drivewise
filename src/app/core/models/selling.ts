export type VehicleCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs work';

export type LoanStatus = 'Owned outright' | 'Loan or lease' | 'Not sure';

export interface SellerVehicleInput {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: VehicleCondition;
  zipCode: string;
  loanStatus: LoanStatus;
}

export interface SellerOffer {
  referenceId: string;
  instantOffer: number;
  privatePartyRangeLow: number;
  privatePartyRangeHigh: number;
  demandScore: number;
  conditionAdjustment: number;
  nextSteps: string[];
}

export interface SellerLeadConfirmation {
  confirmationId: string;
  status: 'Draft saved';
  nextContactWindow: string;
}

export interface SellingStep {
  title: string;
  description: string;
}
