import { cleanup, render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  beforeEach(()=>{
    sessionStorage.clear();
  });

  afterAll(()=>{
    sessionStorage.clear();
    cleanup()
  });

  test('redirect to login route if user not logged in', () => {
    render(<App />);
    expect(screen.getByText(/patients crm login/i)).toBeInTheDocument();
  });

  test('redirect to patients list page if user logged in', () => {
    sessionStorage.setItem('loggedIn', 'true');

    render(<App />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
})

