import React from 'react';
import {BrowserRouter as Router,Switch,Route,Redirect} from 'react-router-dom';
import {Header} from "../components/header.jsx";
import {Login} from "../components/login.jsx";
// Student imports
import {StudentRegister} from "../components/student/index.jsx"
import {StudentNavbar} from "../components/student/index.jsx";
import {StudentRequests} from "../components/student/index.jsx";
import {StudentAppliedJobs} from "../components/student/index.jsx";
import {StudentEligibleJobs} from "../components/student/index.jsx";
import {StudentResume} from "../components/student/index.jsx";
// Company imports
import {CompanyNavbar} from "../components/companies/index.jsx"
import {CompanyRegister} from "../components/companies/index.jsx"
import {CompanyJobs} from "../components/companies/index.jsx"
import {CompanyRequests} from "../components/companies/index.jsx"
// Admin imports
import {AdminNavbar} from "../components/admin";
import {AdminHome} from "../components/admin";
import {AdminStudents} from "../components/admin";
import {AdminStudent} from "../components/admin";
import {AdminCompanies} from "../components/admin";
import {AdminCompany} from "../components/admin";
import {AdminAddCompany} from "../components/admin";
import {AdminEditCompany} from "../components/admin";
import {AdminJob} from "../components/admin";
import {AdminAddJob} from "../components/admin";
import {AdminEditJob} from "../components/admin";
import {AdminJobAddStudent} from "../components/admin";
import {AdminJobMarkProgress} from "../components/admin"
import {AdminRequests} from "../components/admin";
import {AdminSettings} from "../components/admin";
import {AdminAssignCoordinators} from "../components/admin";
import {AdminBackup} from "../components/admin";


const ProtectedRoute = ({component:Component, ...rest}) =>{
  return <Route {...rest} render={(props)=>{
    return localStorage.getItem('jwt') ? <Component {...props}/> : <Redirect to="/"/>
  }}/>
}
export default class RouterBlock extends React.Component{
  render(){
    return(
    <Router>
      <React.Fragment>
        <Route path="/" component = {Header} />
        <Route path="/" exact
          render = {(props) => <Login {...props} />}
        />
        {/*student routes*/}
        <ProtectedRoute path="/student" component = {StudentNavbar} />
        <Route path="/register/student" component = {StudentRegister} />
        <Route path="/student/appliedjobs" component = {StudentAppliedJobs} />
        <Route path="/student/eligiblejobs" component = {StudentEligibleJobs} />
        <Route path="/student/requests" component = {StudentRequests} />
        <Route path="/student/resume" component = {StudentResume} />
        {/* Company Routes**/}
        <Route path="/company" component = {CompanyNavbar}/>
        <Route path="/company/register" component = {CompanyRegister} />
        <Route path="/company/jobs/:id" component = {CompanyJobs} />
        <Route path="/company/requests/:id" component = {CompanyRequests} />
        {/* Admin Routes*/}
        <ProtectedRoute path="/admin" component = {AdminNavbar} />
        <Route path="/admin" exact  component = {AdminHome} />
        <Route path="/admin/students" component = {AdminStudents} />
        <Route path="/admin/student/:sid" exact component = {AdminStudent} />
        <Route path="/admin/companies" component = {AdminCompanies} />
        <Route path="/admin/company/:cid" exact component = {AdminCompany} />
        <Route path="/admin/addCompany" component = {AdminAddCompany} />
        <Route path="/admin/editCompany/:cid" component = {AdminEditCompany} />
        <Route path="/admin/job/:jid" exact component = {AdminJob} />
        <Route path="/admin/requests" component = {AdminRequests} />
        <Route path="/admin/addJob/" component = {AdminAddJob}/>
        <Route path="/admin/editJob/:jid" component = {AdminEditJob}/>
        <Route path="/admin/job/addStudent/:jid" component = {AdminJobAddStudent}/>
        <Route path="/admin/job/markProgress/:jid" component = {AdminJobMarkProgress}/>
        <Route path="/admin/settings" component = {AdminSettings}/>
        <Route path="/admin/assignCoordinator" component = {AdminAssignCoordinators}/>
        <Route path="/admin/backup" component = {AdminBackup}/>
      </React.Fragment>
    </Router>
  )}
}
