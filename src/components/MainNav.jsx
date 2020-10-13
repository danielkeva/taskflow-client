import React from 'react';
import { NavLink } from 'react-router-dom';
const MainNav = () => {
    return (
        <nav className="main-navbar">
            <NavLink to="/" className="main-navbar-nav-link" exact activeClassName="active">
                Home </NavLink>
                | <NavLink to="/boards" className="main-navbar-nav-link" exact activeClassName="active">
                Boards </NavLink>
        </nav>
    )
}

export default MainNav