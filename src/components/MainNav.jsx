import React from 'react';
import { NavLink } from 'react-router-dom';
const MainNav = () => {
    return (
        <nav>
            <NavLink to="/" className="main-navbar-nav-link" exact activeClassName="active">
                Home </NavLink>  
                | <NavLink to="/boards" className="main-navbar-nav-link" exact activeClassName="active">
                Boards </NavLink>
        </nav>
        // <nav>
        //     <NavLink to="/" className="main-navbar-nav-link" exact activeClassName="active">
        //         Home </NavLink>  
        //         | <NavLink to="/board" className="main-navbar-nav-link" exact activeClassName="active">
        //         Board </NavLink>
        // </nav>
    )
}

export default MainNav