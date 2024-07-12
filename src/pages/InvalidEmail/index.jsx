import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from './InvalidEmail.module.scss';
import { Helmet } from 'react-helmet';

const theme = createTheme({
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    ],
});
export const InvalidEmail = () => {
    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <meta name="description" content="Invalid email" />
                <title>Invalid page</title>
            </Helmet>
            <Paper classes={{ root: styles.root }}>
                <Typography classes={{ root: styles.title }} variant="h5">
                    Email is already registered. Please log in or sign up.
                </Typography>

                <div className={styles.links}>
                    <Button variant="contained" component={Link} to="/login">
                        Log In
                    </Button>
                    <Button variant="outlined" component={Link} to="/register">
                        Sign up
                    </Button>
                </div>
            </Paper>
        </ThemeProvider>
    );
};
