import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import style from './HomePage.scss'
import { NavLink, useHistory } from 'react-router-dom'
import Hero from 'assets/img/hero.svg'
import DemoCardList from 'components/DemoCardList'
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
    <div className={style.homePage}>
      <nav className={style.welcomeNav}>
        <NavLink to="/" className={style.logo}>
          <h1>TaskFlow</h1>
        </NavLink>
        <div>
          {/* <NavLink onClick={handleLogout} to='/' className='main-navbar-nav-link'> Log out </NavLink> */}
          <NavLink to="/signup" className={style.welNavLink}>
            Signup
          </NavLink>
          <NavLink to="/login" className={style.welNavLink}>
            Log In
          </NavLink>
        </div>
      </nav>
      <section className={style.hero}>
        <div className={style.container}>
          <div className={style.heroText}>
            <h1>TaskFlow helps teams work more collaboratively and get more done.</h1>
            <p>
              TaskFlow's boards, lists, and cards enable teams to organize and prioritize projects in a fun, flexible,
              and rewarding way.
            </p>
            <button className={style.successBtn}>Start now!</button>
          </div>
          <Hero className={style.heroImg} />
        </div>
      </section>
      <section className={style.demoSection}>
        <div className={style.container}>
          <div className={style.sectionText}>
            <h3>Work with any team.</h3>
            <p>
              Whether it’s for work, a side project or even the next family vacation, TaskFlow helps your team stay
              organized.
            </p>
            <button className={style.successBtn}>Start now!</button>
          </div>
          <DemoCardList />
        </div>
      </section>
    </div>
  )
}

export default HomePage
