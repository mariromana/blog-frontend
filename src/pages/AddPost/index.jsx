import React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import 'easymde/dist/easymde.min.css';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import styles from './AddPost.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios';
import { useForm } from 'react-hook-form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import * as yup from 'yup';
const theme = createTheme();
const schema = yup.object({
    title: yup
        .string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters'),
    // text: yup
    //     .string()
    //     .required('Text is required')
    //     .min(10, 'Text must be a least 10 characters'),
});

export const AddPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const inputFileRef = useRef(null);
    const isEditing = Boolean(id);
    const [warning, setWarning] = useState('');
    const uniqueId = `autosave_${Math.random().toString(36).substr(2, 9)}`;
    const {
        register,
        setValue,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const onChange = useCallback((value) => {
        setText(value);
        if (value.length < 10) {
            setWarning('Text must be at least 10 characters');
        } else {
            setWarning('');
        }
    }, []);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post('/upload', formData);
            setImageUrl(data.url);
            console.log(data.url);
        } catch (err) {
            console.warn(err);
            alert('Ошибка загрузки картинки');
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    useEffect(() => {
        if (isEditing) {
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setTags(data.tags.join(','));
                    setText(data.text);
                    setImageUrl(data.imageUrl);
                    setValue('title', data.title);
                    setValue('text', data.text);
                })
                .catch((err) => {
                    console.warn(err);
                    alert('Error fetching post data');
                });
        }
    }, [isEditing, id, setValue]);

    const onCancel = () => {
        navigate('/');
    };

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Enter text...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
                uniqueId: uniqueId,
            },
        }),
        // eslint-disable-next-line
        []
    );

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    }

    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const fields = {
                title,
                text,
                imageUrl,
                tags,
            };

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);

            const _id = isEditing ? id : data._id;

            navigate(`/posts/${_id}`);
        } catch (error) {
            console.warn('Error creating/editing post');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Create a new post" />
                <title>Add post</title>
            </Helmet>
            <Paper style={{ padding: 30 }}>
                <Button
                    onClick={() => inputFileRef.current.click()}
                    variant="outlined"
                    size="large"
                >
                    Download preview
                </Button>
                <input
                    ref={inputFileRef}
                    type="file"
                    onChange={handleChangeFile}
                    hidden
                />
                {imageUrl && (
                    <>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onClickRemoveImage}
                        >
                            Delete
                        </Button>
                        {/* <img
                            className={styles.image}
                            src={`http://localhost:5000/${imageUrl}`}
                            alt="Uploaded"
                        /> */}
                        <img
                            className={styles.image}
                            src={`https://blog-mern-api-sand.vercel.app/${imageUrl}`}
                            alt="Uploaded"
                        />
                    </>
                )}
                <br />
                <br />
                <TextField
                    classes={{ root: styles.title }}
                    variant="standard"
                    placeholder="Article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    inputProps={{ ...register('title') }}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                />

                <TextField
                    classes={{ root: styles.tags }}
                    variant="standard"
                    placeholder="Tags"
                    fullWidth
                    onChange={(e) => setTags(e.target.value)}
                    value={tags}
                />

                <SimpleMDE
                    className={styles.editor}
                    value={text}
                    // onChange={onChange}
                    onChange={(value) => {
                        onChange(value);
                    }}
                    helperText={errors.title?.message}
                    options={options}
                />
                {warning && <p className={styles.warning}>{warning}</p>}

                <div className={styles.buttons}>
                    <Button
                        onClick={() => onSubmit()}
                        size="large"
                        variant="contained"
                        disabled={!(title.length >= 3 && text.length >= 10)}
                    >
                        {isEditing ? 'Save' : 'Publish'}
                    </Button>
                    <Button size="large" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </Paper>
        </ThemeProvider>
    );
};
