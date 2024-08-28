import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './index';
import '@testing-library/jest-dom';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { buffer } from 'stream/consumers';

jest.mock('../../axios');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe('Login page', () => {
    let store;
    beforeEach(() => {
        store = mockStore({
            auth: {
                data: null,
                isAuth: false,
            },
        });

        store.dispatch = jest.fn();
    });
    it('renders form elements correctly', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        const loginButton = await screen.findByRole('heading', { level: 5 });
        expect(loginButton).toHaveTextContent(/Log in/i);

        const emailInput = await screen.getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();

        const passwordInput = await screen.getByLabelText(/password/i);
        expect(passwordInput).toBeInTheDocument();
        const buttonShowPassword = await screen.getByText(/Show password/i);
        expect(buttonShowPassword).toBeInTheDocument();
    });

    it('disables the "Log in" button when form is invalid', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        const loginButton = screen.getByRole('button', { name: /Log in/i });
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        expect(loginButton).toBeDisabled();

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        fireEvent.change(passwordInput, { target: { value: '123' } });

        expect(loginButton).toBeDisabled();

        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: '' } });

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'Password123');

        await waitFor(() => {
            expect(loginButton).not.toBeDisabled();
        });
    });
});
