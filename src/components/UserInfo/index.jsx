import React from 'react';
import styles from './UserInfo.module.scss';
import defaultAvatar from '../../img/avatar-15.svg';

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
    return (
        <div className={styles.root}>
            <img
                className={styles.avatar}
                // src={
                //     avatarUrl
                //         ? `http://localhost:5000/${avatarUrl}`
                //         : defaultAvatar
                // }
                src={
                    avatarUrl
                        ? `https://blog-api-swart-six.vercel.app/${avatarUrl}`
                        : defaultAvatar
                }
                alt={fullName}
            />
            <div className={styles.userDetails}>
                <span className={styles.userName}>{fullName}</span>
                <span className={styles.additional}>{additionalText}</span>
            </div>
        </div>
    );
};
