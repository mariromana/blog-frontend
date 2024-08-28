import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ForgotPassword } from './index';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

jest.mock('../../axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('ForgotPassword component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form elements correctly', () => {
        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        expect(screen.getByText(/Your email/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /We’ll send you an email with a link to reset your password./i
            )
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Reset/i })
        ).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'invalid-email' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

        await waitFor(() =>
            expect(
                screen.getByText(/Invalid email format/i)
            ).toBeInTheDocument()
        );
    });

    it('navigates to login page on successful form submission', async () => {
        axios.post.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('shows user not found message on server error', async () => {
        axios.post.mockRejectedValueOnce(new Error('User not found'));

        render(
            <MemoryRouter>
                <ForgotPassword />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

        await waitFor(() =>
            expect(
                screen.getByText(/User with this email not found/i)
            ).toBeInTheDocument()
        );
    });
});
