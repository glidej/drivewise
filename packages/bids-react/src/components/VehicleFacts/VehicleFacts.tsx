import { ReactNode } from 'react';

import { FactGrid } from './VehicleFacts.styles';

export interface VehicleFactItem {
  label: string;
  value: ReactNode;
}

export interface VehicleFactsProps {
  facts: readonly VehicleFactItem[];
  className?: string;
}

export function VehicleFacts({ facts, className }: VehicleFactsProps) {
  return (
    <FactGrid className={className}>
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </FactGrid>
  );
}
