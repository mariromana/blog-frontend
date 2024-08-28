import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Post } from '../components/Post';
import { useSelector } from 'react-redux';
import { fetchDeleteComment } from '../redux/slices/comment';
import { Index } from '../components/AddComment';
import Markdown from 'react-markdown';
import { CommentsBlock } from '../components/CommentsBlock';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import axios from '../axios';

export const FullPost = () => {
    const [data, setData] = useState();
    const [comment, setComment] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { comments } = useSelector((state) => state.comments);

    const userData = useSelector((state) => state.auth.data);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.warn(err);
                alert('ошибка при получение статьи');
            })
            .finally(() => {
                setLoading(false);
            });

        // eslint-disable-next-line
    }, [id]);

    const getComments = async (id) => {
        try {
            const response = await axios.get(`/comments/${id}`);
            setComment(response.data);
        } catch (error) {
            console.warn(error);
            alert('Error while fetching comments');
        }
    };

    const handleDeleteComment = (id) => {
        dispatch(fetchDeleteComment(id)).then(() => {
            getComments(id);
        });
    };

    useEffect(() => {
        getComments(id);
    }, [id, comments]);

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }
    return (
        <>
            <Helmet>
                <meta name="description" content="Full post" />
                <title>Full post</title>
            </Helmet>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={data.imageUrl ? data.imageUrl : ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comment.length}
                tags={data.tags}
                isFullPost
                isEditable={userData?._id === data.user._id}
            >
                <Markdown>{data.text}</Markdown>
            </Post>

            <CommentsBlock
                id={id}
                items={comment}
                isLoading={false}
                onDeleteComment={handleDeleteComment}
            >
                <Index />
            </CommentsBlock>
        </>
    );
};
