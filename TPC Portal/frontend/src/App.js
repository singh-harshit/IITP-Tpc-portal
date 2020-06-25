import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./components/header.jsx";

// Student imports
import { StudentRegister } from "./components/student/index.jsx";
import { StudentNavbar } from "./components/student/index.jsx";
import { StudentRequests } from "./components/student/index.jsx";
import { StudentAppliedJobs } from "./components/student/index.jsx";
import { StudentEligibleJobs } from "./components/student/index.jsx";
import { StudentResume } from "./components/student/index.jsx";
// Company imports
import { CompanyNavbar } from "./components/companies/index.jsx";
import { CompanyRegister } from "./components/companies/index.jsx";
import { CompanyJobs } from "./components/companies/index.jsx";
import { CompanyRequests } from "./components/companies/index.jsx";
// Admin imports
import { AdminNavbar } from "./components/admin/index.jsx";
import { AdminHome } from "./components/admin/index.jsx";
import { AdminStudents } from "./components/admin/index.jsx";
import { AdminCompanies } from "./components/admin/index.jsx";
import { AdminCompany } from "./components/admin/index.jsx";
import { AdminStudent } from "./components/admin/index.jsx";

function App() {
  return (
    <Router>
      <div className="App bg-light">
        <Route path="/" component={Header} />
        {/* student routes */}
        <Route path="/student" component={StudentNavbar} />
        <Route path="/student/register" component={StudentRegister} />
        <Route path="/student/appliedjobs/:id" component={StudentAppliedJobs} />
        <Route
          path="/student/eligiblejobs/:id"
          component={StudentEligibleJobs}
        />
        <Route path="/student/requests/:id" component={StudentRequests} />
        <Route path="/student/resume/:id" component={StudentResume} />
        {/* Company Routes**/}
        <Route path="/company" component={CompanyNavbar} />
        <Route path="/company/register" component={CompanyRegister} />
        <Route path="/company/jobs/:id" component={CompanyJobs} />
        <Route path="/company/requests/:id" component={CompanyRequests} />
        {/* Admin Routes*/}
        <Route path="/admin" component = {AdminNavbar} />
        <Route path="/admin"exact  component = {AdminHome} />
        <Route path="/admin/students" component = {AdminStudents} />
        <Route path="/admin/student/:sid" exact component = {AdminStudent} />
        <Route path="/admin/companies" component = {AdminCompanies} />
        <Route path="/admin/company/:cid" exact component = {AdminCompany} />
        <Route path="/admin/addCompany" component = {AdminAddCompany} />
        <Route path="/admin/job/:jid" component = {AdminJob} />
        <Route path="/admin/requests" component = {AdminRequests} />
      </div>
    </Router>
  );
}
export default App;
