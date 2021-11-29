import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../store/actions/userActions';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { setError } from '../store/actions/errorActions';
import ErrorNotification from '../components/ErrorNotification';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'red',
        },
    },
}));

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email address').required('Email field is required'),
    password: yup.string().required('Password field is required').min(8, 'Password must be at least 8 characters long'),
});

const { REACT_APP_SERVER_URL = 'https://my-taskflow.herokuapp.com/' } = process.env;

// const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/';

const LogIn = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (userCred, e) => {
        // e.preventDefault()
        // console.log('data', userCred);
        dispatch(login(userCred));
    };

    const onError = (errors, ev) => {
        const messages = Object.keys(errors).reduce((errorMessages, fieldName) => {
            errorMessages.push(errors[fieldName].message);
            return errorMessages;
        }, []);
        dispatch(setError({ data: messages }));
    };

    const handleGoogleAuth = () => {
        window.open(`${REACT_APP_SERVER_URL}auth/google`, '_self');
    };

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}></Avatar>
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <ErrorNotification />
                <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit, onError)}>
                    <TextField
                        inputRef={register}
                        className={errors.email && classes.error}
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                    />
                    <TextField
                        inputRef={register}
                        className={errors.password && classes.error}
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                    />
                    <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        Sign In
                    </Button>
                    <Button fullWidth variant='contained' color='primary' className={classes.submit} onClick={handleGoogleAuth}>
                        Sign in with google
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href='#' variant='body2'>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='#' variant='body2'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};
export default LogIn;
