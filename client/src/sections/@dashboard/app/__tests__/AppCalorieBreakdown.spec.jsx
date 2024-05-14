import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor} from '@testing-library/react';
import {useAuth} from '../../../../context/AuthContext';
import {AppCalorieBreakdown} from "../index";
import '@testing-library/jest-dom';

global.encodeURI = vi.fn();

vi.mock('../../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));

describe('AppCalorieBreakdown Component', () => {
    beforeEach(() => {
        console.error = vi.fn();
        vi.clearAllMocks();
    });

    useAuth.mockImplementation(() => ({
        isLoggedIn: true, email: 'dave@gmail.com'
    }));

    const chartData = [{label: 'Breakfast', value: 400}, {label: 'Lunch', value: 300}, {label: 'Dinner', value: 700}];

    it('renders loading indicator when loading', () => {
        const {getByTestId} = render(<AppCalorieBreakdown chartData={chartData}/>);
        expect(getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('renders without crashing', () => {
        const {container} = render(<AppCalorieBreakdown chartData={chartData}/>);
        expect(container).toBeInTheDocument();
    });

    it('calls export function when export button is clicked', async () => {
        const {getByText} = render(<AppCalorieBreakdown chartData={chartData}/>);

        fireEvent.click(getByText('Export to CSV'));

        await waitFor(() => {
            const expectedCSVContent = 'data:text/csv;charset=utf-8,"Breakfast",400\n"Lunch",300\n"Dinner",700';
            expect(global.encodeURI).toHaveBeenCalledWith(expectedCSVContent);
        });
    });
});

