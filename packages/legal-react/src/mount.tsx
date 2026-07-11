import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot, Root } from 'react-dom/client';

import { LegalDocumentPage } from './LegalDocumentPage';
import { LegalDocumentPageProps, LegalReactMount } from './types';

export function mountLegalDocument(
  container: HTMLElement,
  initialProps: LegalDocumentPageProps,
): LegalReactMount {
  const root = createRoot(container);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30_000,
      },
    },
  });

  function render(props: LegalDocumentPageProps): void {
    root.render(
      <QueryClientProvider client={queryClient}>
        <LegalDocumentPage {...props} />
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

export function renderLegalDocumentForTest(
  root: Root,
  queryClient: QueryClient,
  props: LegalDocumentPageProps,
): void {
  root.render(
    <QueryClientProvider client={queryClient}>
      <LegalDocumentPage {...props} />
    </QueryClientProvider>,
  );
}
