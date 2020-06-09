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
      <div className="header bg-dark text-light">
        <h1>Training and Placement Cell</h1><br/>
        <h2>IIT Patna</h2>
      </div>
  );
  }
}
