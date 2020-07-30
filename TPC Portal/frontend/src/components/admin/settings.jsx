import React,{} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import Dropdown from '../../assets/dropDown';
export class AdminSettings extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      classification:'',
      guidelines:'',
      jobStatus:'',
      step:'',
      course:'',
      courseProgram:'',
      program:'',
      oldclassifications:[],
      oldguidelines:[],
      oldjobStatus:[],
      oldsteps:[],
      oldcourses:[],
      oldprograms:[],
      delclassification:'',
      delguidelines:'',
      deljobStatus:'',
      delstep:'',
      delcourse:'',
      delcourseProgram:'',
      deldepartment:'',
      delprogram:'',
      regStatus:true,
      passwordMatch:false,
      newPassword1:'',
      newPassword2:'',
    };
  }
  componentDidMount = () =>{
    this.getAllDetails();
    this.getStatus();
  };
  getAllDetails = () =>{
      axios.get('/backend/allDetails')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
          this.setState({
            oldclassifications:data.classifications,
            oldjobStatus:data.status,
            oldsteps:data.steps,
            oldguidelines:data.guideLines,
            oldcourses:data.programAndCourses,
            oldprograms:data.programs,
          })
        })
        .catch((e)=>{
          console.log('Error Retrieving data',e);
          this.setState({
            redirect:"/error"
          })
        });
    };
    getStatus = () =>{
        axios.get('/backend/checkRegStatus',{
        })
          .then((response) => {
            const data = response.data;
            this.setState({
              regStatus:data.regStatus
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
            this.setState({
              redirect:"/error"
            })
          });
      };
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
        console.log(this.state);
      };
      handleClassification = (event) =>{
        event.preventDefault();
        let classifications=this.state.oldclassifications;
        classifications.push(this.state.classification)
        let payload={
          classifications:classifications
        }
        this.sendData(payload,'classifications','classification');
      }
      handleDelClassification = (event) =>{
        event.preventDefault();
        let classifications=this.state.oldclassifications;
        let del = this.state.delclassification;
        let newClassifications=[];
        classifications.forEach((item, i) => {
          if(item!==del)newClassifications.push(item);
        });

        let payload={
          classifications:newClassifications
        }
        this.sendData(payload,'classifications','delclassification');
      }
      handleguidelines = (event) =>{
        event.preventDefault();
        let guidelines=this.state.oldguidelines;
        guidelines.push(this.state.guidelines)
        let payload={
          guideLines:guidelines
        }
        this.sendData(payload,'guidelines','guidelines');
      }
      handleDelguidelines = (event) =>{
        event.preventDefault();
        let guidelines=this.state.oldguidelines;
        let del = this.state.delguidelines;
        let newguidelines=[];
        guidelines.forEach((item, i) => {
          if(item!==del)newguidelines.push(item);
        });

        let payload={
          guideLines:newguidelines
        }
        this.sendData(payload,'guideLines','delguidelines');
      }
      handleJobStatus = (event) =>{
        event.preventDefault();
        let jobStatus=this.state.oldjobStatus;
        jobStatus.push(this.state.jobStatus)
        let payload={
          status:jobStatus
        }
        this.sendData(payload,'status','jobStatus');
      }
      handleDelJobStatus = (event) =>{
        event.preventDefault();
        let jobStatus=this.state.oldjobStatus;
        let del = this.state.deljobStatus;
        let newJobStatus=[];
        jobStatus.forEach((item, i) => {
          if(item!==del)newJobStatus.push(item);
        });

        let payload={
          status:newJobStatus
        }
        this.sendData(payload,'status','deljobStatus');
      }
      handleStep = (event) =>{
        event.preventDefault();
        let steps=this.state.oldsteps;
        steps.push(this.state.step)
        let payload={
          steps:steps
        }
        this.sendData(payload,'steps','step');
      }
      handleDelStep = (event) =>{
        event.preventDefault();
        let steps=this.state.oldsteps;
        let del = this.state.delstep;
        let newSteps=[];
        steps.forEach((item, i) => {
          if(item!==del)newSteps.push(item);
        });

        let payload={
          steps:newSteps
        }
        this.sendData(payload,'steps','delstep');
      }
      handleProgram = (event) =>{
        event.preventDefault();
        let programs=this.state.oldprograms;
        programs.push(this.state.program)
        let payload={
          programs:programs
        }
        this.sendData(payload,'programs','program');
      }
      handleDelProgram = (event) =>{
        event.preventDefault();
        let programs=this.state.oldprograms;
        let del = this.state.delprogram;
        let newPrograms=[];
        programs.forEach((item, i) => {
          if(item!==del)newPrograms.push(item);
        });

        let payload={
          programs:newPrograms
        }
        this.sendData(payload,'programs','delprogram');
      }
      handleCourse = (event) =>{
        event.preventDefault();
        let courses=this.state.oldcourses;
        let program = this.state.courseProgram;
        let course=this.state.course;
        let find=0;
        courses.forEach((item, i) => {
          if(item.program===program){item.courses.push(course);find=1;}
        });
        if(!find)
        {
          let newCourse=[]
          newCourse.push(course)
          let newProgram={
            program:program,
            courses:newCourse
          }
          courses.push(newProgram);
        }
        console.log("courses",courses);
        let payload={
          programsWithCourses:courses
        }
        this.setState({courseProgram :''});
        this.sendData(payload,'programAndCourses','course');
      }
      handleDelCourse = (event) =>{
        event.preventDefault();
        let programAndCourses=this.state.oldcourses;
        let del = this.state.delcourse;
        let delProgram = this.state.delcourseProgram;
        let newProgramAndCourses=[];
        programAndCourses.forEach((item, i) => {
          if(item.program!==delProgram)newProgramAndCourses.push(item);
          else {
            let newCourses = [];
            item.courses.forEach((course, i) => {
              if(course!==del)newCourses.push(course);
            });
            newProgramAndCourses.push({program:item.program,courses:newCourses});
          }
        });

        let payload={
          programsWithCourses:newProgramAndCourses
        }
        this.setState({delcourseProgram:''});
        this.sendData(payload,'programAndCourses','delcourse');
      }
      sendData = (payload,route,variable)=>{
        axios({
          url: `/backend/admin/${route}`,
          method: 'post',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then((s) =>{
          console.log('data has been sent to server',s);
          this.setState({
            [variable]:''
          })
          this.getAllDetails();
        })
        .catch((e)=>{
          console.log('data error',e,payload);
          alert("Error Occured");
        });
      }
  handleRegistration = () =>{
    axios({
      url: `/backend/admin/changeRegStatus`,
      method: 'patch',
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((s) =>{
      console.log('data has been sent to server',s);
      alert(s.data.message);
      this.getStatus();
    })
    .catch((e)=>{
      console.log('data error',e);
      alert("Request Error");
    });
  }
  handleAdminPasswordReset = (event) =>{
    event.preventDefault();
    if(this.state.passwordMatch)
    {
      let payload={
        oldPassword:this.state.oldPassword,
        newPassword:this.state.newPassword1
      }
      axios({
        url: `/backend/admin/resetPassword`,
        method: 'patch',
        data: payload,
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
      .then((s) =>{
        console.log('data has been sent to server',s);
        alert(s.data.message);
        this.setState({
          newPassword1:'',
          newPassword2:'',
          oldPassword:'',
          passwordMatch:false
        })
      })
      .catch((e)=>{
        console.log('data error',e);
        alert("Password Not Reset");
      });
    }
  }
  render()
  {
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleClassification}>
          <div className="col-md-3">
            <label htmlFor="classification" className="mr-sm-2">Add New Classification:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="classification" value={this.state.classification} className="form-control mb-2 mr-sm-2" required placeholder="Enter New Classification"/>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleguidelines}>
          <div className="col-md-3">
            <label htmlFor="guidelines" className="mr-sm-2">Add New guidelines:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="guidelines" value={this.state.guidelines} className="form-control mb-2 mr-sm-2" required placeholder="Enter New guidelines"/>
          </div>
          <div className="col-md-2">
          <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleJobStatus}>
          <div className="col-md-3">
            <label htmlFor="jobStatus" className="mr-sm-2">Add New JobStatus:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="jobStatus" value={this.state.jobStatus} className="form-control mb-2 mr-sm-2" required placeholder="Enter New JobStatus"/>
          </div>
          <div className="col-md-2">
          <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleStep}>
          <div className="col-md-3">
            <label htmlFor="step" className="mr-sm-2">Add New Step:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="step" value={this.state.step} className="form-control mb-2 mr-sm-2" required placeholder="Enter New Step"/>
          </div>
          <div className="col-md-2">
          <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleProgram}>
          <div className="col-md-3">
            <label htmlFor="program" className="mr-sm-2">Add New Program:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="program" value={this.state.program} className="form-control mb-2 mr-sm-2" required placeholder="Enter New Program"/>
          </div>
          <div className="col-md-2">
          <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleCourse}>
          <div className="col-md-3">
            <label htmlFor="course" className="mr-sm-2">Add New Course:</label>
          </div>
          <div className="col-md-2">
            <select className="form-control" name="courseProgram" value={this.state.courseProgram} required>
              <option value="">Select</option>
              {
                this.state.oldprograms.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-5">
            <input type="text" name="course" value={this.state.course} className="form-control mb-2 mr-sm-2" required placeholder="Enter New Course"/>
          </div>
          <div className="col-md-2">
          <button type="submit" className="btn btn-primary btn-block mb-2">Add</button>
          </div>
        </form>
      </div>
      <hr/>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelClassification}>
          <div className="col-md-3">
            <label htmlFor="delclassification"> Delete Classifications:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="delclassification" value={this.state.delclassification} required>
              <option value="">Select</option>
              {
                this.state.oldclassifications.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelguidelines}>
          <div className="col-md-3">
            <label htmlFor="delguidelines"> Delete guidelines:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="delguidelines" value={this.state.delguidelines} required>
              <option value="">Select</option>
              {
                this.state.oldguidelines.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelJobStatus}>
          <div className="col-md-3">
            <label htmlFor="deljobStatus"> Delete JobStatus:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="deljobStatus" value={this.state.deljobStatus} required>
              <option value="">Select</option>
              {
                this.state.oldjobStatus.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelStep}>
          <div className="col-md-3">
            <label htmlFor="delstep"> Delete Steps:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="delstep" value={this.state.delstep} required>
              <option value="">Select</option>
              {
                this.state.oldsteps.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelProgram}>
          <div className="col-md-3">
            <label htmlFor="delprogram"> Delete Programs:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="delprogram" value={this.state.delprogram} required>
              <option value="">Select</option>
              {
                this.state.oldprograms.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelCourse}>
          <div className="col-md-3">
            <label htmlFor="delcourse"> Delete Courses:</label>
          </div>
          <div className="col-md-2">
            <select className="form-control" name="delcourseProgram" value={this.state.delcourseProgram} required>
              <option value="">Select</option>
              {
                this.state.oldprograms.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-5">
            <select className="form-control" name="delcourse" value={this.state.delcourse} required>
              <option value="">Select</option>
              {
                this.state.oldcourses.map((element) =>{
                  if(element.program===this.state.delcourseProgram)
                  {
                    return element.courses.map((course)=>{
                      return(<Dropdown value={course} name={course}/>)
                    })
                  }
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <Popup trigger={
            <button type="button" className="btn btn-primary btn-block mb-2">Delete</button>}position="center"
              >{close => (
              <div className=" p-1">
                <a className="close" onClick={close}>&times;</a>
                  <button type="submit" className="btn btn-block btn-warning p-1 mt-1">Confirm</button>
              </div>
            )}
            </Popup>
          </div>
        </form>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-4">
          <Link style={{ textDecoration: 'none', color: 'white' }}to="/admin/assignCoordinator"><button type="button" className="btn btn-block btn-success m-1">Manage Coordinator</button></Link>
        </div>
        <div className="col-md-4">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleRegistration}>
            {
              this.state.regStatus===true ? 'Close ':'Open '
            }
            Student Registration</button>
        </div>
        <div className="col-md-4">
          <Popup trigger={<button type="button" className="btn btn-block btn-success m-1">Reset Admin Password</button>} position="center"
          >{close => (
            <div className=" p-1">
              <a className="close" onClick={close}>&times;</a>
              <form className="form" onSubmit = {this.handleAdminPasswordReset} onChange={this.handleChange}>
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
  );
  }
}
