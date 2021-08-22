import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import {Redirect} from 'react-router-dom';
import Dropdown from '../../assets/dropDown';
export class AdminStudent extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
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
      course:'',
      currentSemester:'',
      spi:[],
      cpi:'',
      tenthMarks: '',
      twelthMarks: '',
      bachelorsMarks: '',
      mastersMarks: '',
      approvalStatus: 'Nun',
      image:'',
      columnDefs1: [
        {headerName: 'Company',field: 'jobId.companyName', sortable:true, filter:true,cellRenderer: function(params){ return `<a href="https://iitp-tpc-portal.netlify.app/admin/job/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobId.jobTitle', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobId.jobCategory', sortable:true, filter:true},
        {headerName: 'Application Status',field: 'studentStatus', sortable:true, filter:true},
      ],
      columnDefs2: [
        {headerName: 'Company',field: 'companyName', sortable:true, filter:true,cellRenderer: function(params){ return `<a href="https://iitp-tpc-portal.netlify.app/admin/job/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobCategory', sortable:true, filter:true},
        {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
      ],
      rowData1: [],
      rowData2: [],
      newPassword:'',
      classifications:[],
  };
}
componentDidMount = () =>{
  this.getStudent();
  this.getAllDetails();
};
getAllDetails = () =>{
    axios.get('/backend/allDetails')
      .then((response) => {
        const data = response.data;
        this.setState({
          classifications:data.classifications,
        })
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
      });
  };
getStudent = () =>{
    axios.get('/backend/admin/student/'+this.state.id,{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.studentInfo;
        const job = response.data;
        this.setState({
          registrationFor:data.registrationFor,
          name:data.name,
          rollNo:data.rollNo,
          gender:data.gender,
          instituteEmail:data.instituteEmail,
          personalEmail:data.personalEmail,
          mobileNumber:data.mobileNumber,
          program:data.program,
          course:data.course,
          currentSemester:data.currentSemester,
          spi:Object.entries(data.spi),
          cpi:data.cpi,
          tenthMarks: data.tenthMarks,
          twelthMarks: data.twelthMarks,
          bachelorsMarks: data.bachelorsMarks,
          mastersMarks: data.mastersMarks,
          approvalStatus: data.approvalStatus,
          resumeFile: data.resumeFile,
          resumeLink:data.resumeLink,
          image:data.image,
          placementCategory:data.placement.category,
          placementStatus:data.placement.status,
        });
        if(job.studentAppliedJobs)
        {
          this.setState({rowData1:job.studentAppliedJobs.appliedJobs,})
        }
        if(job.studentEligibleJobs)
        {
          this.setState({rowData2:job.studentEligibleJobs.eligibleJobs,})
        }
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
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
    let payload = {
      newPassword:this.state.newPassword
    }
    axios({
      url: '/backend/admin/student/resetPassword/'+this.state.id,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      alert(e.data.message);
    })
    .catch(()=>{
      alert("Reset Password Failed");
    });
  };

  handleDeactivate = () =>{
    let payload;
    if(this.state.approvalStatus==="Active"){
    payload = {
      status: 'Deactivated'
    }}
    else {payload = {
      status: 'Active'
    }}
    axios({
      url: '/backend/admin/student/changeStatus/'+this.state.id,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      this.getStudent();
      alert(e.data.message);
    })
    .catch(()=>{
      alert("Change status failed");
    });
  }
  handlePlacement = (event)=>{
    event.preventDefault();
    let payload={
      status:this.state.placementStatus,
      category:this.state.placementCategory,
    }
    axios({
      url: '/backend/admin/student/placementStatus/'+this.state.id,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      this.getStudent();
      alert(e.data);
    })
    .catch(()=>{
      alert("Change Placement status failed");
    });
  }
  render()
  {

    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container admin border rounded border-success m-3">
        <p className="m-3 p-2">
          <div className="row">
            <div className="col-md-2">
              <img className="img-fluid rounded" src={
                  this.state.image==="Still Not Uploaded"?"https://pecb.com/conferences/wp-content/uploads/2017/10/no-profile-picture.jpg":this.state.image} alternate="hello"></img>
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
                  Registered For
                </div>
                <div className="col-md-8">
                  : {this.state.registrationFor}
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
                  Course
                </div>
                <div className="col-md-8">
                  : {this.state.course}
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
              <div className="row">
                <div className="col-md-4">
                  CPI
                </div>
                <div className="col-md-8">
                  : {this.state.cpi}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  SPI
                </div>
                <div className="col-md-8">
                  : {this.state.spi.map((sp)=>sp[1]+', ')}
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
                  Tenth Marks
                </div>
                <div className="col-md-8">
                  : {this.state.tenthMarks}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Twelfth Marks
                </div>
                <div className="col-md-8">
                  : {this.state.twelthMarks}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Bachelor's Marks
                </div>
                <div className="col-md-8">
                  : {this.state.bachelorsMarks}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Master's Marks
                </div>
                <div className="col-md-8">
                  : {this.state.mastersMarks}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Resume
                </div>
                <div className="col-md-8">
                  : {this.state.resumeFile?(<a href={this.state.resumeFile} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary btn-sm">Open</button></a>):"Not uploaded"}
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-md-4">
                  Resume Link:
                </div>
                <div className="col-md-8">
                  : {this.state.resumeFile?(<a href={this.state.resumeLink} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary btn-sm">Open</button></a>):"Not uploaded"}
                </div>
              </div>
            </div>
          </div>

        </p>
        <div className="border rounded border-success m-5 p-5">
          <form className="form" onChange={this.handleChange} onSubmit={this.handlePlacement}>
          <div className="row">
            <div className="col-md-3 mt-1">
              Placement Status: {this.state.placement}
            </div>
            <div className="col-md-3 mt-1">
              <select className="form-control" name="placementStatus" value={this.state.placementStatus}>
                <option value="">Select</option>
                <option value="Placed">Placed</option>
                <option value="Unplaced">Unplaced</option>
              </select>
            </div>
            <div className="col-md-3 mt-1">
              <select className="form-control" name="placementCategory" value={this.state.placementCategory}>
                <option value="">Select</option>
                {
                  this.state.classifications.map((element) =>{
                    return(<Dropdown value={element} name={element}/>)
                  })
                }
              </select>
            </div>
            <div className="col-md-3 mt-1">
              <button type="submit" className="btn btn-primary btn-block">Change</button>
            </div>
          </div>
          </form>
        </div>
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
            columnDefs = {this.state.columnDefs1}
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
            <Link style={{ textDecoration: 'none', color: 'white' }} to={`/admin/editStudent/${this.state.id}`}><button type="button" className="btn btn-success btn-block m-1">Edit Profile</button></Link>
          </div>
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
            <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDeactivate}>
              {this.state.approvalStatus==="Active"?"Deactivate":"Activate"}
            </button>
          </div>
          <div className="col-md-3">
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/admin/students/"><button type="button" className="btn btn-outline-dark btn-block m-1">Back</button></Link>
          </div>
        </div>
      </div>
    );
  }
}
