"use client";

import React, { createContext, useContext, ReactNode } from "react";

const DonationModalContext = createContext<{
  open: () => void;
  close: () => void;
} | null>(null);

export function useDonationModal() {
  const ctx = useContext(DonationModalContext);
  if (!ctx) throw new Error("useDonationModal must be used within DonationModalProvider");
  return ctx;
}

export function DonationModalProvider({ children }: { children: ReactNode }) {
  const openDonationPage = () => {
    window.open("https://hcb.hackclub.com/donations/start/hands-of-hope", "_blank", "noopener,noreferrer");
  };

  return (
    <DonationModalContext.Provider value={{
      open: openDonationPage,
      close: () => {},
    }}>
      {children}
    </DonationModalContext.Provider>
  );
}
