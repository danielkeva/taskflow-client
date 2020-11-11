import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch } from 'react-redux';
import ProtectedRoute from './HOC/ProtectedRoute';
import HomePage from './pages/HomePage';
import MainNav from './components/MainNav';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import { getLoggedInUser } from './store/actions/userActions';
import NotFoundFallback from './components/NotFoundFallback';
import Spinner from './components/Spinner';
import { useLayoutEffect } from 'react';
import { socketService } from './services/socket.service';
// import BoardDetails from './pages/BoardDetails';

// import BoardsPage from './pages/BoardsPage';
const BoardDetails = lazy(() => import('./pages/BoardDetails'));
const BoardsPage = lazy(() => import('./pages/BoardsPage'));


function App() {
  const dispatch = useDispatch()


  useEffect(() => {
    const loadUser = async () => {
      await dispatch(getLoggedInUser())
    }
    loadUser()
  }, [dispatch])

  return (
    <main>
      <Router>
        <MainNav />
        {/* <Suspense fallback={<h1 style={{ paddingTop: '50px', fontSize: '100px' }}>Still Loading…</h1>}> */}
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/signup" component={SignUp} exact />
            <Route path="/login" component={LogIn} exact />
            {/* <Route path="/:userName/boards" component={BoardsPage}  /> */}

            <ProtectedRoute path="/:username/boards" component={BoardsPage} />
            {/* <Route path="/board/:boardId" component={BoardDetails} /> */}
            <ProtectedRoute path="/board/:boardId" component={BoardDetails} />
            <Route component={NotFoundFallback} />
          </Switch>
        </Suspense>
      </Router>
    </main>
  );
}

export default App;
