import React from "react";
import {Link} from "react-router-dom";

export class AdminNavbar extends React.Component
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
              <Link to="/admin/">
                <li className="nav-item nav-link">
                  Home
                </li>
              </Link>
              <Link to="/admin/students/">
                <li className="nav-item nav-link">
                  Students
                </li>
              </Link>
              <Link to="/admin/companies/">
                <li className="nav-item nav-link">
                  Companies
                </li>
              </Link>
              <Link to="/admin/jobs/">
                <li className="nav-item nav-link">
                  Jobs / Internship
                </li>
              </Link>
              <Link to="/admin/requests/">
                <li className="nav-item nav-link">
                  Requests
                </li>
              </Link>
              <Link to="/admin/settings/">
                <li className="nav-item nav-link">
                  Settings
                </li>
              </Link>
              <Link to="/admin/backup/">
                <li className="nav-item nav-link">
                  Backup
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
