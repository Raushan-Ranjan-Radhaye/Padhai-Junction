"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
  // ye session ko d e tahi hai sab me
}

export default Provider;