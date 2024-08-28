import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FullPost } from './FullPost';
import { postsReducer } from '../redux/slices/post';
import { authReducer } from '../redux/slices/auth';
import { commentsReducer } from '../redux/slices/comment';
import axios from '../axios';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

jest.mock('../axios', () => ({
    get: jest.fn(),
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
            data: {
                _id: 'user123',
                fullName: 'Test User',
                email: 'test@example.com',
            },
        },
        posts: {
            post: {
                _id: '1',
                title: 'Test Post Title',
                text: 'Test Post Content',
                imageUrl: 'https://via.placeholder.com/600x400',
                user: { _id: 'user-id', name: 'Test User' },
                createdAt: '2024-08-27T00:00:00Z',
                viewsCount: 100,
                tags: ['test'],
            },
            status: 'loaded',
        },
        comments: {
            comments: [],
        },
    },
});

describe('FullPost Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockImplementation((url) => {
            if (url.includes('/posts/1')) {
                return Promise.resolve({
                    data: {
                        _id: '1',
                        title: 'Test Post Title',
                        text: 'Test Post Content',
                        imageUrl: 'https://via.placeholder.com/600x400',
                        user: { _id: 'user-id', name: 'Test User' },
                        createdAt: '2024-08-27T00:00:00Z',
                        viewsCount: 100,
                        tags: ['test'],
                    },
                });
            }
            return Promise.reject(new Error('Not Found'));
        });
    });

    it('renders post title, text, and image correctly', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/1']}>
                    <Routes>
                        <Route path="/posts/:id" element={<FullPost />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        expect(
            await screen.findByRole('heading', { name: /Test Post Title/i })
        ).toBeInTheDocument();
        expect(await screen.findByTestId('mock-markdown')).toHaveTextContent(
            'Test Post Content'
        );
        const image = await screen.findByAltText(/Test Post Title/i);
        expect(image).toHaveAttribute(
            'src',
            'https://via.placeholder.com/600x400'
        );
    });
});
