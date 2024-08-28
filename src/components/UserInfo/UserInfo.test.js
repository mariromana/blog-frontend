import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserInfo } from './index';
import defaultAvatar from '../../img/avatar-15.svg';
import '@testing-library/jest-dom';
import styles from './UserInfo.module.scss';
describe('UserInfo Component', () => {
    const mockFullName = 'John Doe';
    const mockAdditionalText = 'Online';
    const mockAvatarUrl = 'https://example.com/avatar.jpg';

    it('should render with default avatar when no avatarUrl is provided', () => {
        render(
            <UserInfo
                fullName={mockFullName}
                additionalText={mockAdditionalText}
            />
        );

        const avatar = screen.getByAltText(mockFullName);
        expect(avatar).toHaveAttribute('src', defaultAvatar);
    });

    it('should render with provided avatarUrl', () => {
        render(
            <UserInfo
                avatarUrl={mockAvatarUrl}
                fullName={mockFullName}
                additionalText={mockAdditionalText}
            />
        );

        const avatar = screen.getByAltText(mockFullName);
        expect(avatar).toHaveAttribute('src', mockAvatarUrl);
    });

    it('should display the full name', () => {
        render(
            <UserInfo
                fullName={mockFullName}
                additionalText={mockAdditionalText}
            />
        );

        expect(screen.getByText(mockFullName)).toBeInTheDocument();
    });

    it('should display the additional text', () => {
        render(
            <UserInfo
                fullName={mockFullName}
                additionalText={mockAdditionalText}
            />
        );

        expect(screen.getByText(mockAdditionalText)).toBeInTheDocument();
    });

    it('should apply the correct styles', () => {
        render(
            <UserInfo
                fullName={mockFullName}
                additionalText={mockAdditionalText}
            />
        );

        const rootDiv =
            screen.getByText(mockFullName).parentElement.parentElement;
        expect(rootDiv).toHaveClass(styles.root);
    });
});
