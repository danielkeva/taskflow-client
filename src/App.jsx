import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import MainNav from './components/MainNav';
// import BoardDetails from './pages/BoardDetails';

// import BoardsPage from './pages/BoardsPage';
const BoardDetails = lazy(() => import('./pages/BoardDetails'));
const BoardsPage = lazy(() => import('./pages/BoardsPage'));


function App() {
  return (
    <main>
        <Router>
          <MainNav />
          <Switch>
      <Suspense fallback={<h1 style={{ paddingTop: '50px', fontSize: '100px' }}>Still Loading…</h1>}>
            <Route path="/" component={HomePage} exact />
            <Route path="/boards" component={BoardsPage} exact />
            <Route path="/board/:boardId" component={BoardDetails}  />
      </Suspense>
          </Switch>
        </Router>
    </main>
  );
}

export default App;
