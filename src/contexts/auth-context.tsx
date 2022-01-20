import React, {ReactNode, useContext, useState} from 'react';
import { IUser } from '../interfaces';
import authService, { ICredential } from '../services/auth';
import { ErrorBoundaryFallback } from '../components/ErrorBoundaryFallback';
import { useAsync } from '../utils/useAsync';
import { Navigate, useLocation } from 'react-router';

const bootstrapUser = async () => {
  let user = null;
  const token = authService.getToken();
  if (token) {
    const data = await authService.getUser();
    user = data.user;
  }

  return user;
}

interface IAuthContextType {
  user: IUser | null;
  // signin: (credentials: ICredential) => void;
  signout: VoidFunction;
}

const AuthContext = React.createContext<IAuthContextType>(null!);
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [{ data, error }] = useAsync(bootstrapUser);
  // const location = useLocation()

  // let signin = (credentials: ICredential) => {
  //   authService.login(credentials)
  //     .then(res => {
  //       setUser(res.user);
  //     })
  // };

  // let signout = () => {
  //   authService.logout()
  //     .then(res => {
  //       setUser(null)
  //     });
  // };

  // if (data) {
  //   setUser(data)
  // }

  // if (error) {
  //   return <ErrorBoundaryFallback error={error} />;
  // }
  
  const value = {user}
  return (
    <AuthContext.Provider
      children={children}
      value={ value }
    />
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  // if (! context) {
  //   throw new Error("useAuth hook must be used with AuthProvider");
  // }
  return context;
}
