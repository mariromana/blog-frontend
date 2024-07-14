import React from 'react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './Login.module.scss';
import { Helmet } from 'react-helmet';

const theme = createTheme({
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    ],
});

const schema = yup
    .object({
        fullName: yup
            .string()
            .min(2, 'Name must be at least 2 characters')
            .required('Enter your name'),
        email: yup
            .string()
            .required('Email is required')
            .email('Invalid email format'),
        password: yup
            .string()
            .required('Password is required')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/,
                'Password must contain at least one letter and one number'
            )
            .min(8, 'Password must be at least 8 characters long'),
    })
    .required();

export const Registration = ({ isEditing }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const [errorMessage, setErrorMessage] = useState();
    const [pass, setPass] = useState(true);
    const [avatarUrl, setAvatar] = useState('');
    const inputFileRef = useRef(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const onSubmit = async (values) => {
        const dataToSend = {
            ...values,
            avatarUrl: avatarUrl,
        };

        try {
            const data = await dispatch(fetchRegister(dataToSend));

            if (!data.payload) {
                setErrorMessage('Failed to register. Please try again.');
            } else if ('token' in data.payload) {
                window.localStorage.setItem('token', data.payload.token);
            }
        } catch (error) {
            console.error('Registration error:', error.response);

            if (
                error.response &&
                error.response.data.message ===
                    'Email already exists in the database.'
            ) {
                setErrorMessage(
                    'Email is already registered. Please use a different email or log in'
                );
            } else {
                setErrorMessage('Failed to register. Please try again.');
            }
        }
    };

    if (
        errorMessage ===
            'Email is already registered. Please use a different email or log in' ||
        errorMessage === 'Failed to register. Please try again.'
    ) {
        navigate('/email-error');
    }

    const visibilityPassword = () => {
        setPass(!pass);
    };
    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            console.log(file);
            formData.append('image', file);
            const { data } = await axios.post('/upload', formData);
            setAvatar(data.url);
            console.log(data.url);
        } catch (err) {
            console.warn(err);
            alert('Ошибка загрузки avatara');
        }
    };

    const onClickRemoveImage = () => {
        setAvatar('');
    };

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Registration" />
                <title>Registration</title>
            </Helmet>
            <Paper classes={{ root: styles.root }}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Sign Up
                </Typography>
                <Typography variant="body2" color="error">
                    {errorMessage}
                </Typography>
                <div className={styles.avatar}>
                    {!avatarUrl && (
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            onClick={() => inputFileRef.current.click()}
                        />
                    )}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.avatar}>
                        {avatarUrl && (
                            <div className={styles.avatarUsers}>
                                {/* <img
                                    className={styles.avatarUser}
                                    src={`http://localhost:5000/${avatarUrl}`}
                                    alt="Uploaded"
                                /> */}
                                <img
                                    className={styles.avatarUser}
                                    src={`https://blog-api-swart-six.vercel.app/${avatarUrl}`}
                                    alt="Uploaded"
                                />

                                <Button
                                    variant="contained"
                                    className={styles.buttonDelete}
                                    color="error"
                                    onClick={onClickRemoveImage}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                    {!avatarUrl && (
                        <Button
                            style={{
                                display: 'block',
                                margin: '0 auto',
                                marginBottom: 20,
                                marginTop: 20,
                            }}
                            onClick={() => inputFileRef.current.click()}
                            variant="outlined"
                            size="small"
                        >
                            Upload
                        </Button>
                    )}
                    <input
                        ref={inputFileRef}
                        type="file"
                        onChange={handleChangeFile}
                        hidden
                    />
                    <TextField
                        error={Boolean(errors.fullName?.message)}
                        helperText={errors.fullName?.message}
                        {...register('fullName', {
                            required: 'Enter your name',
                        })}
                        className={styles.field}
                        label="Your name"
                        fullWidth
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        {...register('email', {
                            required: 'Enter your email',
                        })}
                        className={styles.field}
                        label="E-Mail"
                        fullWidth
                    />
                    <TextField
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        {...register('password', {
                            required: 'Enter your password',
                        })}
                        className={styles.field}
                        label="Password"
                        type={pass ? 'password' : ''}
                        fullWidth
                    />
                    <Button
                        onClick={visibilityPassword}
                        size="small"
                        style={{
                            display: 'flex',
                            flexDirection: 'end',
                            marginButtom: '10px',
                        }}
                    >
                        {pass ? 'Show password' : 'Hide password'}
                    </Button>
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        disabled={!isValid}
                        fullWidth
                    >
                        Sign Up
                    </Button>
                </form>
                <Link to="/login" className={styles.link}>
                    Already a blog?<span> Log In</span>
                </Link>
            </Paper>
        </ThemeProvider>
    );
};
