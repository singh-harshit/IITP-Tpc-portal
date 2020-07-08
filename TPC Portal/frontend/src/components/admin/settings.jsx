import React,{} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import Dropdown from '../../assets/dropDown';
export class AdminSettings extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      classification:'',
      guidelines:'',
      jobStatus:'',
      step:'',
      course:'',
      department:'',
      program:'',
      oldclassifications:[],
      oldguidelines:[],
      oldjobStatus:[],
      oldsteps:[],
      oldcourses:[],
      olddepartments:[],
      oldprograms:[],
      delclassification:'',
      delguidelines:'',
      deljobStatus:'',
      delstep:'',
      delcourse:'',
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
      axios.get('/backend/admin/allDetails')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
          this.setState({
            oldclassifications:data.classifications,
            oldjobStatus:data.status,
            oldsteps:data.steps,
            oldguidelines:data.guideLines,
            oldcourses:data.courses,
            olddepartments:data.departments,
            oldprograms:data.programs,
          })
        })
        .catch((e)=>{
          console.log('Error Retrieving data',e);
        });
    };
    getStatus = () =>{
        axios.get('/backend/admin/checkRegStatus')
          .then((response) => {
            const data = response.data;
            this.setState({
              regStatus:data.RegStatus
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
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
      handleDepartment = (event) =>{
        event.preventDefault();
        let departments=this.state.olddepartments;
        departments.push(this.state.department)
        let payload={
          departments:departments
        }
        this.sendData(payload,'departments','department');
      }
      handleDelDepartment = (event) =>{
        event.preventDefault();
        let departments=this.state.olddepartments;
        let del = this.state.deldepartment;
        let newDepartments=[];
        departments.forEach((item, i) => {
          if(item!==del)newDepartments.push(item);
        });

        let payload={
          departments:newDepartments
        }
        this.sendData(payload,'departments','deldepartment');
      }
      handleCourse = (event) =>{
        event.preventDefault();
        let courses=this.state.oldcourses;
        courses.push(this.state.course)
        let payload={
          courses:courses
        }
        this.sendData(payload,'courses','course');
      }
      handleDelCourse = (event) =>{
        event.preventDefault();
        let courses=this.state.oldcourses;
        let del = this.state.delcourse;
        let newCourses=[];
        courses.forEach((item, i) => {
          if(item!==del)newCourses.push(item);
        });

        let payload={
          courses:newCourses
        }
        this.sendData(payload,'courses','delcourse');
      }
      sendData = (payload,route,variable)=>{
        axios({
          url: `/backend/admin/${route}`,
          method: 'post',
          data: payload
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
        });
      }
  handleRegistration = () =>{
    axios({
      url: `/backend/admin/changeRegStatus`,
      method: 'patch',
    })
    .then((s) =>{
      console.log('data has been sent to server',s);
      alert(s.data.message);
      this.getStatus();
    })
    .catch((e)=>{
      console.log('data error',e);
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
        data: payload
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
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDepartment}>
          <div className="col-md-3">
            <label htmlFor="department" className="mr-sm-2">Add New Department:</label>
          </div>
          <div className="col-md-7">
            <input type="text" name="department" value={this.state.department} className="form-control mb-2 mr-sm-2" required placeholder="Enter New Department"/>
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
          <div className="col-md-7">
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
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
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
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
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
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
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
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
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
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelDepartment}>
          <div className="col-md-3">
            <label htmlFor="deldepartment"> Delete Departments:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="deldepartment" value={this.state.deldepartment} required>
              <option value="">Select</option>
              {
                this.state.olddepartments.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
          </div>
        </form>
      </div>
      <div className="container-fluid">
        <form className="form row" onChange={this.handleChange} onSubmit={this.handleDelCourse}>
          <div className="col-md-3">
            <label htmlFor="delcourse"> Delete Courses:</label>
          </div>
          <div className="col-md-7">
            <select className="form-control" name="delcourse" value={this.state.delcourse} required>
              <option value="">Select</option>
              {
                this.state.oldcourses.map((element) =>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary btn-block mb-2">Delete</button>
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
              this.state.regStatus ? 'Open ':'Close '
            }
            Student Registration</button>
        </div>
        <div className="col-md-4">
          <Popup trigger={<button type="button" className="btn btn-block btn-success m-1">Reset Admin Password</button>} position="top center"
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
