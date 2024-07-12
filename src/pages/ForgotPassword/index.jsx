import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from './ForgotPassword.module.scss';
import axios from '../../axios';
import { Helmet } from 'react-helmet';

const schema = yup
    .object({
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email format'),
    })
    .required();

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [userNotFound, setUserNotFound] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate({ email }, { abortEarly: false });
            await axios.post('/forgot-password', { email });
            navigate('/login');
        } catch (validationError) {
            if (validationError.name === 'ValidationError') {
                const formattedErrors = {};
                validationError.inner.forEach((err) => {
                    formattedErrors[err.path] = err.message;
                });
                setErrors(formattedErrors);
            } else {
                console.error(validationError);
                setUserNotFound(true);
            }
        }
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setUserNotFound(false);
        setErrors({});
    };

    return (
        <Paper classes={{ root: styles.root }}>
            <Helmet>
                <meta name="description" content="Forgot Password" />
                <title>Forgot Password</title>
            </Helmet>
            <Typography classes={{ root: styles.title }} variant="h5">
                Your email
            </Typography>
            <Typography classes={{ root: styles.subtitle }}>
                {!userNotFound
                    ? 'We’ll send you an email with a link to reset your password.'
                    : 'User with this email not found.'}
            </Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    className={styles.field}
                    label="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    fullWidth
                />

                <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    fullWidth
                >
                    Reset
                </Button>
            </form>
            <div className={styles.links}>
                <Link to="/login" className={styles.link}>
                    Sing up
                </Link>
            </div>
        </Paper>
    );
};
