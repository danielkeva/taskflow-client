import React from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../store/actions/userActions';
import { useForm } from 'react-hook-form';
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
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { RiLock2Line } from 'react-icons/ri';
import ErrorNotification from '../components/ErrorNotification';
import { setError } from '../store/actions/errorActions';

const schema = yup.object().shape({
    email: yup.string().email('Please enter a valid email addresss').required('Email field is required'),
    password: yup.string().required('Password field is required').min(8, 'Password must be at least 8 characters long'),
});

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
        marginTop: theme.spacing(3),
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

const SignUp = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (userCred, e) => {
        e.preventDefault();
        dispatch(signup(userCred));
    };

    const onError = (errors, ev) => {
        const messages = Object.keys(errors).reduce((errorMessages, fieldName) => {
            errorMessages.push(errors[fieldName].message);
            return errorMessages;
        }, []);
        dispatch(setError({ data: messages }));
    };

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    {/* <LockOutlinedIcon /> */}
                    <RiLock2Line />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Sign up
                </Typography>
                <ErrorNotification />
                <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit, onError)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                inputRef={register}
                                autoComplete='fname'
                                name='firstName'
                                variant='outlined'
                                required
                                fullWidth
                                id='firstName'
                                label='First Name'
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField inputRef={register} variant='outlined' required fullWidth id='lastName' label='Last Name' name='lastName' autoComplete='lname' />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={register}
                                variant='outlined'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                className={errors.email && classes.error}
                                name='email'
                                autoComplete='email'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={register}
                                className={errors.password && classes.error}
                                variant='outlined'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value='allowExtraEmails' color='primary' />}
                                label='I want to receive inspiration, marketing promotions and updates via email.'
                            />
                        </Grid>
                    </Grid>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        Sign Up
                    </Button>
                    <Grid container justify='flex-end'>
                        <Grid item>
                            <Link href='#' variant='body2'>
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default SignUp;
