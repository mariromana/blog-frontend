import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InvalidEmail } from './index';
import { MemoryRouter } from 'react-router-dom';
describe('InvalidEmail component', () => {
    it('has the correct heading text', () => {
        render(
            <MemoryRouter>
                <InvalidEmail />
            </MemoryRouter>
        );

        const heading = screen.getByText(
            /Email is already registered. Please log in or sign up./i
        );
        expect(heading).toBeInTheDocument();
    });

    it('has buttons that link to the correct routes', async () => {
        render(
            <MemoryRouter>
                <InvalidEmail />
            </MemoryRouter>
        );

        const loginLink = await screen.findByRole('link', {
            name: /Log In/i,
        });
        const signUpLink = await screen.findByRole('link', {
            name: /Sign up/i,
        });

        expect(loginLink).toBeInTheDocument();
        expect(signUpLink).toBeInTheDocument();
    });
});
