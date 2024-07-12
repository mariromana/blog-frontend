import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { Helmet } from 'react-helmet';
import {
    fetchNewPosts,
    fetchPosts,
    fetchTags,
    fetchPopularPosts,
} from '../redux/slices/post';
import { fetchLastComments } from '../redux/slices/comment';

export const Home = () => {
    const dispatch = useDispatch();
    const { posts, tags } = useSelector((state) => state.posts);
    const userData = useSelector((state) => state.auth.data);
    const isPostsLoading = posts.status === 'loading';

    const [tabs, setTabs] = useState('1');

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
        dispatch(fetchLastComments());
        // eslint-disable-next-line
    }, [dispatch]);

    const showNewPosts = useCallback(() => {
        dispatch(fetchNewPosts());
    }, [dispatch]);

    const showPopularPosts = useCallback(() => {
        dispatch(fetchPopularPosts());
    }, [dispatch]);

    const showAllPosts = useCallback(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleChange = useCallback((event, newValue) => {
        setTabs(newValue);
    }, []);

    return (
        <>
            <Helmet>
                <meta name="description" content="Home page" />
                <title>Home page</title>
            </Helmet>
            <Tabs
                style={{ marginBottom: 15 }}
                // value={0}
                aria-label="basic tabs example"
                onChange={handleChange}
                value={tabs}
            >
                <Tab onClick={showAllPosts} value="1" label="All" />
                <Tab onClick={showNewPosts} value="2" label="New" />
                <Tab onClick={showPopularPosts} value="3" label="Popular" />
            </Tabs>

            <Grid container spacing={4}>
                <Grid xs={8} item>
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
                                // imageUrl={
                                //     obj.imageUrl
                                //         ? `http://localhost:5000/${obj.imageUrl}`
                                //         : ''
                                // }
                                imageUrl={
                                    obj.imageUrl
                                        ? `https://blog-mern-api-sand.vercel.app/${obj.imageUrl}`
                                        : ''
                                }
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.comments.length}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={false} />
                </Grid>
            </Grid>
        </>
    );
};
