import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { TagsBlock } from './TagsBlock';
import { fetchPostsByTags } from '../redux/slices/post';
import { postsReducer } from '../redux/slices/post';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

const mockDispatch = jest.fn();
useDispatch.mockReturnValue(mockDispatch);

const store = configureStore({
    reducer: {
        posts: postsReducer,
    },
});

describe('TagsBlock Component', () => {
    const tags = ['React', 'JavaScript', 'TypeScript'];

    it('renders with tags', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <TagsBlock items={tags} isLoading={false} />
                </MemoryRouter>
            </Provider>
        );

        tags.forEach((tag) => {
            expect(screen.getByText(tag)).toBeInTheDocument();
        });
    });
});
