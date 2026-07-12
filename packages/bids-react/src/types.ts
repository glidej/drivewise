export interface BidListPageProps {
  onViewVehicle(vehicleId: string): void;
}

export interface BidsReactMount {
  update(props: BidListPageProps): void;
  unmount(): void;
}
