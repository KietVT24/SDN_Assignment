// app/products/page.js
import dynamic from "next/dynamic";
import React from "react";

const ProductsClient = dynamic(() => import("@/components/ProductsClient"), { ssr: false });

export default function Page() {
  return <ProductsClient />;
}
