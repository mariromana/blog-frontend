import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPostsByUser } from '../../redux/slices/post';
import { fetchAuthMe, fetchAuthDelete } from '../../redux/slices/auth';
import { Post } from '../../components';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { selectIsAuth, logout, setIsAuth } from '../../redux/slices/auth';

import {
    Avatar,
    Card,
    CardActions,
    Button,
    Typography,
    Grid,
    createTheme,
    ThemeProvider,
    Popover,
    Box,
    Modal,
} from '@mui/material';
import styles from './Profile.module.scss';
import defaultAvatar from '../../img/avatar-15.svg';
import { Helmet } from 'react-helmet';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #dedede',
    boxShadow: 2,
    p: 4,
};

const theme = createTheme({
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0),0px 1px 1px 0px rgba(0,0,0,0),0px 1px 3px 0px rgba(0,0,0,0)',
        '0px 3px 1px -2px rgba(0,0,0,0),0px 2px 2px 0px rgba(0,0,0,0),0px 1px 5px 0px rgba(0,0,0,0)',
    ],
});

export const Profile = () => {
    const { data } = useSelector((state) => state.auth);
    const [isLoading, setLoading] = useState(true);
    const { posts } = useSelector((state) => state.posts);
    const isPostsLoading = posts.status === 'loading';
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const userId = data && data._id;
    const isMounted = useRef(true);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isMounted.current && userId) {
            dispatch(fetchPostsByUser(userId));
            isMounted.current = false;
        }
    }, [userId, dispatch, posts]);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    const onEdit = () => {
        setEdit(!edit);
    };

    const handleClickOpenModal = () => {
        setModalOpen(true);
    };

    const handleClickCloseModal = () => {
        setModalOpen(false);
    };

    const onDeleteAccount = async () => {
        try {
            const response = await axios.delete(`/auth/${userId}`);
            if (response.status === 200) {
                console.log('Account deleted successfully', response.data);
                dispatch(logout());

                dispatch({ type: 'auth/setIsAuth', payload: null });
                window.localStorage.removeItem('token');
                navigate('/');
            } else {
                console.error('Failed to delete account');
            }
        } catch (error) {
            console.error('Failed to delete account', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Profile" />
                <title>Profile</title>
            </Helmet>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <div className={styles.root}>
                        {data && (
                            <Card>
                                <Avatar
                                    sx={{ width: 100, height: 100 }}
                                    className={styles.avatar}
                                    src={
                                        data.avatarUrl
                                            ? data.avatarUrl
                                            : defaultAvatar
                                    }
                                    alt={data.fullName}
                                />
                                <div className={styles.userDetails}>
                                    <Typography
                                        className={styles.name}
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        Name: {data.fullName}
                                    </Typography>
                                    <Typography
                                        className={styles.email}
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        Email: {data.email}
                                    </Typography>
                                    <div className={styles.buttons}>
                                        <CardActions>
                                            <Link to="/add-post">
                                                <Button variant="contained">
                                                    Make a post
                                                </Button>
                                            </Link>

                                            <Link to="/profile/edit">
                                                <Button
                                                    variant="contained"
                                                    onClick={onEdit}
                                                >
                                                    Edit info
                                                </Button>
                                            </Link>
                                        </CardActions>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleClickOpenModal}
                                        >
                                            DELETE ACCOUNT
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Modal
                            open={modalOpen}
                            onClose={handleClickCloseModal}
                            aria-labelledby="delete-post-modal-title"
                            aria-describedby="delete-post-modal-description"
                        >
                            <Box sx={style}>
                                <Typography
                                    id="delete-post-modal-title"
                                    variant="h6"
                                    component="h3"
                                >
                                    Are you sure you want to delete your
                                    account?
                                </Typography>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        marginTop: '16px',
                                    }}
                                >
                                    <Button
                                        onClick={onDeleteAccount}
                                        variant="outlined"
                                        color="error"
                                        style={{
                                            marginRight: '15px',
                                        }}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        onClick={handleClickCloseModal}
                                        variant="outlined"
                                    >
                                        No
                                    </Button>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                </Grid>

                <Grid item xs={12} md={8}>
                    {(isPostsLoading || !Array.isArray(posts.items)
                        ? [...Array(5)]
                        : posts.items
                    ).map((obj, index) =>
                        isPostsLoading ? (
                            <Post key={index} isLoading={true} />
                        ) : (
                            <Post
                                key={obj._id}
                                id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.comments.length}
                                tags={obj.tags}
                                isEditable={true}
                            />
                        )
                    )}
                    {posts.items.length <= 0 && (
                        <Grid item xs={8}>
                            <p>No posts found.</p>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};
