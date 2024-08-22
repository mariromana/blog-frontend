import React from 'react';
import { useState, useRef } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { IconButton, Modal, Box, Typography, Button } from '@mui/material';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import {
    fetchRemovePost,
    fetchPostsByTags,
    fetchNewPosts,
} from '../../redux/slices/post';

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
export const Post = ({
    id,
    title,
    createdAt,
    imageUrl,
    user,
    viewsCount,
    commentsCount,
    tags,
    children,
    isFullPost,
    isLoading,
    isEditable,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const imageRef = useRef(null);

    const handleClickOpenModal = () => {
        setModalOpen(true);
    };

    const handleClickCloseModal = () => {
        setModalOpen(false);
    };

    if (isLoading) {
        return <PostSkeleton />;
    }

    const onClickRemove = () => {
        dispatch(fetchRemovePost(id));
        if (isFullPost) {
            navigate('/');
            dispatch(fetchNewPosts());
        }
    };

    const formatDate = (time) => {
        const postDate = new Date(time);
        const currentDate = new Date();

        const diffMilliseconds = currentDate - postDate;
        const diffSeconds = Math.floor(diffMilliseconds / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffMonths / 12);

        if (diffYears > 0) {
            return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        } else if (diffMonths > 0) {
            return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        } else if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    };

    const postByTags = (name) => {
        dispatch(fetchPostsByTags(name));
        console.log(name);
    };

    const handleImageClick = () => {
        if (imageRef.current) {
            handlePostClick();
        }
    };
    const handlePostClick = () => {
        navigate(`/posts/${id}`);
    };

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>

                    <IconButton
                        onClick={handleClickOpenModal}
                        color="secondary"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div>
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
                            Are you sure you want to delete the post?
                        </Typography>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '16px',
                            }}
                        >
                            <Button
                                onClick={onClickRemove}
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
            {imageUrl && (
                <img
                    className={clsx(styles.image, {
                        [styles.imageFull]: isFullPost,
                    })}
                    src={imageUrl}
                    alt={title}
                    ref={imageRef}
                    onClick={handleImageClick}
                />
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={formatDate(createdAt)} />
                <div className={styles.indention}>
                    <h2
                        className={clsx(styles.title, {
                            [styles.titleFull]: isFullPost,
                        })}
                    >
                        {isFullPost ? (
                            title
                        ) : (
                            <Link to={`/posts/${id}`}>{title}</Link>
                        )}
                    </h2>
                    <ul className={styles.tags}>
                        {tags && tags.length > 0 ? (
                            tags
                                .filter((tag) => tag.trim() !== '')
                                .map((name) => (
                                    <li key={name} data-testid={`tag-${name}`}>
                                        <Link
                                            onClick={() => postByTags(name)}
                                            to={`/tag/${name}`}
                                        >
                                            #{name}
                                        </Link>
                                    </li>
                                ))
                        ) : (
                            <li>No tags</li>
                        )}
                    </ul>
                    {children && (
                        <div className={styles.content}>{children}</div>
                    )}
                    <ul className={styles.postDetails}>
                        <li data-testid="views-count">
                            <EyeIcon />
                            <span>{viewsCount}</span>
                        </li>
                        <li data-testid="comments-count">
                            <CommentIcon />
                            <span>{commentsCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
