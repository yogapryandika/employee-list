import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { useState } from 'react';
import AutoComplete from './index';

vi.mock('axios');

describe('AsyncAutocomplete', () => {
    const mockFetchUrl = 'http://localhost:4001/departments?name_like=';
    const mockSuggestions = [
        { id: '1', name: 'Engineering' },
        { id: '2', name: 'Sales' },
        { id: '3', name: 'Marketing' },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const TestWrapper = () => {
        const [val, setVal] = useState('');
        return (
            <AutoComplete
                label="Department"
                value={val}
                onChange={setVal}
                fetchUrl={mockFetchUrl}
            />
        );
    };

    it('renders input field with label', () => {
        render(<TestWrapper />);

        expect(screen.getByText('Department')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('fetches and displays suggestions on input change', async () => {
        const user = userEvent.setup({ delay: null });

        (axios.get as any).mockResolvedValue({
            data: mockSuggestions,
        });

        render(<TestWrapper />);

        const input = screen.getByRole('textbox');

        await user.type(input, 'Eng');
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('Eng')
            );
        }, { timeout: 1000 });

        await waitFor(() => {
            expect(screen.getByText('Engineering')).toBeInTheDocument();
        });
    });

    it('calls onChange when suggestion is selected', async () => {
        const user = userEvent.setup({ delay: null });

        (axios.get as any).mockResolvedValue({
            data: mockSuggestions,
        });

        render(<TestWrapper />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Eng');

        await waitFor(() => {
            expect(screen.getByText('Engineering')).toBeInTheDocument();
        }, { timeout: 1000 });

        const suggestion = screen.getByText('Engineering');
        await user.click(suggestion);

        expect(input).toHaveValue('Engineering');
    });
});
