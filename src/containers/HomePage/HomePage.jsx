import style from './HomePage.scss'
import { NavLink } from 'react-router-dom'
import Hero from 'assets/img/hero.svg'
const HomePage = () => {
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
        <div className={style.heroText}>
          <h1>TaskFlow helps teams work more collaboratively and get more done.</h1>
          <p>
            TaskFlow's boards, lists, and cards enable teams to organize and prioritize projects in a fun, flexible, and
            rewarding way.
          </p>
          <button className={(style.successBtn, 'successBtn')}>Start now!</button>
        </div>
        <Hero className={style.heroImg} />
      </section>
    </div>
  )
}

export default HomePage
