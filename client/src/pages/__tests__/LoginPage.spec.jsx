import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // To use jest-dom matchers
import SignIn from '../LoginPage'; // Import your component

describe('SignIn Component', () => {
  test('Submitting login form with valid credentials', async () => {
    const { getByLabelText, getByText } = render(<SignIn />);

    // Fill out the form fields
    fireEvent.change(getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(getByText('Sign In'));

    // Wait for redirection or success message
    await waitFor(() => {
      expect(window.location.pathname).toBe('/'); // Check if redirected to homepage
      // You can also check for success message if any
    });
  });

  test('Toggling between Sign In and Register form', () => {
    const { getByText, getByLabelText } = render(<SignIn />);

    // Initially, should show Sign In form
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Sign In')).toBeInTheDocument();
    
    // Click on "Don't have an account? Register"
    fireEvent.click(getByText("Don't have an account? Register"));

    // Now, should show Register form
    expect(getByLabelText('Full Name')).toBeInTheDocument();
    expect(getByLabelText('Email Address')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
  });
});
