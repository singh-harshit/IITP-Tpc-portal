import React from "react";
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export class CoordinatorAddCompany extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      companyName:"",
      userName: "",
      password: "",
      companyAddress: "",
      name1: '',
      designation1: '',
      mailId1: '',
      mobileNumber1: '',
      name2: '',
      designation2:'',
      mailId2: '',
      mobileNumber2: '',
      name3: '',
      designation3: '',
      mailId3: '',
      mobileNumber3: '',
      redirect:''
    };
  }

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
          let contact1={
            name: this.state.name1,
            designation: this.state.designation1,
            mailId: this.state.mailId1,
            mobileNumber: this.state.mobileNumber1
          };
          let contact2={
            name: this.state.name2,
            designation: this.state.designation2,
            mailId: this.state.mailId2,
            mobileNumber: this.state.mobileNumber2
          };
          let contact3={
            name: this.state.name3,
            designation: this.state.designation3,
            mailId: this.state.mailId3,
            mobileNumber: this.state.mobileNumber3
          };
          let payload = {
            companyName:this.state.companyName,
            userName: this.state.userName,
            password: this.state.password,
            companyAddress: this.state.companyAddress,
            contact1: contact1,
            contact2: contact2,
            contact3: contact3
          };
          console.log(payload);
          axios({
            url: '/backend/coordinator/companies/addCompany',
            method: 'post',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then(() =>{
            console.log('data has been sent to server');
            this.setState({
              redirect:'/admin/companies'
            })
            this.resetUserInputs();
          })
          .catch(()=>{
            console.log('data error');
          });
      };

      resetUserInputs = () =>{
        this.setState({
            companyName:"",
            userName: "",
            password: "",
            companyAddress: "",
            name1: '',
            designation1: '',
            mailId1: '',
            mobileNumber1: '',
            name2: '',
            designation2:'',
            mailId2: '',
            mobileNumber3: '',
            name3: '',
            designation3: '',
            mailId3: '',
            mobileNumber3: ''
        });
      };
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container p-1">
        <section className="container-fluid border p-1 rounded border-success admin m-3">
          <form className="form" onSubmit = {this.handleSubmit} onChange={this.handleChange}>
            <div className="form-group row">
              <div className="col-md-3">
                <label htmlFor="companyName"><h3>Company Name:</h3></label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  name="companyName"
                  className="form-control"
                  placeholder="Enter Company Name"
                  maxLength="300"
                  value={this.state.companyName}
                  required
                  />
              </div>



              <div className="col-md-3">
                <div className="form-group row">
                  <div className="col-md-3 ">
                    <label htmlFor="userName">Username:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      name="userName"
                      className="form-control"
                      placeholder="Enter Username"
                      maxLength="300"
                      value={this.state.userName}
                      required
                      />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row">
                  <div className="col-md-3">
                    <label htmlFor="password">Password:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter Password"
                      maxLength="300"
                      value={this.state.password}
                      required
                      />
                  </div>
                </div>
              </div>
              <div className="col-md-6">

                <div className="form-group row">
                  <div className="col-md-3 ">
                    <label htmlFor="companyAddress">Company Address:</label>
                  </div>
                  <div className="col-md-9">
                    <input
                      type="text"
                      name="companyAddress"
                      className="form-control"
                      placeholder="Enter Address"
                      maxLength="300"
                      value={this.state.companyAddress}
                      required
                      />
                  </div>
                </div>
              </div>

            </div>




            <div className="border border-secondary rounded mr-3 m-1">
              <h5>Contact1:</h5>
              <div className="row justify-content-around">
                <div className="col-md-6">

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="name1">Name:</label>
                    </div>
                    <div className="col-md-9 ">
                      <input
                        type="text"
                        name="name1"
                        className="form-control"
                        placeholder="Enter Full Name"
                        maxLength="300"
                        value={this.state.name1}
                        required
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="designation1">Designation:</label>
                    </div>
                    <div className="col-md-9">
                    <input
                      type="text"
                      name="designation1"
                      className="form-control"
                      placeholder="Enter Designation"
                      maxLength="10"
                      value={this.state.designation1}
                      required
                      />
                    </div>
                  </div>

                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mailId1">Email Id:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="email"
                        name="mailId1"
                        className="form-control"
                        value={this.state.mailId1}
                        placeholder="Enter Email Id"
                        required
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mobileNumber1">Contact No:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="number"
                        name="mobileNumber1"
                        className="form-control"
                        value={this.state.mobileNumber1}
                        placeholder="Enter Contact No"
                        required
                        />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="border border-secondary rounded mr-3">
              <h5>Contact2:</h5>
              <div className="row justify-content-around p-1">
                <div className="col-md-6">

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="name2">Name:</label>
                    </div>
                    <div className="col-md-9 ">
                      <input
                        type="text"
                        name="name2"
                        className="form-control"
                        placeholder="Enter Full Name"
                        maxLength="300"
                        value={this.state.name2}
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="designation2">Designation:</label>
                    </div>
                    <div className="col-md-9">
                    <input
                      type="text"
                      name="designation2"
                      className="form-control"
                      placeholder="Enter Designation"
                      maxLength="10"
                      value={this.state.designation2}
                      />
                    </div>
                  </div>

                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mailId2">Email Id:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="email"
                        name="mailId2"
                        className="form-control"
                        value={this.state.mailId2}
                        placeholder="Enter Email Id"
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mobileNumber2">Contact No:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="number"
                        name="mobileNumber2"
                        className="form-control"
                        value={this.state.mobileNumber2}
                        placeholder="Enter Contact No"
                        />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="border border-secondary rounded mr-3 m-1">
              <h5 className="ml-3">Contact3:</h5>
              <div className="row justify-content-around p-1">
                <div className="col-md-6">

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="name3">Name:</label>
                    </div>
                    <div className="col-md-9 ">
                      <input
                        type="text"
                        name="name3"
                        className="form-control"
                        placeholder="Enter Full Name"
                        maxLength="300"
                        value={this.state.name3}
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3 ">
                      <label htmlFor="designation3">Designation:</label>
                    </div>
                    <div className="col-md-9">
                    <input
                      type="text"
                      name="designation3"
                      className="form-control"
                      placeholder="Enter Designation"
                      maxLength="10"
                      value={this.state.designation3}
                      />
                    </div>
                  </div>

                </div>

                <div className="col-md-6">
                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mailId3">Email Id:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="email"
                        name="mailId3"
                        className="form-control"
                        value={this.state.mailId3}
                        placeholder="Enter Email Id"
                        />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-3">
                      <label htmlFor="mobileNumber3">Contact No:</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        type="number"
                        name="mobileNumber3"
                        className="form-control"
                        value={this.state.mobileNumber3}
                        placeholder="Enter Contact No"
                        />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <button type="submit" className="btn btn-primary btn-block">Add Company</button>
          </form>
        </section>
      </div>
  );
  }
}
