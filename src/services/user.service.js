import httpService from './http.service';

export const userService = {
    signup,
    login,
    logout,
    loadUser,
    loginGoogle,
    getAuth
}

const USER_KEY = 'user'

async function signup(userCred) {
    const newUser = await httpService.post('auth/signup', userCred)
    if (newUser._id) {
        _handleLogin(newUser)
    }
    return newUser
}

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred)
    if (user._id) {
        _handleLogin(user)
    }
    return user
}
async function loginGoogle() {
    await httpService.get('auth/google')
}
async function logout() {
    await httpService.post('auth/logout');
    console.log('yes clear')
    sessionStorage.clear();
}
async function loadUser() {
    const user = await httpService.get('auth/login');
    // console.log('HEY USER');
    if (user._id) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    return user
}

async function getAuth() {
     await httpService.get('auth');
    // console.log('HEY USER');
    
}

function _handleLogin(user) {
    console.log('eyeysysy');
    sessionStorage.setItem(USER_KEY, JSON.stringify(user))
    window.location.href = '/boards'
}



