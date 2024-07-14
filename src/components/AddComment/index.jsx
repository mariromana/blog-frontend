import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { fetchCreateComment } from '../../redux/slices/comment';
import styles from './AddComment.module.scss';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../../img/avatar-15.svg';
import { TextField, Avatar, Button } from '@mui/material';

export const Index = () => {
    const { data } = useSelector((state) => state.auth);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const { id } = useParams();

    const userId = data && data._id;

    const handleSubmit = () => {
        try {
            const postId = id;
            dispatch(fetchCreateComment({ comment, userId, postId }));
            setComment('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.root}>
                <Avatar
                    classes={{ root: styles.avatar }}
                    // src={
                    //     data.avatarUrl
                    //         ? `https://localhost:5000/${data.avatarUrl}`
                    //         : defaultAvatar
                    // }
                    src={
                        data.avatarUrl
                            ? `https://blog-api-swart-six.vercel.app/${data.avatarUrl}`
                            : defaultAvatar
                    }
                    alt="avatar"
                />

                <div className={styles.form}>
                    <TextField
                        label="Write a comment"
                        variant="outlined"
                        maxRows={10}
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                    />
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={comment.trim().length === 0}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </form>
    );
};
