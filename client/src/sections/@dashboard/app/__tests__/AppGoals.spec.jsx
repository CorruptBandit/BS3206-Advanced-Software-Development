// noinspection JSCheckFunctionSignatures

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, fireEvent, waitFor, findByText} from '@testing-library/react';
import {useAuth} from '../../../../context/AuthContext';
import {AppGoals} from "../index";
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

    const mockList = [{id: '1', goalName: 'Goal 1', achieveByDate: '2024-06-01'}, {
        id: '2', goalName: 'Goal 2', achieveByDate: '2024-06-15'
    }];

    it('renders loading indicator when loading', () => {
        const {getByTestId} = render(<AppGoals list={[]}/>);
        expect(getByTestId('loading-indicator')).to.exist;
    });

    it('renders without crashing', () => {
        const {container} = render(<AppGoals list={mockList}/>);
        expect(container).toBeInTheDocument();
    });

    it('renders list of goals when loaded', async () => {
        const {findByText} = render(<AppGoals list={mockList}/>);
        await waitFor(() => {
            expect(findByText('Goal 1')).to.exist;
            expect(findByText('Goal 2')).to.exist;
        });
    });

    it('opens dialog when "Add Goal" button is clicked', async () => {
        const {findByTestId, getByLabelText} = render(<AppGoals list={mockList}/>);
        const addButton = await findByTestId('add-goal-button');
        fireEvent.click(addButton);
        expect(getByLabelText('Goal Name')).toBeInTheDocument();
        expect(getByLabelText('Date to be achieved by')).toBeInTheDocument();
    });

    it('adds a goal when the "Add Goal" button is clicked', async () => {
        const mockList = [{id: '1', label: 'Goal 1', achieveByDate: '2024-06-01'}];
        const {findByTestId, findByText, queryByText, queryByLabelText} = render(<AppGoals list={mockList}/>);

        const addButton = await findByTestId('add-goal-button');
        fireEvent.click(addButton);

        const goalNameInput = queryByLabelText('Goal Name');
        const achieveByDateInput = queryByLabelText('Date to be achieved by');

        fireEvent.change(goalNameInput, {target: {value: 'New Goal'}});
        fireEvent.change(achieveByDateInput, {target: {value: '2024-06-30'}});

        const addButtonInDialog = queryByText('Add');
        fireEvent.click(addButtonInDialog);

        await waitFor(() => {
            expect(findByText('New Goal')).to.exist;
            expect(findByText('2024-06-30')).to.exist;
        });
    });
})
