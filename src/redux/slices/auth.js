import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

export const fetchAuthDelete = createAsyncThunk(
    'auth/fetchAuthDelete',
    async ({ id }) => {
        const { data } = await axios.delete(`/auth/${id}`);
        return data;
    }
);

export const fetchRegister = createAsyncThunk(
    'auth/fetchRegister',
    async (params) => {
        const { data } = await axios.post('/auth/register', params);
        return data;
    }
);

export const fetchUpdateAuth = createAsyncThunk(
    'auth/fetchUpdateAuth',
    async ({ id, userInfo }) => {
        try {
            const { data } = await axios.patch(`/users/${id}`, userInfo);
            return data;
        } catch (error) {
            throw new Error('Failed to update user information');
        }
    }
);

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
        setIsAuth: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchAuth.rejected, (state, action) => {
                state.data = null;
                state.status = 'error';
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchAuthMe.rejected, (state, action) => {
                state.data = null;
                state.status = 'error';
            })
            .addCase(fetchRegister.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.data = null;
                state.status = 'error';
            })
            //update
            .addCase(fetchUpdateAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUpdateAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchUpdateAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            //delete
            .addCase(fetchAuthDelete.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAuthDelete.fulfilled, (state) => {
                state.data = null;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchAuthDelete.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addDefaultCase(() => {});
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { logout, setIsAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
