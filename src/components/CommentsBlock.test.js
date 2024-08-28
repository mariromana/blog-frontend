import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommentsBlock } from './CommentsBlock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore([]);

describe('CommentsBlock Component', () => {
    const mockComments = [
        {
            _id: '1',
            user: {
                _id: '123',
                fullName: 'John Doe',
                avatarUrl: 'https://example.com/avatar.jpg',
            },
            comment: 'Test comment',
            createdAt: new Date().toISOString(),
        },
        {
            _id: '2',
            user: {
                _id: '124',
                fullName: 'Jane Smith',
                avatarUrl: '',
            },
            comment: 'Another comment',
            createdAt: new Date().toISOString(),
        },
    ];

    const mockUserData = {
        _id: '123',
        fullName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
    };

    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                data: mockUserData,
            },
        });
    });

    it('renders comments when isLoading is false', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CommentsBlock items={mockComments} isLoading={false} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Test comment')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Another comment')).toBeInTheDocument();
    });

    it('renders loading skeletons when isLoading is true', () => {
        const { container } = render(
            <Provider store={store}>
                <MemoryRouter>
                    <CommentsBlock isLoading={true} />
                </MemoryRouter>
            </Provider>
        );

        const skeletons = container.querySelectorAll('.MuiSkeleton-circular');
        expect(skeletons.length).toBe(2);

        const textSkeletons = container.querySelectorAll('.MuiSkeleton-text');
        expect(textSkeletons.length).toBe(2); // Два текстовых заглушки
    });

    it("renders delete icon for the user's own comment", () => {
        const mockDeleteComment = jest.fn();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <CommentsBlock
                        items={mockComments}
                        isLoading={false}
                        onDeleteComment={mockDeleteComment}
                    />
                </MemoryRouter>
            </Provider>
        );

        const deleteButton = screen.getByLabelText('delete');
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
        expect(mockDeleteComment).toHaveBeenCalledWith('1');
    });

    it("does not render delete icon for other users' comments", () => {
        const otherUserStore = mockStore({
            auth: {
                data: {
                    _id: '125',
                },
            },
        });

        render(
            <Provider store={otherUserStore}>
                <MemoryRouter>
                    <CommentsBlock items={mockComments} isLoading={false} />
                </MemoryRouter>
            </Provider>
        );

        const deleteButtons = screen.queryByLabelText('delete');
        expect(deleteButtons).toBeNull();
    });
});
