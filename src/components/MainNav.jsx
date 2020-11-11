import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../store/actions/userActions';
import { BsKanban } from "react-icons/bs";
import UserAvatar from './UserAvatar';
import Spinner from './Spinner';


const MainNav = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.loggedInUser)
    const isLoading = useSelector(state => state.user.userLoading)
    // const isLoading = useSelector(state => state.general.isLoading)
    const handleLogout = async () => {
        await dispatch(logout())
    }
    console.log('islo', isLoading)
    // if (isLoading) {
    //     return <Spinner />
    // }
    // else 
    return (
        <header>
            {user || isLoading ?
                <nav className="main-nav">
                    {/* {!isLoading && <> */}
                        <NavLink to={user ?'/' + user.username + '/boards' : '/'} className="main-nav-btn" activeClassName="active">
                            <span className="my-icon"><BsKanban /></span><span>Boards</span>
                        </NavLink>
                        <NavLink to={user ? '/' + user.username + '/boards': '/'} className="logo">
                            <h1>TaskFlow</h1>
                        </NavLink>
                        <NavLink onClick={handleLogout} to="/" className="main-navbar-nav-link"> Log out </NavLink>
                        < UserAvatar {...user} />
                    {/* </>} */}
                </nav>
                :
                <nav className="welcome-nav">
                    <NavLink to="/" className="logo">
                        <h1>TaskFlow</h1>
                    </NavLink>
                    <div>
                        <NavLink onClick={handleLogout} to="/" className="main-navbar-nav-link"> Log out </NavLink>
                        <NavLink to="/signup" className="wel-nav-link" >Signup</NavLink>
                        <NavLink to="/login" className="wel-nav-link" >Log In </NavLink>
                    </div>

                </nav>}
        </header>
    )
}

export default MainNav


