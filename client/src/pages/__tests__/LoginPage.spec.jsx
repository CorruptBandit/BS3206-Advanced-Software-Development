import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../LoginPage';
import * as AuthContext from '../../context/AuthContext'; // Ensure the correct path
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn((email, password) => email === "test@example.com" && password === "password123" ? Promise.resolve() : Promise.reject(new Error('Invalid credentials'))),
    register: vi.fn(() => Promise.resolve()) // Assume registration always succeeds for simplicity
  }),
  useNavigate: () => vi.fn() // Mock navigate to avoid errors during testing
}));

describe('SignIn Component', () => {
  it('Submitting login form with valid credentials', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: 'test@example.com' }});
    fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'password123' } });

    // Submit the form
    screen.getByRole('button', { name: 'Sign In' })  

    // Expectations for valid login
    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });

  // it('Submitting login form with invalid credentials', async () => {
  //   render(
  //     <BrowserRouter>
  //       <SignIn />
  //     </BrowserRouter>
  //   );

  //   // Fill out the form fields
  //   fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: 'wrong@example.com' }});
  //   fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'wrongpassword' } });

  //   // Submit the form
  //   fireEvent.click(screen.getByText('Sign In'));

  //   // Check for error message
  //   await waitFor(() => {
  //     expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  //   });
  // });

  // it('Multiple failed login attempts show contact admin message', async () => {
  //   render(
  //     <BrowserRouter>
  //       <SignIn />
  //     </BrowserRouter>
  //   );

  //   // Simulate three failed login attempts
  //   for (let i = 0; i < 3; i++) {
  //     fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: `wrong${i}@example.com` }});
  //     fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'wrongpassword' }});
  //     fireEvent.click(screen.getByText('Sign In'));

  //     await waitFor(() => {
  //       expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  //     });
  //   }

  //   // Check for the admin contact message
  //   expect(screen.getByText(/please contact the administrator/i)).toBeInTheDocument();
  // });

  // // Additional tests for registration and field validation could be added similarly
});
