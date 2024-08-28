import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SideBlock } from './index';

describe('SideBlock Component', () => {
    it('renders with the correct title', () => {
        render(<SideBlock title="Test Title">Content</SideBlock>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
        render(<SideBlock title="Test Title">Test Content</SideBlock>);

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
});
