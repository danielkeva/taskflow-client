import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import MainNav from './components/MainNav';
import BoardDetails from './pages/BoardDetails';
import { BoardContextProvider } from './store/contexts/BoardContext';
import TaskDetails from './pages/TaskDetails';

function App() {
  return (
    <BoardContextProvider>
      <main>
        <Router>
          <MainNav />
          <Switch>
            <Route  path="/board" component={BoardDetails} />
            <Route  path="/" component={HomePage} />
          </Switch>
        </Router>
      </main>
    </BoardContextProvider>
  );
}

export default App;
