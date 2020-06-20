import React from "react";

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
              <li className="nav-item">
                <a className="nav-link" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Students</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Companies</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Jobs / Internship</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Requests</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Settings</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Backup</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
  );
  }
}
