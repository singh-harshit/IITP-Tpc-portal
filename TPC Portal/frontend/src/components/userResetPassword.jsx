import React from "react";
import axios from "axios";
import {Redirect} from 'react-router-dom';
export class UserResetPassword extends React.Component {
  state = {
    userName:'',
    role:'',
    loading:false
  }
  handleChange = async (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    await this.setState({
      [name]:value
    })
  }
  handleSubmit = async (event)=>{
    event.preventDefault();
    this.setState({
      loading:true,
    })
    let payload = {
      userName:this.state.userName,
      role:this.state.role,
    }
     await axios.post('/backend/forgotPassword',payload)
    .then((s)=>
    {
      this.setState({
        loading:false,
        redirect:"/",
      })
    })
    .catch((e)=>{
      alert(e);
    })
  }
  render() {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="base-container register d-flex justify-content-center">
        {this.state.loading===true?(
          <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success"></div>
          <div className="spinner-grow text-success"></div>
          <div className="spinner-grow text-success"></div>
          </div>
        ):(
        <div className="shadow-lg border rounded border-dark p-5 m-4 text-light resetPassword" style={{
          background:"linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,1))",

        }}>
          <div className="">
            <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="role">Account Type:</label>
                  <select name="role"className="form-control" id="role" value={this.state.role}>
                    <option value=''>Select</option>
                    <option value="Admin">Admin</option>
                    <option value="Company">Company</option>
                    <option value="Student">Student</option>
                    <option value="Coordinator">Coordinator</option>
                  </select>
              </div>
              <div className="form-group">
                <label htmlFor="userName">Username:</label>
                <input type="text" className="form-control" placeholder="Enter Username" id="userName" name="userName" value={this.state.userName} required/>
              </div>

              <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
          </div>
        </div>)}
      </div>
    )};
}
