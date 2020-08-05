import React from 'react';
import { Switch, Route, withRouter } from "react-router-dom";

import HomePage from './pages/HomePage';
import MainNav from './components/MainNav';
import BoardDetails from './pages/BoardDetails';
import { BoardContextProvider } from './store/contexts/BoardContext';

function App() {
  return (
    <BoardContextProvider>
      <main>
        <MainNav />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/board" component={BoardDetails} />
        </Switch>
      </main>
    </BoardContextProvider>
  );
}

export default withRouter(App);
