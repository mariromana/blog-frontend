import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});

export const fetchNewPosts = createAsyncThunk(
    'posts/fetchNewPosts',
    async () => {
        const { data } = await axios.get('/posts/new');
        return data;
    }
);

export const fetchPopularPosts = createAsyncThunk(
    'posts/fetchPopularPosts',
    async () => {
        const { data } = await axios.get('/posts/popular');
        return data;
    }
);
export const fetchRemovePost = createAsyncThunk(
    'posts/fetchRemovePost',
    async (id) => {
        const { data } = await axios.delete(`/posts/${id}`);
        return data;
    }
);
export const fetchPostsByUser = createAsyncThunk(
    'posts/fetchPostsByUser',
    async (userId) => {
        const { data } = await axios.get(`/profile/${userId}`);
        return data;
    }
);

export const fetchPostsByTags = createAsyncThunk(
    'posts/fetchPostsByTags',
    async (tag) => {
        const { data } = await axios.get(`/tags/${tag}`);
        return data;
    }
);

export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (id) => {
        const { data } = await axios.get(`/posts/${id}`);
        return data;
    }
);

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
};

const isToday = (someDate) => {
    const today = new Date();
    return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
    );
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
        builder
            ///all posts
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            //by id post
            .addCase(fetchPostById.pending, (state, action) => {
                state.posts.items = state.posts.items.filter((elem) => {
                    return elem._id == action.payload;
                });
                state.posts.status = 'loading';
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            //tags
            .addCase(fetchTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = 'loading';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = 'loaded';
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.tags.items = [];
                state.tags.status = 'error';
            })
            //delete post
            .addCase(fetchRemovePost.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(
                    (obj) => obj._id !== action.meta.arg
                );
                state.posts.status = 'loading';
            })
            .addCase(fetchRemovePost.fulfilled, (state, action) => {
                state.posts.status = 'loaded';
            })
            .addCase(fetchRemovePost.rejected, (state, action) => {
                state.posts.status = 'error';
            })
            //new post
            .addCase(fetchNewPosts.pending, (state) => {
                state.posts.items = state.posts.items.filter((elem) =>
                    isToday(new Date(elem.createdAt))
                );
                state.posts.status = 'loading';
            })
            .addCase(fetchNewPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchNewPosts.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            //popular posts
            .addCase(fetchPopularPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPopularPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPopularPosts.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            //posts by tags
            .addCase(fetchPostsByTags.pending, (state, action) => {
                state.posts.items = state.posts.items.filter((elem) => {
                    return elem.tags.includes(action.payload);
                });
                state.posts.status = 'loading';
            })
            .addCase(fetchPostsByTags.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = 'loaded';
            })
            .addCase(fetchPostsByTags.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            // posts of user
            .addCase(fetchPostsByUser.pending, (state, action) => {
                state.posts.items = state.posts.items.filter((elem) => {
                    return elem.user == action.payload;
                });
                state.posts.items = [];
                state.posts.status = 'loading';
            })
            .addCase(fetchPostsByUser.fulfilled, (state, action) => {
                state.posts.items = action.payload;

                state.posts.status = 'loaded';
            })
            .addCase(fetchPostsByUser.rejected, (state, action) => {
                state.posts.items = [];
                state.posts.status = 'error';
            })
            .addDefaultCase(() => {});
    },
});

export const postsReducer = postSlice.reducer;
