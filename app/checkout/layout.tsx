// This forces Next.js to NOT pre-render the checkout page
// It prevents the "window is not defined" error
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}