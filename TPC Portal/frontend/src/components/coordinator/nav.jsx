import React from "react";
import {Link} from "react-router-dom";

export class CoordinatorNavbar extends React.Component
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
              <Link className = "nav-link" to="/coordinator/">
                <li className="nav-item">
                  Home
                </li>
              </Link>
              <Link className = "nav-link" to="/coordinator/students/">
                <li className="nav-item">
                  Students
                </li>
              </Link>
              <Link className = "nav-link" to="/coordinator/companies/">
                <li className="nav-item">
                  Companies
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
