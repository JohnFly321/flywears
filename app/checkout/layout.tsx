import { cookies } from 'next/headers';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  // This forces Next.js to skip static generation for this folder
  // It prevents the "window is not defined" error during build
  cookies(); 
  return <>{children}</>;
}