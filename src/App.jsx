import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ProtectedRoute from './HOC/ProtectedRoute'
import HomePage from './pages/HomePage'
import MainNav from './components/MainNav'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import { getLoggedInUser } from './store/actions/userActions'
import NotFoundFallback from './components/NotFoundFallback'
import Spinner from './components/Spinner'
import GuestRoute from './HOC/GuestRoute'
// import BoardDetails from './pages/BoardDetails';

// import BoardsPage from './pages/BoardsPage';
const BoardDetails = lazy(() => import('./pages/BoardDetails'))
const BoardsPage = lazy(() => import('./pages/BoardsPage'))

const USER_KEY = 'user'
function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadUser = async () => {
      if (!sessionStorage.getItem(USER_KEY)) {
        await dispatch(getLoggedInUser())
      }
    }
    loadUser()
  }, [dispatch])
  return (
    <main>
      <Router>
        <MainNav />
        <Suspense fallback={<Spinner />}>
          <Switch>
            <GuestRoute path="/" component={HomePage} exact />
            {/* <Route path='/' component={HomePage} exact /> */}
            <Route path="/signup" component={SignUp} exact />
            <Route path="/login" component={LogIn} exact />
            {/* <Route path="/:userName/boards" component={BoardsPage}  /> */}
            <ProtectedRoute exact path="/:username/boards" component={BoardsPage} />
            {/* <Route path="/board/:boardId" component={BoardDetails} /> */}
            <ProtectedRoute path="/board/:boardId" component={BoardDetails} />
            <Route component={NotFoundFallback} />
          </Switch>
        </Suspense>
      </Router>
    </main>
  )
}

export default App
