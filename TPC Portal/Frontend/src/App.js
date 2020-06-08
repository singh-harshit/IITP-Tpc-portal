import React from 'react';
import './App.css';
import {Register} from "./components/student/index.jsx";
import {Stud_nav} from "./components/student/index.jsx";
import {Header} from "./components/header.jsx";
function App() {
  return (
    <div className="App">
      <Header />
      <Stud_nav />
      <Register />
    </div>
  );
}

export default App;
