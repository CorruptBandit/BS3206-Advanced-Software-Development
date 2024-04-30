import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';

// Mocks
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useNavigate: () => mockNavigate,
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockLogin.mockClear();
    mockRegister.mockClear();
    mockNavigate.mockClear();
  });

  test('register a new user', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Switch to registration view
    const toggleButton = screen.getByRole('button', { name: /don't have an account\? register/i });
    userEvent.click(toggleButton);

    // Fill out the registration form
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInput, 'securepassword123');

    // Submit the form
    fireEvent.submit(registerButton);

    // Expect the register function to be called
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('John Doe', 'john@example.com', expect.any(String));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Additional tests for login and other functionalities can be added here
});
