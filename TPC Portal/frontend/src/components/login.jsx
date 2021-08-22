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
    localStorage.removeItem('authToken');
    localStorage.removeItem('_id');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
  }
  componentDidMount = () =>{
    this.getAllDetails();
  };
  getAllDetails = () =>{
      axios.get('/backend/allDetails')
        .then((response) => {
          const data = response.data;
          this.setState({
            guideLines:data.guideLines
          })
        })
        .catch((e)=>{
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
    };
    handleSubmit = (event) =>
    {
      event.preventDefault();
      if(this.state.accType==="student")
      {

        if(this.state.userName.match(/\b[0-9]{4}[A-Za-z]{2}[0-9]{2}\b/));
        else {
          this.setState({
            alert:true,
            alertMessage:"Enter Valid RollNo as username"
          });
          setTimeout(() => {
            this.setState({alert:false});
          }, 3000);
          return;
        }
      }
      let payload={
        userName:this.state.accType==="admin"?this.state.userName:this.state.userName.toUpperCase(),
        password:this.state.password
      }
      axios({
        url: `/backend/${this.state.accType}/login`,
        method: 'post',
        data: payload
      })
      .then((s) =>{
        if(s.data.approvalStatus)localStorage.setItem('approvalStatus',s.data.approvalStatus);
        if(s.data.registrationFor)localStorage.setItem('registrationFor',s.data.registrationFor);
        localStorage.setItem('_id',s.data._id);
        localStorage.setItem('authToken',s.headers["x-auth-token"]);
        localStorage.setItem('refreshToken',s.headers["x-refresh-token"]);
        localStorage.setItem('role',this.state.accType);
        this.props.history.push(`/${this.state.accType}`);
      })
      .catch((error)=>{
        alert("Entered Wrong Password or Username");
      });
    }
  render()
  {
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
                <label htmlFor="accType">Account Type:</label>
                  <select name="accType"className="form-control" id="accType" value={this.state.accType} required>
                    <option value=''>Select</option>
                    <option value="admin">Admin</option>
                    <option value="company">Company</option>
                    <option value="student">Student</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:
                </label>

                <input type="text" name="userName" value={this.state.userName} className="form-control" placeholder="Enter Username(Roll No. for students)" id="username" required/>
                  {
                    this.state.alert===true?( <div>{this.state.alertMessage}</div>):(<div></div>)
                  }
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Password:</label>
                <input type="password" name="password" value={this.state.password} className="form-control" placeholder="Enter password" id="pwd" required/>
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <nav className="navbar navbar-light align-self-end mt-auto p-2">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/user-reset-password">
                    forgot password
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register/student">
                      New Student Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link disabled" to="/register/company">
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
