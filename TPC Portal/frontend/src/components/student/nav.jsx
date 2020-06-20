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
              <Link to="/student/register">
                <li className="nav-item nav-link">
                  Profile
                </li>
              </Link>
              <Link to="/student/appliedjobs">
                <li className="nav-item nav-link">
                  Jobs Applied
                </li>
              </Link>
              <Link to="/student/eligiblejobs">
                <li className="nav-item nav-link">
                  Eligible Jobs
                </li>
              </Link>
              <Link to="/student/requests">
                <li className="nav-item nav-link">
                  Requests
                </li>
              </Link>
                <Link to="/student/resume">
                <li className="nav-item nav-link">
                  Resume
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
