import React from 'react';
import styles from './CommentsBlock/CommentsBlock.module.scss';
import { SideBlock } from './SideBlock';
import defaultImg from '../img/avatar-15.svg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../redux/slices/auth';
import { useDispatch } from 'react-redux';
import { fetchDeleteComment } from '../redux/slices/comment';
import { fetchComments } from '../redux/slices/comment';
import DeleteIcon from '@mui/icons-material/Clear';
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    List,
    Skeleton,
    ListItemButton,
    Typography,
    IconButton,
    Box,
} from '@mui/material';

export const CommentsBlock = ({
    items,
    children,
    isLoading = true,
    onDeleteComment,
}) => {
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);
    const dispatch = useDispatch();
    const defaultComment = [
        {
            user: {
                fullName: 'Jane',
                avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Hello world',
        },
        {
            user: {
                fullName: 'Mike',
                avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
            },
            text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
        },
    ];

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

    return (
        <SideBlock title="Comments" className={styles.root}>
            <List>
                {(isLoading
                    ? defaultComment
                    : Array.isArray(items)
                    ? items
                    : []
                )?.map((obj, index) => (
                    <React.Fragment key={index}>
                        <Link
                            to={`/posts/${obj.post}`}
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: '#fff',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&:hover': {
                                        '.delete-icon': {
                                            transition: 'all 0.15s ease-in-out',
                                            visibility: 'visible',
                                        },
                                    },
                                }}
                            >
                                <ListItem alignItems="flex-start">
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            {isLoading ? (
                                                <Skeleton
                                                    variant="circular"
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <Avatar
                                                    alt={obj.user.fullName}
                                                    src={
                                                        obj.user.avatarUrl
                                                            ? obj.user.avatarUrl
                                                            : defaultImg
                                                    }
                                                />
                                            )}
                                        </ListItemAvatar>
                                        {isLoading ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <Skeleton
                                                    variant="text"
                                                    height={25}
                                                    width={120}
                                                />
                                                <Skeleton
                                                    variant="text"
                                                    height={18}
                                                    width={230}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={obj.user.fullName}
                                                    secondary={obj.comment}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    // className={styles}
                                                >
                                                    {formatDate(obj.createdAt)}
                                                </Typography>
                                                {isAuth &&
                                                    userData?._id ===
                                                        obj.user._id && (
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() =>
                                                                onDeleteComment(
                                                                    obj._id
                                                                )
                                                            }
                                                            className="delete-icon"
                                                            sx={{
                                                                visibility:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    )}
                                            </>
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            </Box>
                        </Link>
                    </React.Fragment>
                ))}
            </List>

            {isAuth && children}
        </SideBlock>
    );
};
