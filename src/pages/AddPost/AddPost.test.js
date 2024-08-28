import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { AddPost } from './index';
import '@testing-library/jest-dom';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
jest.mock('../../axios');

jest.mock('react-simplemde-editor', () => {
    return function MockSimpleMDE(props) {
        return (
            <textarea
                data-testid="simplemde"
                onChange={(e) => props.onChange(e.target.value)}
            />
        );
    };
});
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

describe('AddPost Component', () => {
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
        });

        store.dispatch = jest.fn();
    });

    beforeAll(() => {
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        }));
    });

    it('renders form elements correctly', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddPost />
                </MemoryRouter>
            </Provider>
        );

        expect(
            screen.getByPlaceholderText(/Article title.../i)
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Tags/i)).toBeInTheDocument();
        expect(screen.getByText(/Download preview/i)).toBeInTheDocument();
        expect(screen.getByText(/Publish/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    it('shows a warning when title is less than 3 characters', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddPost />
                </MemoryRouter>
            </Provider>
        );

        const title = screen.getByPlaceholderText('Article title...');
        fireEvent.change(title, { target: { value: 'Sh' } });

        await waitFor(() => {
            expect(
                screen.getByText(/Title must be at least 3 characters/i)
            ).toBeInTheDocument();
        });
    });

    it('handles image upload and removal', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddPost />
                </MemoryRouter>
            </Provider>
        );

        const fileInput = screen.getByText(/Download preview/i);
        const file = new File(['image content'], 'test.png', {
            type: 'image/png',
        });

        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText('Uploaded Preview')).toBeInTheDocument();
        });
    });

    it('submits form data correctly', async () => {
        axios.post.mockResolvedValueOnce({
            data: { _id: 'newPostId' },
        });
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AddPost />
                </MemoryRouter>
            </Provider>
        );

        const titleInput = screen.getByPlaceholderText(/Article title.../i);
        fireEvent.change(titleInput, { target: { value: 'Test Title' } });

        const textArea = screen.getByTestId('simplemde');
        fireEvent.change(textArea, {
            target: { value: 'Test content with more than 10 characters.' },
        });

        const submitButton = screen.getByText(/Publish/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/posts', {
                title: 'Test Title',
                text: 'Test content with more than 10 characters.',
                imageUrl: '',
                tags: '',
            });

            expect(navigate).toHaveBeenCalledWith('/posts/newPostId');
        });
    });
});
