import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdateAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AddUserInfo.module.scss';
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
        email: yup.string().email('Invalid email format'),
    })
    .required();

export const AddUserInfo = () => {
    const { data } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatar] = useState('');
    const navigate = useNavigate();
    const inputFileRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);

    const userId = data && data._id;
    const {
        register,
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: fullName,
            email: email,
        },
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        axios
            .get(`/auth/me`)
            .then(({ data }) => {
                setFullName(data.fullName);
                setEmail(data.email);
                setAvatar(data.avatarUrl);
            })
            .catch((err) => {
                console.warn(err);
                alert('Error fetching profile data');
            });
    }, []);

    const onSubmit = async (values) => {
        const dataToSend = {
            ...values,
            avatarUrl: avatarUrl,
        };

        const data = await dispatch(
            fetchUpdateAuth({ id: userId, userInfo: dataToSend })
        );

        if (!data.payload) {
            return alert('failed to update');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }

        navigate('/profile');
    };

    const handleChangeFile = async (event) => {
        setIsEdited(true);
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

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Change your profile" />
                <title>Update your profile</title>
            </Helmet>
            <Paper classes={{ root: styles.root }}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Update account info
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
                                <img
                                    className={styles.avatarUser}
                                    src={avatarUrl}
                                    alt="Uploaded"
                                />

                                <Button
                                    variant="contained"
                                    className={styles.buttonDelete}
                                    color="error"
                                    onClick={() => {
                                        setAvatar('');
                                        setIsEdited(true);
                                    }}
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
                        error={isEdited && Boolean(errors.fullName?.message)}
                        helperText={isEdited && errors.fullName?.message}
                        {...register('fullName', {
                            required: 'Enter your name',
                        })}
                        className={styles.field}
                        label="Your name"
                        fullWidth
                        style={{ marginTop: '10px' }}
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            clearErrors('fullName');
                            setIsEdited(true);
                        }}
                    />
                    <TextField
                        error={isEdited && Boolean(errors.email?.message)}
                        helperText={isEdited && errors.email?.message}
                        {...register('email', { required: 'Enter your email' })}
                        className={styles.field}
                        label="E-Mail"
                        fullWidth
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            clearErrors('email');
                            setIsEdited(true);
                        }}
                    />

                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        style={{ marginBottom: 15 }}
                        fullWidth
                        disabled={!isEdited}
                    >
                        Update
                    </Button>
                </form>
                <Link to="/profile">
                    <Button variant="outlined">Return</Button>
                </Link>
            </Paper>
        </ThemeProvider>
    );
};
