"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const openDonationPage = () => {
    router.push("/donate");
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
