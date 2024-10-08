'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from '../hooks/useSession';

const SessionContext = createContext<ReturnType<typeof useSession> | undefined>(
  undefined
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
