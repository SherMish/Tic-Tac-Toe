import React from 'react';
import Join from './components/pages/Join/Join'
import Game from './components/pages/Game/Game'

import {BrowserRouter as Router, Route} from 'react-router-dom'

const App = () => {
    return (
        <Router>
          <Route path="/" exact component={Join} />
          <Route path="/game" component={Game} />
        </Router>
      );
    }

export default App;