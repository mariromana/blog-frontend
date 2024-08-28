import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App'; // Default import
import { Header } from './components';
import Home from './pages/Home';
import { fetchAuthMe } from './redux/slices/auth';
import { postsReducer } from './redux/slices/post';
import { authReducer } from './redux/slices/auth';
import { commentsReducer } from './redux/slices/comment';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

jest.mock('./redux/slices/auth', () => ({
    ...jest.requireActual('./redux/slices/auth'),
    fetchAuthMe: jest.fn(),
}));

jest.mock('react-markdown', () => {
    return function MockMarkdown(props) {
        return <div data-testid="mock-markdown">{props.children}</div>;
    };
});

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
    },
    preloadedState: {
        auth: {
            data: null,
            isAuth: false,
        },
    },
});

describe('App Component', () => {
    it('renders Header component', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('calls fetchAuthMe on mount', () => {
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <App />
                </MemoryRouter>
            </Provider>
        );

        expect(mockDispatch).toHaveBeenCalledWith(fetchAuthMe());
    });
});
