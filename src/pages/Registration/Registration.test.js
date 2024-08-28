import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Registration } from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const mockStore = configureStore([]);
beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('Registration component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuth: false,
            },
        });
    });

    it('renders form elements correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ThemeProvider theme={createTheme()}>
                        <HelmetProvider>
                            <Registration />
                        </HelmetProvider>
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Sign Up/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: /Log In/i })
        ).toBeInTheDocument();
    });

    it('shows validation errors for invalid inputs', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ThemeProvider theme={createTheme()}>
                        <HelmetProvider>
                            <Registration />
                        </HelmetProvider>
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        await userEvent.type(screen.getByLabelText(/Your name/i), 'A');

        await userEvent.tab();

        await waitFor(() => {
            expect(
                screen.getByText(/Name must be at least 2 characters/i)
            ).toBeInTheDocument();
        });

        await userEvent.type(screen.getByLabelText(/E-Mail/i), 'invalid-email');

        await userEvent.tab();

        await waitFor(() => {
            expect(
                screen.getByText(/Invalid email format/i)
            ).toBeInTheDocument();
        });

        await userEvent.type(screen.getByLabelText(/Password/i), 'short');

        await userEvent.tab();

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Password must contain at least one letter and one number/i
                )
            ).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeDisabled();

        await userEvent.clear(screen.getByLabelText(/Your name/i));
        await userEvent.type(screen.getByLabelText(/Your name/i), 'Valid Name');

        await userEvent.tab();

        await userEvent.clear(screen.getByLabelText(/E-Mail/i));
        await userEvent.type(
            screen.getByLabelText(/E-Mail/i),
            'valid@example.com'
        );

        await userEvent.tab();

        await userEvent.clear(screen.getByLabelText(/Password/i));
        await userEvent.type(
            screen.getByLabelText(/Password/i),
            'Valid1Password'
        );

        await userEvent.tab();

        await waitFor(() => {
            expect(
                screen.queryByText(/Name must be at least 2 characters/i)
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText(/Invalid email format/i)
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText(
                    /Password must be at least 8 characters long/i
                )
            ).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: /Sign Up/i })
            ).toBeEnabled();
        });
    });
    it('handles image upload and removal', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ThemeProvider theme={createTheme()}>
                        <HelmetProvider>
                            <Registration />
                        </HelmetProvider>
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        const fileInput = screen.getByTestId('file-input');
        expect(fileInput).toBeInTheDocument();

        const file = new File(['image content'], 'test.png', {
            type: 'image/png',
        });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText('Delete');
        await userEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });
    });

    it('shows and hides password correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ThemeProvider theme={createTheme()}>
                        <HelmetProvider>
                            <Registration />
                        </HelmetProvider>
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        );

        const passwordInput = screen.getByLabelText(/Password/i);
        const toggleButton = screen.getByRole('button', {
            name: /Show password/i,
        });

        expect(passwordInput.type).toBe('password');
        userEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text');
        userEvent.click(toggleButton);
        expect(passwordInput.type).toBe('password');
    });
});
