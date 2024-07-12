import Container from '@mui/material/Container';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Header } from './components';
import {
    Home,
    FullPost,
    Registration,
    AddPost,
    Login,
    AddUserInfo,
    ForgotPassword,
    ResetPassword,
    InvalidEmail,
    Page404,
} from './pages';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { Profile } from './pages/Profile';

function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);
    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tags/:tag" element={<Home />} />
                    <Route path="/tag/:tag" element={<Home />} />
                    <Route path="/posts/:id" element={<FullPost />} />
                    <Route path="/posts/:id/edit" element={<AddPost />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<AddUserInfo />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />
                    <Route path="/email-error" element={<InvalidEmail />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
