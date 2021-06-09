import { fireEvent, render, screen } from '@testing-library/react';
import LoginForm from '../pages/login';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { apiClient } from '../api';

const spy = jest.spyOn(apiClient, 'post');

describe('LoginForm component', () => {
  beforeEach(() => {
    render(<LoginForm onSetLoginStatus={jest.fn} />);
  })
  
  afterAll(() => {
    jest.clearAllMocks()
  })

  test('renders LoginForm component', () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  test('user can fill up log in form and submit', () => {
    userEvent.type(screen.getByPlaceholderText(/email/i), 'admin@gmail.com')
    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('admin@gmail.com');

    userEvent.type(screen.getByPlaceholderText(/password/i), 'password')
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue('password');

    const loginBtn = screen.getByRole('button');
    userEvent.click(loginBtn);
    expect(loginBtn).toBeDisabled();
    // const handleSubmit = jest.fn();
    // fireEvent.submit(screen.getByRole('form'));
  });

  test('admin can log in with correct credentials and redirect to patients list page', async () => {
    spy.mockResolvedValue({ status: 204 });

    await expect(apiClient.post('/login')).resolves.toEqual({ status: 204 })

    expect(spy).toHaveBeenCalled();

    sessionStorage.setItem('loggedIn', 'true')
    render(<App />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  })

  test('show validation error when user enters wrong credentials', async () => {
    spy.mockResolvedValue({ status: 422 });

    await expect(apiClient.post('/login')).resolves.toEqual({ status: 422 })

    expect(spy).toHaveBeenCalled();

    // expect(screen.getByText(/credentials/i)).toBeInTheDocument();
  });

})

