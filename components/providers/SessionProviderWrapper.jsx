// components/providers/SessionProviderWrapper.jsx
"use client";

import { SessionProvider } from "next-auth/react";

/**
 * SessionProviderWrapper
 * - Đây là client component bọc SessionProvider của next-auth.
 * - Giữ file layout.js là Server Component để có thể export `metadata`.
 */
export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
