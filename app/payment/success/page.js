// app/payment/success/page.js
import dynamic from "next/dynamic";
import React from "react";

const PaymentSuccessClient = dynamic(() => import("@/components/PaymentSuccessClient"), { ssr: false });

export default function Page() {
  return <PaymentSuccessClient />;
}
