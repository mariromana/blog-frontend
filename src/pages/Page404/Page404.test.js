import { Page404 } from './index';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Page404 component', () => {
    it(' renders the correct title and link', async () => {
        render(
            <MemoryRouter>
                <Page404 />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Page doesn't exist/i)).toBeInTheDocument();

            const link = screen.getByRole('link', {
                name: /Back to main page/i,
            });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/');
        });
    });
});
