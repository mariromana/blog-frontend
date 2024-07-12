import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import styles from './ResetPassword.module.scss';
import axios from '../../axios';
import { Helmet } from 'react-helmet';

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [pass, setPass] = useState(true);
    const [success, setSuccess] = useState(false);
    const { token } = useParams();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }

            const response = await axios.post('/reset-password', {
                password,
                token,
            });
            setMessage(response.data.message);
            setSuccess(true);
        } catch (error) {
            setMessage('Failed to reset password.');
        }
    };

    const visibilityPassword = () => {
        setPass(!pass);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setMessage('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setMessage('');
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <Paper classes={{ root: styles.root }}>
            <Helmet>
                <meta name="description" content="Reset password" />
                <title>Reset password</title>
            </Helmet>
            <Typography classes={{ root: styles.title }} variant="h5">
                Reset Password
            </Typography>
            <form onSubmit={handleResetPassword}>
                <TextField
                    className={styles.field}
                    type={pass ? 'password' : ''}
                    label="New Password"
                    value={password}
                    fullWidth
                    onChange={handlePasswordChange}
                />
                <TextField
                    className={styles.field}
                    type={pass ? 'password' : ''}
                    label="Confirm Password"
                    value={confirmPassword}
                    fullWidth
                    onChange={handleConfirmPasswordChange}
                />
                <Typography classes={{ root: styles.message }}>
                    {!success ? message : null}
                </Typography>
                <Typography classes={{ root: styles.successMessage }}>
                    {success
                        ? 'Password reset successfully. Redirecting to login page...'
                        : null}
                </Typography>
                <div className={styles.showPass}>
                    <Button onClick={visibilityPassword} size="small">
                        {pass ? 'Show password' : 'Hide password'}
                    </Button>
                </div>
                <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Reset Password
                </Button>
            </form>
            {success && <Navigate to="/login" />}
        </Paper>
    );
};
