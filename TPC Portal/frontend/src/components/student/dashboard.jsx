import React from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from "react-router-dom";
import Popup from "reactjs-popup";
export class StudentProfile extends React.Component {
  constructor(props){
    super(props);

  this.state = {
    refreshToken:localStorage.getItem('refreshToken'),
    authToken:localStorage.getItem('authToken'),
    _id:localStorage.getItem('_id'),
    name:'',
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
    columnDefs2: [
      {headerName: 'Company',field: 'companyName', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
      {headerName: 'Step Name',field: 'stepName'},
      {headerName: 'Step Date',field: 'stepDate', sortable:true, filter:true},
    ],
    rowData1:[],
    rowData2:[],
    oldPassword:'',
    newPassword1:'',
    newPassword2:'',
    passwordMatch:false,
    loading:true,
  };
}

  componentDidMount = () => {
    this.getDetails();
  };

  getDetails = async () => {
    this.setState({loading:true});
    await axios
      .get("/backend/student/profile/" + this.state._id,{
  				headers: {
  					'x-auth-token': this.state.authToken,
  					'x-refresh-token': this.state.refreshToken,
  				}
  			})
      .then((response) => {
        const data = response.data.studentInfo;
        this.setState({
          name:data.name,
          rollNo:data.rollNo,
          gender:data.gender,
          instituteEmail:data.instituteEmail,
          personalEmail:data.personalEmail,
          mobileNumber:data.mobileNumber,
          program:data.program,
          course:data.course,
          registrationFor:data.registrationFor,
          currentSemester:data.currentSemester,
          spi:Object.entries(data.spi),
          cpi:data.cpi,
          tenthMarks: data.tenthMarks,
          twelthMarks: data.twelthMarks,
          bachelorsMarks: data.bachelorsMarks,
          mastersMarks: data.mastersMarks,
          approvalStatus: data.approvalStatus,
          resumeFile:data.resumeFile,
          resumeLink:data.resumeLink,
          image:data.image,
        });
        if(localStorage.getItem('approvalStatus')!==this.state.approvalStatus){
          this.setState({
            redirect:'/'
          })
        }
        localStorage.setItem('rollNo',data.rollNo);
        if(localStorage.getItem('approvalStatus')==="Active")this.getHome();
      })
      .catch(() => {
        this.setState({
          redirect:"/error"
        })
      });
      this.setState({loading:false});
  };
  getHome = async ()=>{
    this.setState({loading:true});
    axios.get("/backend/student/home/" + this.state._id,{
  				headers: {
  					'x-auth-token': this.state.authToken,
  					'x-refresh-token': this.state.refreshToken,
  				}
  			})
        .then((response) => {
          const data = response.data;
          //data.studentJobs.appliedJobs.forEach((element)=>{element.jobId.process=element.jobId.schedule[element.jobId.schedule.length-1].stepName;})
          //data.studentJobs.appliedJobs.map((element)=>{element.jobId.deadline=element.jobId.schedule[element.jobId.schedule.length-1].stepDate;})
          this.setState({
            eligibleJobsCount:data.eligibleJobsCount,
            //rowData1:data.studentjobs.eligibleJobs,
            rowData2:data.upComingDates,
          })
        })
        .catch(() => {

        });
        this.setState({loading:false});
  }
  handleChange = async (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    await this.setState({
      [name]:value
    })
    if(this.state.newPassword1===this.state.newPassword2&&this.state.newPassword1!=='')
    {
      this.setState({
        passwordMatch:true
      })
    }
    else
    {
      this.setState({
        passwordMatch:false
      })
    }
  };
  handlePasswordReset = async (event) =>{
    event.preventDefault();
    this.setState({loading:true});
    if(this.state.passwordMatch)
    {
      let payload={
        oldPassword:this.state.oldPassword,
        newPassword:this.state.newPassword1
      }
      await axios({
        url: `/backend/student/reset-password/${this.state._id}`,
        method: 'patch',
        data: payload,
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
      .then((s) =>{
        alert(s.data.message);
        this.setState({
          newPassword1:'',
          newPassword2:'',
          oldPassword:'',
          passwordMatch:false
        })
        alert("Password Reset Successful. Sign out and login again");

      })
      .catch((e)=>{
        alert("Password Reset unsuccessful")
      });
    }
    this.setState({loading:false});
  };
  handleFile = (event) =>
  {
    let file = event.target.files[0];

    this.setState({
      file: file,
    });
  }
  handleSubmitImage = async (event)=>{
    event.preventDefault();
    this.setState({loading:true});
    const formData = new FormData();
    formData.append('image',this.state.file,this.state.rollNo+".jpeg");
    if(this.state.file.size>5242880)
    {
      alert("Enter Image less than 5MB")
    }
    else{
    await axios.post(`/backend/student/profile/pic/${this.state._id}`,formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
				'x-auth-token': this.state.authToken,
				'x-refresh-token': this.state.refreshToken,
      }
    })
    .then(() =>{
      this.getDetails();
      alert("profile Updated");
    })
    .catch((e)=>{
      alert("Profile Update Failed.")
    });
  }
    this.setState({loading:false});
  }
  render() {

    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
    <div className="base-container admin">
    {
      this.state.loading===true ?
      (
        <div className="d-flex justify-content-center">
        <div className="spinner-grow text-success"></div>
        <div className="spinner-grow text-success"></div>
        <div className="spinner-grow text-success"></div>
        </div>
      ):(
        <div>
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
          {
            this.state.approvalStatus==="Active"?
            (
              <div className="">
                <div className="col-md-4">
                  <h4>
                  <ul className="list-group list-group-flush">
        					  <li className="list-group-item d-flex justify-content-between align-items-center">Eligible Jobs - <span className="badge badge-primary badge-pill">{this.state.eligibleJobsCount}</span></li>
        					 </ul>
                 </h4>
                </div>
                <div className="col-md-12 mt-2 mb-2">
                  <h4>Upcoming Schedule -</h4>
                  <div
                    className="ag-theme-balham"
                    style={{
                      height:500,
                    }}
                    >
                    <AgGridReact
                      columnDefs = {this.state.columnDefs2}
                      rowData = {this.state.rowData2}
                      rowSelection = "multiple"
                      onGridReady = {params => this.gridApi = params.api}
                      onCellDoubleClicked={this.handleClick}
                      getRowHeight={this.state.getRowHeight}
                    />
                  </div>
                </div>
              </div>
            ):(
              <div className="d-flex flex-row-reverse">
                <div className="col-md-3">
                  <Link style={{ textDecoration: 'none', color: 'white' }} to={"/student/editProfile"}><button type="button" className="btn btn-outline-dark btn-block m-1">Edit Profile</button></Link>
                </div>
              </div>
            )
          }
          <div className="d-md-flex justify-content-around m-1">
            <div className="col-md-6">
            <form onSubmit={this.handleSubmitImage}>
            <div className="form-group row">
              <div className="col-md-3 p-1">
                <label htmlFor="file" className='text-nowrap'>Enter Profile Pic:</label>
              </div>
              <div className="col-md-6 p-1">
                <input
                  type="file"
                  name="file"
                  className="form-control-file border"
                  onChange={this.handleFile}
                  />
              </div>
              <div className="col-md-3 p-1"><button type="submit" className="btn btn-block btn-primary">Upload</button></div>
            </div>
          </form>
        </div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/student/editCPI/"}><button type="button" className="btn btn-primary btn-block m-1 col-md-12">Edit CPI/SPI</button></Link>
        </div>
          <div className="col-md-3">
            <Popup trigger={<button type="button" className="btn btn-block btn-primary m-1">Reset Password</button>} position="bottom center"
            >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                <form className="form" onSubmit = {this.handlePasswordReset} onChange={this.handleChange}>
                  <label htmlFor="oldPassword">Old Password:</label>
                  <input
                    type="password"
                    name="oldPassword"
                    className="form-control"
                    placeholder="Enter Password"
                    maxLength="300"
                    value={this.state.oldPassword}
                    required
                  />
                  <label htmlFor="newPassword1">New Password:</label>
                  <input
                    type="password"
                    name="newPassword1"
                    className="form-control"
                    placeholder="Enter Password"
                    maxLength="300"
                    value={this.state.newPassword1}
                    required
                  />
                  <label htmlFor="newPassword2">Enter Password Again:</label>
                  <input
                    type="password"
                    name="newPassword2"
                    className="form-control"
                    placeholder="Enter Password"
                    maxLength="300"
                    value={this.state.newPassword2}
                    required
                  />
                  {
                    this.state.passwordMatch ? <p className="text-success">Password match</p>:<p className="text-danger">Password do no match</p>
                  }
                  <button type="submit" className="btn btn-block btn-primary p-1 mt-1">Confirm</button>
                </form>
              </div>)}
            </Popup>
          </div>
        </div>
      </div>
      )
    }
    </div>
  )}
}
