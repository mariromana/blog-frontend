import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { AddUserInfo } from './index';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from '../../axios';
import { fetchUpdateAuth } from '../../redux/slices/auth';
import userEvent from '@testing-library/user-event';
jest.mock('../../axios');

jest.mock('../../redux/slices/auth', () => ({
    ...jest.requireActual('../../redux/slices/auth'),
    fetchUpdateAuth: jest.fn(),
}));

const mockStore = configureStore([]);

describe('AddUserInfo component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                data: {
                    _id: 'user123',
                    fullName: 'Test User',
                    email: 'test@example.com',
                },
            },
        });

        axios.get.mockResolvedValue({
            data: {
                fullName: 'Test User',
                email: 'test@example.com',
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders form elements correctly', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddUserInfo />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(
                screen.getByText(/Update account info/i)
            ).toBeInTheDocument();
            expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /Update/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: /Return/i })
            ).toBeInTheDocument();
        });
    });

    it('shows validation error for invalid name', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddUserInfo />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/Your name/i), {
            target: { value: 'A' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() =>
            expect(
                screen.getByText(/Name must be at least 2 characters/i)
            ).toBeInTheDocument()
        );
    });

    it('shows validation error for invalid email', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddUserInfo />
                </MemoryRouter>
            </Provider>
        );

        userEvent.type(screen.getByLabelText(/E-Mail/i), 'invalid-email');

        userEvent.click(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() => {
            expect(
                screen.getByText((content, element) =>
                    /Invalid email format/i.test(content)
                )
            ).toBeInTheDocument();
        });
    });

    it('checks button state and submits the form successfully with valid data', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddUserInfo />
                </MemoryRouter>
            </Provider>
        );

        const updateButton = screen.getByRole('button', { name: /Update/i });
        expect(updateButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Your name/i), {
            target: { value: 'New Name' },
        });

        expect(updateButton).not.toBeDisabled();

        fireEvent.change(screen.getByLabelText(/E-Mail/i), {
            target: { value: 'new@example.com' },
        });

        expect(updateButton).not.toBeDisabled();

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(fetchUpdateAuth).toHaveBeenCalledWith({
                id: 'user123',
                userInfo: {
                    fullName: 'New Name',
                    email: 'new@example.com',
                    avatarUrl: '',
                },
            });
        });
    });
});
