import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor, findByText} from '@testing-library/react';
import {useAuth} from '../../../../context/AuthContext';
import {AppWorkoutHistoryTimeline} from "../index";
import '@testing-library/jest-dom';

vi.mock('../../../../context/AuthContext', () => ({
    useAuth: vi.fn()
}));


describe('AppWorkoutHistoryTimeline Component', () => {
    beforeEach(() => {
        console.error = vi.fn();
        vi.clearAllMocks();
    });

    useAuth.mockImplementation(() => ({
        isLoggedIn: true, email: 'dave@gmail.com'
    }));

    const mockList = [{id: 1, time: new Date('2024-05-12T09:00:00'), title: 'Workout 1'}, {
        id: 2, time: new Date('2024-05-11T08:00:00'), title: 'Workout 2'
    },];

    it('renders loading indicator when loading', () => {
        const {getByTestId} = render(<AppWorkoutHistoryTimeline list={[]}/>);
        expect(getByTestId('loading-indicator')).to.exist;
    });

    it('renders list of goals when loaded', async () => {
        const {findByText} = render(<AppWorkoutHistoryTimeline list={mockList}/>);
        await waitFor(() => {
            expect(findByText('Workout 1')).to.exist;
            expect(findByText('Workout 2')).to.exist;
        });
    });
})