// noinspection JSCheckFunctionSignatures

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {useAuth} from '../../../../context/AuthContext';
import {AppDietaryTracking} from "../index";
import '@testing-library/jest-dom';

global.encodeURI = vi.fn();

vi.mock('../../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));


describe('AppDietaryTracking Component', () => {
    beforeEach(() => {
        console.error = vi.fn();
        vi.clearAllMocks();
    });

    useAuth.mockImplementation(() => ({
        isLoggedIn: true, email: 'dave@gmail.com'
    }));

    const mockChartData = [{label: '2024-05-10', value: 60}, {label: '2024-05-11', value: 63},];

    it('renders without crashing', () => {
        const {container} = render(<AppDietaryTracking
            title="Dietary Tracking"
            subheader="Daily Intake"
            chartData={mockChartData}
        />);
        expect(container).toBeInTheDocument();
    });

    it('renders loading indicator when loading', () => {
        const {getByTestId} = render(<AppDietaryTracking
            title="Dietary Tracking"
            subheader="Daily Intake"
            chartData={mockChartData}
        />);
        expect(getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('calls export function when export button is clicked', async () => {
        const {getByText} = render(<AppDietaryTracking
            title="Dietary Tracking"
            subheader="Daily Intake"
            chartData={mockChartData}
        />);

        fireEvent.click(getByText('Export to CSV'));

        await waitFor(() => {
            const expectedCSVContent = 'data:text/csv;charset=utf-8,2024-05-10,60\n2024-05-11,63';
            expect(global.encodeURI).toHaveBeenCalledWith(expectedCSVContent);
        });
    });
})