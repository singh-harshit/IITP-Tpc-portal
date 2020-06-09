import React from 'react';
import './App.css';
import {Header} from "./components/header.jsx";
import {Stud_nav} from "./components/student/index.jsx";
import {Register} from "./components/student/index.jsx";
import {Requests} from "./components/student/index.jsx";

function App() {
  return (
    <div className="App bg-light">
      <Header />
      <Stud_nav />
      <Requests />
    </div>
  );
}
export default App;
