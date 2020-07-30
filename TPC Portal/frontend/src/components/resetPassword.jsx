import React from "react";
import axios from "axios";
import {Redirect} from 'react-router-dom';

export class ResetPassword extends React.Component {
  constructor(props){
    super(props);
  this.state = {
    token: props.match.params.token,
    password1:'',
    password2:'',
    match:0,
  };
}
  handleChange = async (event) =>
  {
    console.log(this.state);
    const target = event.target;
    const name = target.name;
    const value = target.value;
    await this.setState({
      [name]:value
    })
    if(this.state.password1===this.state.password2&&this.state.password1!='')
    {
      this.setState({match:1});
    }
    else
    {
      this.setState({match:0});
    }
  }
  handleSubmit = (event)=>{
    event.preventDefault();
    if(this.state.match===1)
    {
      let payload={token:this.state.token,newPassword:this.state.password1}
      axios.patch("/backend/resetPassword",payload)
      .then((s)=>{
        this.setState({redirect:"/"})
      })
      .catch((e)=>{
        alert("Could not Reset Password.\n Consult Admin");
      });
    }
    else {
      alert("password do not match")
    }
  }
  render() {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="base-container register d-flex justify-content-center">
        <div className="shadow-lg border rounded border-dark p-5 m-4 text-light resetPassword" style={{
          background:"linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,1))",

        }}>
          <div className="">
            <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="password1">Password:</label>
                <input type="password" className="form-control" placeholder="Enter Password" id="password1" name="password1" value={this.state.password1} required/>
              </div>
              <div className="form-group">
                <label htmlFor="password2">Retype Password:</label>
                <input type="password" className="form-control" placeholder="Enter Password" id="password2" name="password2" value={this.state.password2} required/>
              </div>

              {
                this.state.match?<p className="text-success">"Password Match"</p>:<p className="text-danger">"Password Mismatch"</p>
              }
            <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    )};
}
