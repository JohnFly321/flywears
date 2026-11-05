// This tells Next.js: DO NOT pre-render this page on the server.
// This completely prevents the "window is not defined" build error.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return <CheckoutClient />;
}