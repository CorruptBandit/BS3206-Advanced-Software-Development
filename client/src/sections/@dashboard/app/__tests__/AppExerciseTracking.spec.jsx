import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor, findByText} from '@testing-library/react';
import {useAuth} from '../../../../context/AuthContext';
import {AppExerciseTracking} from "../index";
import '@testing-library/jest-dom';

vi.mock('../../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));


describe('AppGoals Component', () => {
    beforeEach(() => {
        console.error = vi.fn();
        vi.clearAllMocks();
    });

    useAuth.mockImplementation(() => ({
        isLoggedIn: true, email: 'dave@gmail.com'
    }));

})