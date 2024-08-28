import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Helmet } from 'react-helmet';
import { createTheme, ThemeProvider } from '@mui/material';
const theme = createTheme({
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0),0px 1px 1px 0px rgba(0,0,0,0),0px 1px 3px 0px rgba(0,0,0,0)',
        '0px 3px 1px -2px rgba(0,0,0,0),0px 2px 2px 0px rgba(0,0,0,0),0px 1px 5px 0px rgba(0,0,0,0)',
    ],
});

const schema = yup
    .object({
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email format'),
    })
    .required();

export const Login = () => {
    const [pass, setPass] = useState(true);
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [errorMessage, setErrorMessage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));

        if (!data.payload) {
            setErrorMessage(true);
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };
    const visibilityPassword = () => {
        setPass(!pass);
    };
    if (isAuth) {
        return <Navigate to="/" />;
    }
    const handleEmailChange = () => {
        setErrorMessage(false);
    };

    const handlePasswordChange = () => {
        setErrorMessage(false);
    };
    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Login" />
                <title>Login</title>
            </Helmet>
            <Paper classes={{ root: styles.root }}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Log in
                </Typography>
                <Typography classes={{ root: styles.subtitle }}>
                    {errorMessage
                        ? 'Something went wrong. Please check your email or password.'
                        : null}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        className={styles.field}
                        label="email"
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        {...register('email', { required: 'Enter your email' })}
                        onChange={handleEmailChange}
                        fullWidth
                    />
                    <TextField
                        className={styles.secondField}
                        label="password"
                        type={pass ? 'password' : ''}
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', {
                            required: 'Укажите пароль',
                        })}
                        onChange={handlePasswordChange}
                        fullWidth
                    />
                    <Button
                        className={styles.buttonSmall}
                        onClick={visibilityPassword}
                        size="small"
                    >
                        {pass ? 'Show password' : 'Hide password'}
                    </Button>
                    <Button
                        className={styles.button}
                        type="submit"
                        size="large"
                        variant="contained"
                        disabled={!isValid}
                        fullWidth
                    >
                        Log in
                    </Button>
                </form>
                <Link to="/forgot-password" className={styles.link}>
                    Forgot your <span> password?</span>
                </Link>
                <Link to="/register" className={styles.link}>
                    Are you new here?<span> Sign Up</span>
                </Link>
            </Paper>
        </ThemeProvider>
    );
};
