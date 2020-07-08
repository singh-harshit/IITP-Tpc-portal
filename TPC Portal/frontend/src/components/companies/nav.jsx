import React from "react";
import {Link} from "react-router-dom";
export class CompanyNavbar extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {

    }
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
              <Link className="nav-link" to="/company/register/">
                <li className="nav-item">
                  Profile
                </li>
              </Link>
              <Link className="nav-link" to='/company/jobs/'>
                <li className="nav-item">
                  Jobs
                </li>
              </Link>
              <Link className="nav-link" to="/company/requests/">
                <li className="nav-item ">
                   Requests
                </li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
