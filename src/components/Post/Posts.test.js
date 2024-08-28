import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Post } from './index';
import { postsReducer } from '../../redux/slices/post';
import { authReducer } from '../../redux/slices/auth';
import { commentsReducer } from '../../redux/slices/comment';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

useDispatch.mockReturnValue(mockDispatch);
useNavigate.mockReturnValue(mockNavigate);

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
    },
    preloadedState: {
        auth: {
            data: {
                id: 'current-user',
                name: 'Current User',
            },
            isAuth: true,
        },
    },
});

describe('Post Component', () => {
    const postProps = {
        id: '1',
        title: 'Test Post',
        createdAt: '2023-08-28T12:34:56Z',
        imageUrl: 'https://via.placeholder.com/150',
        user: {
            id: 'current-user',
            name: 'Current User',
            avatarUrl: 'https://via.placeholder.com/50',
        },
        viewsCount: 100,
        commentsCount: 4,
        tags: ['react', 'javascript'],
        isFullPost: false,
        isLoading: false,
        isEditable: true,
    };

    it('renders post with correct data', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Post {...postProps} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Test Post')).toBeInTheDocument();
        expect(screen.getByAltText('Test Post')).toBeInTheDocument();
        expect(screen.getByTestId('views-count')).toHaveTextContent('100');
        expect(screen.getByTestId('comments-count')).toHaveTextContent('4');
        expect(screen.getByTestId('tag-react')).toBeInTheDocument();
        expect(screen.getByTestId('tag-javascript')).toBeInTheDocument();
    });

    it('shows delete and edit button for own post when user is authenticated', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Post {...postProps} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('ClearIcon')).toBeInTheDocument();
        expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
    });

    it("does not show delete and edit buttons for another user's post", () => {
        const otherUserPostProps = {
            ...postProps,
            user: {
                id: 'user-2',
                name: 'Another User',
                avatarUrl: 'https://via.placeholder.com/50',
            },
            isEditable: false,
        };

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Post {...otherUserPostProps} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByTestId('ClearIcon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument();
    });

    it('opens and closes modal on delete button click', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Post {...postProps} />
                </MemoryRouter>
            </Provider>
        );

        const deleteBtn = screen.queryByTestId('ClearIcon');
        expect(deleteBtn).toBeInTheDocument();
        fireEvent.click(deleteBtn);
        expect(
            screen.getByText(/Are you sure you want to delete the post?/i)
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /No/i }));
        expect(
            screen.queryByText(/Are you sure you want to delete the post?/i)
        ).not.toBeInTheDocument();
    });
});
