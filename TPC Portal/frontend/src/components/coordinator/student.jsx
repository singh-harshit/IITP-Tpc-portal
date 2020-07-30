import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import {Redirect} from 'react-router-dom';
export class CoordinatorStudent extends React.Component{

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
        {headerName: 'Company',field: 'jobId.companyName', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobId.jobTitle', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobId.jobCategory', sortable:true, filter:true},
        {headerName: 'Application Status',field: 'studentStatus', sortable:true, filter:true},
      ],
      columnDefs2: [
        {headerName: 'Company',field: 'companyName', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobCategory', sortable:true, filter:true},
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
    axios.get('/backend/coordinator/student/'+this.state.id,{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.studentInfo;
        const job = response.data;
        console.log('data',job);
        this.setState({
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
          image:data.image,
        });
        if(job.studentAppliedJobs.appliedJobs)
        {
          this.setState({rowData1:job.studentAppliedJobs.appliedJobs,})
        }
        if(job.studentEligibleJobs.eligibleJobs)
        {
          this.setState({rowData2:job.studentEligibleJobs.eligibleJobs,})
        }
      })
      .catch((e)=>{
        console.log('Error Retrieving data',e);
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
    console.log(this.state);
  };
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
                  Program
                </div>
                <div className="col-md-8">
                  : {this.state.program}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  course
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
          <div className="col-md-3"></div>
          <div className="col-md-3"></div>
          <div className="col-md-3">
          </div>
          <div className="col-md-3">
            <Link style={{ textDecoration: 'none', color: 'white' }} to="/coordinator/students/"><button type="button" class="btn btn-outline-dark btn-block m-1">Back</button></Link>
          </div>
        </div>
      </div>
    );
  }
}
