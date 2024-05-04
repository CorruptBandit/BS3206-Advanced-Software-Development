import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import SignIn from '../LoginPage';
import MD5 from 'crypto-js/md5';

// Mock the useAuth and react-router-dom hooks
// Mock the useAuth hook with conditional behavior
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn((email, passwordHash) => 
      email === "test@test.test" && passwordHash === MD5("Password1!").toString() ? Promise.resolve() : Promise.reject("Invalid credentials")
    ),
    register: vi.fn(() => Promise.resolve())
  })
}));


vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  const useNavigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => useNavigate // Return a function that returns the spy
  };
});

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockNavigate = useNavigate()

  it('Submitting login form with valid credentials navigates to dashboard', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: 'test@test.test' }});
    fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'Password1!' } });

    // Submit the form by clicking the sign in button
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    // Check if navigate was called with the correct path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it('Submitting login form with invalid credentials does not navigate to dashboard', async () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText('Email Address', { exact: false }), { target: { value: 'test@test.test' }});
    fireEvent.change(screen.getByLabelText('Password', { exact: false }), { target: { value: 'WrongPassword' } });

    await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check if navigate has still only been called once (from previous test)
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith("/");
    });
});
});