import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Index } from './index';
import { fetchCreateComment } from '../../redux/slices/comment';
import defaultAvatar from '../../img/avatar-15.svg';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

jest.mock('../../redux/slices/comment', () => ({
    fetchCreateComment: jest.fn(),
}));

describe('Index Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                data: {
                    _id: 'userId',
                    avatarUrl: defaultAvatar,
                },
            },
        });

        store.dispatch = jest.fn();
    });

    it('renders with correct elements', () => {
        render(
            <Provider store={store}>
                <Index />
            </Provider>
        );

        expect(screen.getByLabelText(/write a comment/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /send/i })
        ).toBeInTheDocument();
        expect(screen.getByAltText(/avatar/i)).toHaveAttribute(
            'src',
            defaultAvatar
        );
    });

    it('updates comment input value', () => {
        render(
            <Provider store={store}>
                <Index />
            </Provider>
        );

        const input = screen.getByLabelText(/write a comment/i);
        expect(input).toHaveValue('');

        fireEvent.change(input, { target: { value: 'New comment' } });
        expect(input).toHaveValue('New comment');
    });

    it('calls fetchCreateComment on button click with correct arguments', () => {
        render(
            <Provider store={store}>
                <Index />
            </Provider>
        );

        fireEvent.change(screen.getByLabelText(/write a comment/i), {
            target: { value: 'New comment' },
        });

        fireEvent.click(screen.getByRole('button', { name: /send/i }));

        expect(store.dispatch).toHaveBeenCalledWith(
            fetchCreateComment({
                comment: 'New comment',
                userId: 'userId',
                postId: undefined,
            })
        );
    });

    it('disables the button when comment input is empty', () => {
        render(
            <Provider store={store}>
                <Index />
            </Provider>
        );

        expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/write a comment/i), {
            target: { value: 'New comment' },
        });

        expect(screen.getByRole('button', { name: /send/i })).toBeEnabled();
    });
});
