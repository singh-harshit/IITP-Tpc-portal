import React from 'react';
import './App.css';
import {Register} from "./components/student/index.jsx";
import {Header} from "./components/header.jsx";
function App() {
  return (
    <div className="App">
      <Header />
      <Register />
    </div>
  );
}

export default App;
