import React from 'react';
import {BrowserRouter as Router,Switch,Route,Redirect} from 'react-router-dom';
import {Header} from "../components/header.jsx";
import {Login} from "../components/login.jsx";
import {UserResetPassword} from "../components/userResetPassword.jsx";
import {ResetPassword} from "../components/resetPassword.jsx";
import {ErrorPage} from "../components/error.jsx";
// Student imports
import {StudentRegister} from "../components/student/index.jsx"
import {StudentNavbar} from "../components/student/index.jsx";
import {StudentRequests} from "../components/student/index.jsx";
import {StudentAppliedJobs} from "../components/student/index.jsx";
import {StudentEligibleJobs} from "../components/student/index.jsx";
import {StudentResume} from "../components/student/index.jsx";
import {StudentProfile} from "../components/student";
import {StudentEditProfile} from "../components/student";
import {StudentEditCPI} from "../components/student";
import {StudentAllJobs} from "../components/student";
// Company imports
import {CompanyNavbar} from "../components/companies/index.jsx";
import {CompanyProfile} from "../components/companies";
import {CompanyRegister} from "../components/companies/index.jsx";
import {CompanyJobs} from "../components/companies/index.jsx";
import {CompanyRequests} from "../components/companies/index.jsx";
// Admin imports
import {AdminNavbar} from "../components/admin";
import {AdminHome} from "../components/admin";
import {AdminStudents} from "../components/admin";
import {AdminStudent} from "../components/admin";
import {AdminEditStudent} from "../components/admin";
import {AdminCompanies} from "../components/admin";
import {AdminCompany} from "../components/admin";
import {AdminAddCompany} from "../components/admin";
import {AdminEditCompany} from "../components/admin";
import {AdminJob} from "../components/admin";
import {AdminAddJob} from "../components/admin";
import {AdminEditJob} from "../components/admin";
import {AdminJobEligibility} from "../components/admin";
import {AdminJobAddStudent} from "../components/admin";
import {AdminJobMarkProgress} from "../components/admin";
import {AdminRequests} from "../components/admin";
import {AdminSettings} from "../components/admin";
import {AdminAssignCoordinators} from "../components/admin";
import {AdminBackup} from "../components/admin";

// Coordinator imports
import {CoordinatorNavbar} from "../components/coordinator";
import {CoordinatorHome} from "../components/coordinator";
import {CoordinatorStudents} from "../components/coordinator";
import {CoordinatorStudent} from "../components/coordinator";
import {CoordinatorCompanies} from "../components/coordinator";
import {CoordinatorCompany} from "../components/coordinator";
import {CoordinatorAddCompany} from "../components/coordinator";
import {CoordinatorEditCompany} from "../components/coordinator";
import {CoordinatorJob} from "../components/coordinator";
import {CoordinatorAddJob} from "../components/coordinator";
import {CoordinatorEditJob} from "../components/coordinator";
import {CoordinatorJobEligibility} from "../components/coordinator";
import {CoordinatorJobMarkProgress} from "../components/coordinator";

const ProtectedAdminRoute = ({component:Component, ...rest}) =>{
  return <Route {...rest} render={(props)=>{
    return localStorage.getItem('role')==='admin' ? <Component {...props}/> : <Redirect to="/"/>
  }}/>
}
const ProtectedStudentRoute = ({component:Component, ...rest}) =>{
  return <Route {...rest} render={(props)=>{
    return localStorage.getItem('role')==='student' ? <Component {...props}/> : <Redirect to="/"/>
  }}/>
}
const ProtectedCompanyRoute = ({component:Component, ...rest}) =>{
  return <Route {...rest} render={(props)=>{
    return localStorage.getItem('role')==='company' ? <Component {...props}/> : <Redirect to="/"/>
  }}/>
}
const ProtectedCoordinatorRoute = ({component:Component, ...rest}) =>{
  return <Route {...rest} render={(props)=>{
    return localStorage.getItem('role')==='coordinator' ? <Component {...props}/> : <Redirect to="/"/>
  }}/>
}
export default class RouterBlock extends React.Component{
  render(){
    return(
    <Router>
      <React.Fragment>
        <Route path="/" component = {Header} />
        <Route path="/user-reset-password" component = {UserResetPassword} />
        <Route path="/resetPassword/:token" component = {ResetPassword} />
        <Route path="/error" component = {ErrorPage} />
        <Route path="/" exact
          render = {(props) => <Login {...props} />}
        />
        {/*student routes*/}
        <ProtectedStudentRoute path="/student" component = {StudentNavbar} />
        <Route path="/register/student" component = {StudentRegister} />
        <Route path="/student" exact component = {StudentProfile} />
        <Route path="/student/editProfile" component = {StudentEditProfile} />
        <Route path="/student/editCPI" component = {StudentEditCPI} />
        <Route path="/student/appliedjobs" component = {StudentAppliedJobs} />
        <Route path="/student/eligiblejobs" component = {StudentEligibleJobs} />
        <Route path="/student/allJobs" component = {StudentAllJobs} />
        <Route path="/student/requests" component = {StudentRequests} />
        <Route path="/student/resume" component = {StudentResume} />
        {/* Company Routes**/}
        <ProtectedCompanyRoute path="/company" component = {CompanyNavbar}/>
        <Route path="/register/company" component = {CompanyRegister} />
        <Route path="/company" exact component = {CompanyProfile} />
        <Route path="/company/jobs" component = {CompanyJobs} />
        <Route path="/company/requests" component = {CompanyRequests} />
        {/* Admin Routes*/}
        <ProtectedAdminRoute path="/admin" component = {AdminNavbar} />
        <Route path="/admin" exact  component = {AdminHome} />
        <Route path="/admin/students" component = {AdminStudents} />
        <Route path="/admin/student/:sid" exact component = {AdminStudent} />
        <Route path="/admin/editStudent/:id" exact component = {AdminEditStudent} />
        <Route path="/admin/companies" component = {AdminCompanies} />
        <Route path="/admin/company/:cid" exact component = {AdminCompany} />
        <Route path="/admin/addCompany" component = {AdminAddCompany} />
        <Route path="/admin/editCompany/:cid" component = {AdminEditCompany} />
        <Route path="/admin/job/:jid" exact component = {AdminJob} />
        <Route path="/admin/job/eligibilityCriteria/:jid" exact component = {AdminJobEligibility} />
        <Route path="/admin/requests" component = {AdminRequests} />
        <Route path="/admin/addJob/" component = {AdminAddJob}/>
        <Route path="/admin/editJob/:jid" component = {AdminEditJob}/>
        <Route path="/admin/job/addStudent/:jid" component = {AdminJobAddStudent}/>
        <Route path="/admin/job/markProgress/:jid" component = {AdminJobMarkProgress}/>
        <Route path="/admin/settings" component = {AdminSettings}/>
        <Route path="/admin/assignCoordinator" component = {AdminAssignCoordinators}/>
        <Route path="/admin/backup" component = {AdminBackup}/>
          {/* Coordinator Routes*/}
          <ProtectedCoordinatorRoute path="/coordinator" component = {CoordinatorNavbar} />
          <Route path="/coordinator" exact  component = {CoordinatorHome} />
          <Route path="/coordinator/students" component = {CoordinatorStudents} />
          <Route path="/coordinator/student/:sid" exact component = {CoordinatorStudent} />
          <Route path="/coordinator/companies" component = {CoordinatorCompanies} />
          <Route path="/coordinator/company/:cid" exact component = {CoordinatorCompany} />
          <Route path="/coordinator/addCompany" component = {CoordinatorAddCompany} />
          <Route path="/coordinator/editCompany/:cid" component = {CoordinatorEditCompany} />
          <Route path="/coordinator/job/:jid" exact component = {CoordinatorJob} />
          <Route path="/coordinator/addJob/" component = {CoordinatorAddJob}/>
          <Route path="/coordinator/editJob/:jid" component = {CoordinatorEditJob}/>
          <Route path="/coordinator/job/eligibilityCriteria/:jid" exact component = {CoordinatorJobEligibility} />
          <Route path="/coordinator/job/markProgress/:jid" component = {CoordinatorJobMarkProgress}/>
      </React.Fragment>
    </Router>
  )}
}
