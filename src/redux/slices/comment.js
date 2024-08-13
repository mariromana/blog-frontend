import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

const initialState = {
    comments: {
        items: [],
        status: 'loading',
    },
};

export const fetchCreateComment = createAsyncThunk(
    'comments/fetchCreateComment',
    async ({ comment, userId, postId }) => {
        try {
            const { data } = await axios.post(`/comments`, {
                postId,
                comment,
                userId,
            });
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
    }
);

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (id) => {
        const { data } = await axios.get(`/comments/${id}`);
        return data;
    }
);

export const fetchDeleteComment = createAsyncThunk(
    'comments/fetchDeleteComment',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/comments/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchLastComments = createAsyncThunk(
    'comments/fetchLastComments',
    async () => {
        const { data } = await axios.get('/comments');
        return data;
    }
);

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateComment.pending, (state) => {
                // state.comments.items = [];
                state.comments.status = 'loading';
            })
            .addCase(fetchCreateComment.fulfilled, (state, action) => {
                console.log('New comment:', action.meta.arg);
                state.comments.items.push(action.payload);
                state.comments.status = 'loaded';
            })
            .addCase(fetchCreateComment.rejected, (state, action) => {
                state.comments.items = [];
                state.comments.status = 'error';
            })
            .addCase(fetchComments.pending, (state, action) => {
                state.comments.items = state.comments.items.filter((el) => {
                    return el.post === action.payload;
                });

                state.comments.status = 'loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = 'loaded';
            })
            .addCase(fetchComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = 'error';
            })
            .addCase(fetchLastComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = 'loading';
            })
            .addCase(fetchLastComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = 'loaded';
            })
            .addCase(fetchLastComments.rejected, (state, action) => {
                state.comments.items = [];
                state.comments.status = 'error';
            })
            //delete comment
            .addCase(fetchDeleteComment.pending, (state, action) => {
                console.log('Deleting comment:', action.meta.arg);
                state.comments.items = state.comments.items.filter(
                    (item) => item._id !== action.meta.arg
                );
                state.comments.status = 'loading';
            })
            .addCase(fetchDeleteComment.fulfilled, (state, action) => {
                state.comments.status = 'loaded';
            })
            .addCase(fetchDeleteComment.rejected, (state) => {
                state.comments.status = 'error';
            })

            .addDefaultCase(() => {});
    },
});

export const commentsReducer = commentsSlice.reducer;
