export const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

export const numberFormatter = new Intl.NumberFormat('en-US');

export const bidExpirationFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  month: 'short',
});

export const bidPlacedFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
});
