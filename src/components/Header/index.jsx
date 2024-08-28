import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Popover, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, logout } from '../../redux/slices/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from './Header.module.scss';

export const Header = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const onClickLogout = () => {
        setAnchorEl(null);
        dispatch(logout());
        window.localStorage.removeItem('token');
        navigate('/');
    };

    const handlePopoverClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'logout-popover' : undefined;

    return (
        <div className={styles.root}>
            <Container maxWidth="lg">
                <div className={styles.inner}>
                    <Link className={styles.logo} to="/">
                        <div>Blog</div>
                    </Link>
                    <div className={styles.buttons}>
                        {isAuth ? (
                            <>
                                <Link to="/add-post">
                                    <Button variant="contained">
                                        Make a post
                                    </Button>
                                </Link>

                                <Link to="/profile">
                                    <Button
                                        // onClick={onClickLogout}
                                        variant="contained"
                                        color="success"
                                    >
                                        Profile
                                    </Button>
                                </Link>
                                <Button
                                    aria-describedby={id}
                                    variant="contained"
                                    color="error"
                                    onClick={handlePopoverClick}
                                >
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outlined">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="contained">
                                        Create Your Account
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    Are you sure you want to log out?
                </Typography>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 16px',
                    }}
                >
                    <Button
                        onClick={onClickLogout}
                        ariant="outlined"
                        color="success"
                        endIcon={<LogoutIcon />}
                    >
                        Yes
                    </Button>
                    <Button
                        onClick={handleClosePopover}
                        color="error"
                        ariant="outlined"
                    >
                        No
                    </Button>
                </div>
            </Popover>
        </div>
    );
};
