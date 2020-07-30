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
              <Link className = "nav-link" to="/admin/">
                <li className="nav-item">
                  Home
                </li>
              </Link>
              <Link className = "nav-link" to="/admin/students/">
                <li className="nav-item">
                  Students
                </li>
              </Link>
              <Link className = "nav-link" to="/admin/companies/">
                <li className="nav-item">
                  Companies
                </li>
              </Link>
              <Link className = "nav-link" to="/admin/requests/">
                <li className="nav-item">
                  Requests
                </li>
              </Link>
              <Link className = "nav-link" to="/admin/settings/">
                <li className="nav-item">
                  Settings
                </li>
              </Link>
              <Link className = "nav-link" to="/admin/backup/">
                <li className="nav-item">
                  Backup
                </li>
              </Link>
              <Link  className="nav-link" to="/">
                <li className="nav-item">
                  <i className='fas fa-sign-out-alt'></i>Sign Out
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
