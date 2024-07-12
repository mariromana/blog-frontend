import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/post';
import { authReducer } from './slices/auth';
import { commentsReducer } from './slices/comment';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
    },
});

export default store;
