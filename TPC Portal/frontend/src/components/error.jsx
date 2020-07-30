import React,{} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
export class ErrorPage extends React.Component
{
  constructor(props){
    super(props);
  }
  render()
  {
    return(
    <div className="base-container register border rounded border-success m-3 p-3" style={{height:"75vh"}}>
      <h1>Error...<br/  >Something Went Wrong</h1><br/>
      <div className="col-md-2">
        <Link style={{ textDecoration: 'none', color: 'white' }} to="/"><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Login</button></Link>
      </div>
    </div>
  );
  }
}
