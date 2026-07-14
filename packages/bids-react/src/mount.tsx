import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot, Root } from 'react-dom/client';

import { BidListPage } from './components/BidListPage';
import { BidListPageProps, BidListReactMount } from './types';

export function mountBidList(
  container: HTMLElement,
  initialProps: BidListPageProps,
): BidListReactMount {
  const root = createRoot(container);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
      },
    },
  });

  function render(props: BidListPageProps): void {
    root.render(
      <QueryClientProvider client={queryClient}>
        <BidListPage {...props} />
      </QueryClientProvider>,
    );
  }

  render(initialProps);

  return {
    update: render,
    unmount(): void {
      root.unmount();
      queryClient.clear();
    },
  };
}

export function renderBidListForTest(
  root: Root,
  queryClient: QueryClient,
  props: BidListPageProps,
): void {
  root.render(
    <QueryClientProvider client={queryClient}>
      <BidListPage {...props} />
    </QueryClientProvider>,
  );
}
