import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from './pages/HomePage';
import MainNav from './components/MainNav';
import BoardDetails from './pages/BoardDetails';
// import { BoardContextProvider } from './store/contexts/BoardContext';
import BoardsPage from './pages/BoardsPage';
import { createBrowserHistory } from 'history';
// const history = createBrowserHistory()

function App() {
  // console.log('d',process.env)

  return (
    <main>
      <Router>
        <MainNav />
        <Switch>
          <Route path="/board/:boardId" component={BoardDetails} />
          <Route path="/boards" component={BoardsPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
     </main>
  );
}

export default App;
