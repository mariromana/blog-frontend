import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import { Home } from './Home';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from '../redux/slices/post';
import { authReducer } from '../redux/slices/auth';
import { commentsReducer } from '../redux/slices/comment';
import {
    fetchPosts,
    fetchNewPosts,
    fetchPopularPosts,
} from '../redux/slices/post';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

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

describe('Home Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('renders posts and tags when data is available', async () => {
        useSelector.mockImplementation((selector) =>
            selector({
                posts: {
                    posts: {
                        items: [
                            {
                                _id: '1',
                                title: 'Post 1',
                                imageUrl: '',
                                user: { _id: '1', fullName: 'User' },
                                createdAt: '2024-08-20T00:00:00Z',
                                viewsCount: 10,
                                comments: [{}],
                                tags: ['tag1', 'tag2'],
                            },
                        ],
                        status: 'loaded',
                    },
                    tags: { items: ['tag1', 'tag2'], status: 'loaded' },
                },
                auth: { data: null },
            })
        );

        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        renderWithProviders(<Home />);

        expect(await screen.findByText(/Post 1/i)).toBeInTheDocument();
        expect(await screen.findByTestId('views-count')).toHaveTextContent(
            '10'
        );
        expect(await screen.findByTestId('comments-count')).toHaveTextContent(
            '1'
        );
        expect(await screen.findByTestId('tag-tag1')).toBeInTheDocument();
        expect(await screen.findByTestId('tag-tag2')).toBeInTheDocument();
    });

    it('changes tabs and displays correct posts', async () => {
        const preloadedState = {
            posts: {
                posts: {
                    items: [
                        {
                            _id: '1',
                            title: 'Post All',
                            imageUrl: '',
                            user: { _id: '1', fullName: 'Alex' },
                            createdAt: '2024-08-20T00:00:00Z',
                            viewsCount: 10,
                            comments: [],
                            tags: [],
                        },
                    ],
                    status: 'loaded',
                },
                tags: { items: [], status: 'loaded' },
            },
            auth: { data: null },
            comments: {
                items: [],
                status: 'loaded',
            },
        };

        const mockDispatch = jest.fn();
        jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(
            mockDispatch
        );

        const mockUseSelector = jest.fn((selectorFn) =>
            selectorFn(preloadedState)
        );
        jest.spyOn(require('react-redux'), 'useSelector').mockImplementation(
            mockUseSelector
        );

        const mockFetchNewPosts = jest.fn(fetchNewPosts);
        const mockFetchPopularPosts = jest.fn(fetchPopularPosts);
        const mockFetchPosts = jest.fn(fetchPosts);

        renderWithProviders(<Home />, { preloadedState });

        fireEvent.click(screen.getByRole('tab', { name: /New/i }));
        expect(mockDispatch).toHaveBeenCalled();
        const newPostsCalls = mockDispatch.mock.calls.filter(
            (call) => call[0].type === mockFetchNewPosts().type
        );
        expect(newPostsCalls.length).toBeGreaterThan(0);

        fireEvent.click(screen.getByRole('tab', { name: /Popular/i }));
        expect(mockDispatch).toHaveBeenCalled();
        const popularPostsCalls = mockDispatch.mock.calls.filter(
            (call) => call[0].type === mockFetchPopularPosts().type
        );
        expect(popularPostsCalls.length).toBeGreaterThan(0);

        fireEvent.click(screen.getByRole('tab', { name: /All/i }));
        expect(mockDispatch).toHaveBeenCalled();
        const allPostsCalls = mockDispatch.mock.calls.filter(
            (call) => call[0].type === mockFetchPosts().type
        );
        expect(allPostsCalls.length).toBeGreaterThan(0);
    });
});
