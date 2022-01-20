import { fireEvent, render, screen } from '@testing-library/react';
import Login from './index';
import App from '../../App';
import userEvent from '@testing-library/user-event';

// const spy = jest.spyOn(apiClient, 'post');

describe('LoginForm component', () => {
  beforeEach(() => {
    // render(<LoginForm onSetLoginStatus={jest.fn} />);
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
})
