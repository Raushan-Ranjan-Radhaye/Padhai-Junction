"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  );
}

export default StoreProvider;
