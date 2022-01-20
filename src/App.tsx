import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorBoundaryFallback } from './components/ErrorBoundaryFallback';
import { useAuthContext } from './contexts/auth-context';
import Login from './pages/login';
import AuthenticatedApp from './AuthenticatedApp';

function App() {
  const { user }  = useAuthContext();

  return (
    <div className="px-40 py-5">
      <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
        { user ? <AuthenticatedApp /> : <Login /> }
      </ErrorBoundary>
    </div>
  );
}

export default App;
