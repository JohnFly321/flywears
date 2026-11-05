"use client";

import dynamic from "next/dynamic";

const CheckoutUI = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-screen bg-gray-50 pt-24 text-center text-gray-600"
      role="status"
    >
      Loading checkout...
    </div>
  ),
});

export default function CheckoutNoSSR() {
  return <CheckoutUI />;
}
