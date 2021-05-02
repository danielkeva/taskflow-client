import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import hero from '../assets/img/hero.svg'
import DemoCardList from '../components/DemoCardList';
const HomePage = () => {
    // const loggedInUser = useSelector(state => state.user.loggedInUser)
    // const history = useHistory()
    // useEffect(() => {
    //     const user = sessionStorage.getItem('user')
    //     console.log('user',user)
    //     if(user){
    //         window.location.href = `/${user.username}/boards`
    //     }
    // }, [])
    return (
        <div className='home-page'>
            <nav className='welcome-nav'>
                <NavLink to='/' className='logo'>
                    <h1>TaskFlow</h1>
                </NavLink>
                <div>
                    {/* <NavLink onClick={handleLogout} to='/' className='main-navbar-nav-link'> Log out </NavLink> */}
                    <NavLink to='/signup' className='wel-nav-link' >Signup</NavLink>
                    <NavLink to='/login' className='wel-nav-link' >Log In </NavLink>
                </div>
            </nav>
            <section className='hero'>
                <div className='container'>
                    <div className='hero-text'>
                        <h1>TaskFlow helps teams work more collaboratively and get more done.</h1>
                        <p>TaskFlow's boards, lists, and cards enable teams to organize and prioritize projects in a fun, flexible, and rewarding way.</p>
                        <button className='success-btn'>Start now!</button>
                    </div>
                    <img className='hero-img' src={hero} />
                </div>
            </section>
            <section className="demo-section">
                <div className="container">
                    <div className='section-text'>
                        <h3>Work with any team.</h3>
                        <p>Whether it’s for work, a side project or even the next family vacation, TaskFlow helps your team stay organized.</p>
                        <button className='success-btn'>Start now!</button>
                    </div>
                    <DemoCardList />
                </div>
            </section>
        </div>
    )
}

export default HomePage;