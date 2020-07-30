import React from "react";
import {Link} from "react-router-dom";
export class StudentNavbar extends React.Component
{
  constructor(props)
  {
    super(props);
  }
  render()
  {
    return(
        <div className="nav-flex bg-dark">
        <nav className="navbar navbar-expand-md navbar-dark">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav flex-column">
              <Link className="nav-link" to="/student">
                <li className="nav-item ">
                  Profile
                </li>
              </Link>
              { localStorage.getItem('approvalStatus')==="Active" ?(
                <div>
              <Link  className="nav-link" to="/student/appliedjobs">
                <li className="nav-item">
                  Jobs Applied
                </li>
              </Link>
              <Link  className="nav-link" to="/student/eligiblejobs">
                <li className="nav-item">
                  Eligible Jobs
                </li>
              </Link>
              <Link  className="nav-link" to="/student/requests">
                <li className="nav-item">
                  Requests
                </li>
              </Link>
              <Link  className="nav-link" to="/student/resume">
                <li className="nav-item">
                  Resume
                </li>
              </Link></div>):''}

              <Link  className="nav-link" to="/">
                <li className="nav-item">
                  <i class='fas fa-sign-out-alt'></i>Sign Out
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
