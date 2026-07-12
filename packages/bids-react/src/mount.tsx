import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BidListPage } from './BidListPage';
import type { BidListPageProps, BidsReactMount } from './types';

export function mountBidList(container: HTMLElement, initialProps: BidListPageProps): BidsReactMount {
  const root = createRoot(container);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } });
  const render = (props: BidListPageProps) => root.render(<QueryClientProvider client={queryClient}><BidListPage {...props} /></QueryClientProvider>);
  render(initialProps);
  return { update: render, unmount() { root.unmount(); queryClient.clear(); } };
}
