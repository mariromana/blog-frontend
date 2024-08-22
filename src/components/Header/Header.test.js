import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './index';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';

import { postsReducer } from '../../redux/slices/post';
import { authReducer } from '../../redux/slices/auth';
import { commentsReducer } from '../../redux/slices/comment';
import '@testing-library/jest-dom';

const renderWithProviders = (ui, { preloadedState } = {}) => {
    const testStore = configureStore({
        reducer: {
            posts: postsReducer,
            auth: authReducer,
            comments: commentsReducer,
        },
        preloadedState,
    });

    return render(
        <Provider store={testStore}>
            <Router>{ui}</Router>
        </Provider>
    );
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

describe('Header Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login and register buttons when not authenticated', async () => {
        jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(
            (selector) =>
                selector({
                    posts: {
                        posts: { items: [], status: 'loaded' },
                        tags: { items: [], status: 'loaded' },
                    },
                    auth: { data: null },
                })
        );

        renderWithProviders(<Header />);

        expect(await screen.findByText(/Log in/i)).toBeInTheDocument();
        expect(
            await screen.findByText(/Create Your Account/i)
        ).toBeInTheDocument();
    });

    it('renders profile, make a post and log out buttons when authenticated', async () => {
        jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(
            (selector) =>
                selector({
                    posts: {
                        posts: { items: [], status: 'loaded' },
                        tags: { items: [], status: 'loaded' },
                    },
                    auth: {
                        data: {
                            _id: 1,
                            fullName: 'Kate',
                            email: 'test@gmail.com',
                            avatarUrl: '',
                            comments: [{}],
                        },
                    },
                })
        );

        renderWithProviders(<Header />);

        expect(await screen.findByText(/Profile/i)).toBeInTheDocument();
        expect(await screen.findByText(/Log out/i)).toBeInTheDocument();
        expect(await screen.findByText(/Make a post/i)).toBeInTheDocument();
    });
});
