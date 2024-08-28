import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResetPassword } from './index';
import userEvent from '@testing-library/user-event';
import axios from '../../axios';
import '@testing-library/jest-dom';

jest.mock('../../axios');

describe('ResetPassword Component', () => {
    const mockToken = 'mock-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        expect(
            screen.getByRole('heading', { name: /Reset Password/i })
        ).toBeInTheDocument();
        expect(screen.getByLabelText('New Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

        expect(
            screen.getByRole('button', { name: /Reset Password/i })
        ).toBeInTheDocument();
    });

    it('shows error message when passwords do not match', async () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('New Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: 'password456' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /Reset Password/i })
        );

        expect(
            await screen.findByText('Passwords do not match.')
        ).toBeInTheDocument();
    });

    it('handles successful password reset', async () => {
        axios.post.mockResolvedValueOnce({
            data: { message: 'Password reset successfully.' },
        });

        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('New Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Password reset successfully. Redirecting to login page...'
                )
            ).toBeInTheDocument();
        });
    });

    it('handles failed password reset', async () => {
        axios.post.mockRejectedValueOnce(
            new Error('Failed to reset password.')
        );

        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('New Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /Reset Password/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText('Failed to reset password.')
            ).toBeInTheDocument();
        });
    });

    it('toggles password visibility', () => {
        render(
            <MemoryRouter>
                <ResetPassword />
            </MemoryRouter>
        );

        const passwordInput = screen.getByLabelText(/New Password/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
        const toggleButton = screen.getByRole('button', {
            name: /Show password/i,
        });

        expect(passwordInput.type).toBe('password');
        expect(confirmPasswordInput.type).toBe('password');

        userEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');
        expect(confirmPasswordInput.type).toBe('text');

        userEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
        expect(confirmPasswordInput.type).toBe('password');
    });
});
