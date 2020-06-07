import React from "react";

export class Header extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return(
      <div className="header">
        <img src="images/iitp_logo.png" alt=""></img>
        <h1><strong>Training and Placement Cell</strong></h1>
        <br></br>
        <h2>IIT Patna</h2>
      </div>
  );
  }
}
