import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch,Route} from 'react-router-dom';
import RouterBlock from "./routes/router";
function App() {
  return (
    <Router>
      <div className="App bg-light">
        <RouterBlock/>
      </div>
    </Router>
  );
}
export default App;
