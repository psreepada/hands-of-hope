"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <DonationModalContext.Provider value={{
      open: () => setOpen(true),
      close: () => setOpen(false),
    }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col items-center">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl font-bold rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
              style={{ minWidth: 48, minHeight: 48 }}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <iframe
              src="https://hcb.hackclub.com/donations/start/hands-of-hope"
              style={{ border: 'none' }}
              name="donateFrame"
              scrolling="yes"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              height="512px"
              width="512px"
              allowFullScreen
              title="Donate to Hands of Hope"
            ></iframe>
          </div>
        </div>
      )}
    </DonationModalContext.Provider>
  );
}
