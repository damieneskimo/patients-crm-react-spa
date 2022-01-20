import React, { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { BrowserRouter } from 'react-router-dom';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  )
}
