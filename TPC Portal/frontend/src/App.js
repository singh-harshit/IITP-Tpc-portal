import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch,Route} from 'react-router-dom';
import RouterBlock from "./routes/router"
import StackedColumnChart from"./views/column charts/Stacked Column Chart";
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
