import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
export class AdminStudent extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      id: props.match.params.sid,
      name:'',
      password:'',
      rollNo:'',
      gender:'',
      instituteEmail:'',
      personalEmail:'',
      mobileNumber:'',
      registrationFor:'',
      program:'',
      department:'',
      course:'',
      currentSemester:'',
      sem1: '',
      sem2: '',
      sem3: '',
      sem4: '',
      sem5: '',
      sem6: '',
      sem7: '',
      cpi:'',
      tenthMarks: '',
      twelthMarks: '',
      bachelorsMarks: '',
      mastersMarks: '',
      approvalStatus: 'Nun',
      image:'',
      columnDefs1: [
        {headerName: 'Company',field: 'company', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'job', sortable:true, filter:true},
        {headerName: 'Classification',field: 'classification', sortable:true, filter:true},
        {headerName: 'Attendance',field: 'attendance', sortable:true, filter:true},
        {headerName: 'Application Status',field: 'applicationStatus', sortable:true, filter:true},
      ],
      columnDefs2: [
        {headerName: 'Company',field: 'company', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'job', sortable:true, filter:true},
        {headerName: 'Classification',field: 'classification', sortable:true, filter:true},
        {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
      ],
      rowData1: [],
      rowData2: [],
      newPassword:''
  };
}
componentDidMount = () =>{
  this.getStudent();
};

getStudent = () =>{
    axios.get('/backend/admin/student/'+this.state.id)
      .then((response) => {
        const data = response.data.studentInfo;
        console.log('data',data);
        this.setState({
          name:data.name,
          rollNo:data.rollNo,
          gender:data.gender,
          instituteEmail:data.instituteEmail,
          personalEmail:data.personalEmail,
          mobileNumber:data.mobileNumber,
          program:data.program,
          department:data.department,
          currentSemester:data.currentSemester,
          sem1:data.spi.sem1,
          cpi:data.cpi,
          tenthMarks: data.tenthMarks,
          twelthMarks: data.twelthMarks,
          bachelorsMarks: data.bachelorsMarks,
          mastersMarks: data.mastersMarks,
          approvalStatus: data.approvalStatus,
          image:data.image,
          rowData1:data.studentAppliedJobs,
          rowData2:data.studentEligibleJobs
        });
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
    let payload = {
      newPassword:this.state.newPassword
    }
    axios({
      url: '/backend/admin/student/resetPassword/'+this.state.id,
      method: 'patch',
      data: payload
    })
    .then((e) =>{
      console.log('data has been sent to server');
      alert(e.data.message);
    })
    .catch(()=>{
      console.log('data error');
    });
  };

  handleDeactivate = () =>{
    let payload = {
      approvalStatus: 'Deactivated'
    }
    axios({
      url: '/backend/admin//student/changeStatus/'+this.state.id,
      method: 'patch',
      data: payload
    })
    .then((e) =>{
      console.log('data has been sent to server');
      this.getStudents();
      alert(e.data.message);
    })
    .catch(()=>{
      console.log('data error');
    });
  }
  render()
  {
    return(
      <div className="base-container admin border rounded border-success m-3">
        <p className="m-3 p-2">
          <div className="row">
            <div className="col-md-2">
              <img className="img-fluid rounded" src="https://i.pinimg.com/236x/0c/92/0d/0c920d58b210a74a75868df885160a5f--jon-snow-wolf-dire-wolf.jpg" alternate="hello"></img>
              <button type="button" className="btn btn-block btn-primary mt-2">{this.state.approvalStatus}</button>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  Name
                </div>
                <div className="col-md-8">
                  : {this.state.name}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Roll No
                </div>
                <div className="col-md-8">
                  : {this.state.rollNo}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Gender
                </div>
                <div className="col-md-8">
                  : {this.state.gender}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Program
                </div>
                <div className="col-md-8">
                  : {this.state.program}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Department
                </div>
                <div className="col-md-8">
                  : {this.state.department}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Semester
                </div>
                <div className="col-md-8">
                  : {this.state.currentSemester}
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  Institute Email
                </div>
                <div className="col-md-8">
                  : {this.state.instituteEmail}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Personal Email
                </div>
                <div className="col-md-8">
                  : {this.state.personalEmail}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Mobile Number
                </div>
                <div className="col-md-8">
                  : {this.state.mobileNumber}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  SPI
                </div>
                <div className="col-md-8">
                  : {this.state.sem1}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  CPI
                </div>
                <div className="col-md-8">
                  : {this.state.cpi}
                </div>
              </div>
            </div>
          </div>
        </p>
        <div className="container-fluid">
          <hr className="bg-dark"/>
          <h4>Application Details</h4>
          <div
            className="ag-theme-balham"
            style={{
              height:250
            }}
          >

          <AgGridReact
            columnDefs = {this.state.columnDefs}
            rowData = {this.state.rowData1}
            rowSelection = "multiple"
            onGridReady = {params => this.gridApi = params.api}

          />
          </div>
          <hr className="bg-dark"/>
          <h4 className="mt-2">Eligible Jobs</h4>
          <div
            className="ag-theme-balham"
            style={{
              height:250
            }}
          >

          <AgGridReact
            columnDefs = {this.state.columnDefs2}
            rowData = {this.state.rowData2}
            rowSelection = "multiple"
            onGridReady = {params => this.gridApi = params.api}

          />
          </div>
        </div>
        <div className="container-fluid row mt-2">
          <div className="col-md-3">
            <Popup trigger={
            <button type="button" className="btn btn-block btn-success m-1">Reset Password</button>}position="top center"
            >{close => (
            <div className=" p-1">
              <a className="close" onClick={close}>&times;</a>
              <form className="form" onSubmit = {this.handleSubmit} onChange={this.handleChange}>
                  <label htmlFor="newPassword">New Password:</label>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control"
                      placeholder="Enter Password"
                      maxLength="300"
                      value={this.state.newPassword}
                      required
                      />
                    <button type="submit" className="btn btn-block btn-primary p-1 mt-1">Confirm</button>
              </form>
            </div>)}
            </Popup>
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDeactivate}>Deactivate</button>
          </div>
          <div className="col-md-3"></div>
          <div className="col-md-3">
            <Link to="/admin/students/"><button type="button" class="btn btn-outline-dark btn-block m-1">Back</button></Link>
          </div>
        </div>
      </div>
    );
  }
}
