import React,{} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import Dropdown from '../assets/dropDown';
export class Login extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      id:props.id,
      userName:'',
      password:'',
      guideLines:[],
    };
    localStorage.removeItem('jwt');
    localStorage.removeItem('_id');
  }
  componentDidMount = () =>{
    this.getAllDetails();
  };
  getAllDetails = () =>{
      axios.get('/backend/allDetails')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
          this.setState({
            guideLines:data.guideLines
          })
        })
        .catch((e)=>{
          console.log('Error Retrieving data',e);
        });
    };
    handleChange = (event) =>
    {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({
        [name]:value
      })
      console.log(this.state);
    };
    handleSubmit = (event) =>
    {
      event.preventDefault();
      let payload={
        userName:this.state.userName,
        password:this.state.password
      }
      axios({
        url: `/backend/${this.state.accType}/login`,
        method: 'post',
        data: payload
      })
      .then((s) =>{
        console.log('data has been sent to server',s);
        if(s.data.approvalStatus)localStorage.setItem('approvalStatus',s.data.approvalStatus);
        localStorage.setItem('_id',s.data._id);
        localStorage.setItem('authToken',s.headers["x-auth-token"]);
        localStorage.setItem('refreshToken',s.headers["x-refresh-token"]);
        localStorage.setItem('role',this.state.accType);
        this.props.history.push(`/${this.state.accType}`);
      })
      .catch((error)=>{
        alert('data error',error);
      });
    }
  render()
  {
    console.log("props",this.props);
    return(
    <div className="base-container login">
      <div className="row">
        <div className="col-md-8 p-2">
          <div className="shadow m-3 p-3 mb-5 rounded">
            <h3>Guidelines: </h3>
            {
              this.state.guideLines.map((item) => <p>{item}</p>)
            }
          </div>
        </div>
        <div className="col-md-4">
          <div className="shadow p-5 login-form mr-3 text-dark d-flex flex-column">
            <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="accType">Account Type:</label>
                  <select name="accType"className="form-control" id="accType" value={this.state.accType}>
                    <option value=''>Select</option>
                    <option value="admin">Admin</option>
                    <option value="company">Company</option>
                    <option value="student">Student</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
              </div>
              <div className="form-group">
                <label for="username">Username:</label>
                <input type="text" name="userName" value={this.state.userName} className="form-control" placeholder="Enter Username/ Rollno." id="username"/>
              </div>
              <div className="form-group">
                <label for="pwd">Password:</label>
                <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" id="pwd"/>
              </div>
              <div className="form-group form-check">
                <label className="form-check-label">
                  <input className="form-check-input" type="checkbox"/> Remember me
                </label>
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <nav class="navbar navbar-light align-self-end mt-auto p-2">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <Link className="nav-link" to="/user-reset-password">
                    forgot password
                  </Link>
                </li>
                <li class="nav-item">
                  <Link className="nav-link" to="/register/student">
                      New Student Register
                  </Link>
                </li>
                <li class="nav-item">
                  <Link className="nav-link" to="/register/company">
                       New Company Register
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
  }
}
