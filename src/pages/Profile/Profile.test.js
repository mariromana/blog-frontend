import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Profile } from './index';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from '../../axios';

jest.mock('../../axios');

const mockStore = configureStore([]);

describe('Profile Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                data: {
                    _id: 'userId',
                    avatarUrl: 'test-avatar-url',
                    fullName: 'Test User',
                    email: 'test@example.com',
                },
                isAuth: true,
            },
            posts: {
                posts: {
                    items: [],
                    status: 'loading',
                },
                tags: {
                    items: [],
                    status: 'loading',
                },
            },
        });

        store.dispatch = jest.fn();
    });

    it('renders with correct elements', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText(/Name: Test User/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Email: test@example.com/i)
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Make a post/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Edit info/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /DELETE ACCOUNT/i })
        ).toBeInTheDocument();
    });

    it('opens and closes modal on button click', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(
            screen.getByRole('button', { name: /DELETE ACCOUNT/i })
        );

        expect(
            screen.getByText(/Are you sure you want to delete your account\?/i)
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /No/i }));

        expect(
            screen.queryByText(
                /Are you sure you want to delete your account\?/i
            )
        ).not.toBeInTheDocument();
    });

    it('calls onDeleteAccount function on confirm delete', async () => {
        axios.delete.mockResolvedValue({ status: 200 });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Profile />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(
            screen.getByRole('button', { name: /DELETE ACCOUNT/i })
        );

        fireEvent.click(screen.getByRole('button', { name: /Yes/i }));

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith('/auth/userId');
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'auth/logout',
            });
            expect(store.dispatch).toHaveBeenCalledWith({
                type: 'auth/setIsAuth',
                payload: null,
            });
        });
    });
});
