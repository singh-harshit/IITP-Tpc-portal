import React from "react";
import "./App.css";
import { Header } from "./components/header.jsx";

// Student imports
import { StudentRegister } from "./components/student/index.jsx";

// Company imports
import { CompanyRegister } from "./components/companies/index.jsx";
import { CompanyNavbar } from "./components/companies/index.jsx";

// Admin imports
import { StudentNavbar } from "./components/admin/index.jsx";
import { Home } from "./components/admin/index.jsx";
import { Admin_students } from "./components/admin/index.jsx";
import { Admin_companies } from "./components/admin/index.jsx";
import { Company } from "./components/admin/index.jsx";
import { Student } from "./components/admin/index.jsx";

function App() {
  return (
    <div className="App bg-light">
      <Header />
      <CompanyNavbar />
      <CompanyRegister />
    </div>
  );
}
export default App;
