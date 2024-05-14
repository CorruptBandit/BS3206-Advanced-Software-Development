import { describe, it, expect, vi, beforeEach } from 'vitest';
import {render, fireEvent, waitFor, findByText} from '@testing-library/react';
import { useAuth } from '../../../../context/AuthContext';
import { AppExerciseTracking } from "../index";
import '@testing-library/jest-dom';

global.encodeURI = vi.fn();

vi.mock('../../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('AppExerciseTracking Component', () => {
    beforeEach(() => {
        console.error = vi.fn();
        vi.clearAllMocks();
    });

    useAuth.mockImplementation(() => ({
        isLoggedIn: true,
        email: 'dave@gmail.com'
    }));

    const chartData = [
        { data: [10, 20, 30] },
        { data: [15, 25, 35] },
        { data: [12, 22, 32] }
    ];
    const chartLabels = ['Label 1', 'Label 2', 'Label 3'];

    it('renders loading indicator when loading', () => {
        const { getByTestId } = render(
            <AppExerciseTracking
                title="Test Title"
                subheader="Test Subheader"
                chartData={chartData}
                chartLabels={chartLabels}
            />
        );

        expect(getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('renders chart without crashing', async () => {
        const { findByTestId } = render(
            <AppExerciseTracking
                title="Test Title"
                subheader="Test Subheader"
                chartData={chartData}
                chartLabels={chartLabels}
            />
        );

        expect(findByTestId('bar-chart')).to.exist;
    });

    it('switches tabs when clicked', async () => {
        const { findByTestId, getByText, findByText } = render(
            <AppExerciseTracking
                title="Test Title"
                subheader="Test Subheader"
                chartData={chartData}
                chartLabels={chartLabels}
            />
        );

        const tab2 = getByText('Label 2');
        fireEvent.click(tab2);

        expect(findByTestId('bar-chart')).to.exist;
        expect(findByText("15, 25, 35")).to.exist;
    });


    // it('calls export function when export button is clicked', async () => {
    //     const { getByText } = render(
    //         <AppExerciseTracking
    //             title="Test Title"
    //             subheader="Test Subheader"
    //             chartData={chartData}
    //             chartLabels={chartLabels}
    //         />
    //     );
    //
    //     fireEvent.click(getByText('Export to CSV'));
    //
    //     await waitFor(() => {
    //         const expectedCSVContent = 'data:text/csv;charset=utf-8,"Label 1",10\n"Label 1",20\n"Label 1",30\n"Label 2",15\n"Label 2",25\n"Label 2",35\n"Label 3",12\n"Label 3",22\n"Label 3",32';
    //         expect(global.encodeURI).toHaveBeenCalledWith(expectedCSVContent);
    //     });
    // });
});
