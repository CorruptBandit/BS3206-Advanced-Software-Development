import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SignIn from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '../../context/AuthContext'; // Ensure correct path

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(() => Promise.resolve()), // Mock login with no error
    register: vi.fn(() => Promise.resolve()) // Mock register with no error
  })
}));

describe('SignIn Component', () => {
  it('Submitting login form with valid credentials', async () => {
    // Wrap the SignIn component in BrowserRouter
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );


    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: 'test@example.com' }});
    fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByText('Sign In'));

    // Wait for the test to check the redirect or call expectations
    await waitFor(() => {
      // Check for navigation or other effects
    });
  });

  // Other tests can be added here
});
