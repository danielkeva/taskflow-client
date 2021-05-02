import { userService } from '../../services/user.service';

export function signup(userCred) {
    return async dispatch => {
        try {
            const user = await userService.signup(userCred);
            console.log('after signup', user);
            dispatch({ type: 'SET_USER', user });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', error: err.response });
        }
    };
}

export function login(userCred) {
    return async dispatch => {
        try {
            const user = await userService.login(userCred);
            dispatch({ type: 'SET_USER', user });
            window.location.href = `/${user.username}/boards`
        } catch (err) {
            console.log('err', err);
            dispatch({ type: 'SET_ERROR', error: err.response });
        }
    };
}

export function logout() {
    return async (dispatch, getState) => {
        await userService.logout();
        dispatch({ type: 'SET_LOGOUT' });
    };
}

export function getLoggedInUser() {
    return async dispatch => {
        try {
            // await userService.loadUser()
            // dispatch({ type: 'SET_LOADING', isLoading: true})
            const user = await userService.loadUser();
            console.log('heyehey');
            if (user._id) {
                dispatch({ type: 'SET_USER', user });
                return user;
            }
        } catch (err) {
            console.log('login failed useractions: ', err);
        }
    };
}
