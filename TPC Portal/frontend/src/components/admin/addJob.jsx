import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import  CheckBox  from '../../assets/checkbox';
import  Dropdown  from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';
export class AdminAddJob extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      companyName:'',
      cName:'',
      programs: [],
      loading: true,
    }
  };
  componentDidMount = () =>{
    this.getCompany();
    this.getAllDetails();
  };
  getAllDetails = async () =>{
      this.setState({loading:true})
      await axios.get('/backend/admin/allDetails')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
          const programs = [];
          const departments = [];
          const courses = []
          data.programs.forEach((item, i) => {
            programs.push({id:i+1,value:item,isChecked:false});
          });
          data.courses.forEach((item, i) => {
            courses.push({id:i+1,value:item,isChecked:false});
          });
          data.departments.forEach((item, i) => {
            departments.push({id:i+1,value:item,isChecked:false});
          });
          this.setState({
            programs:programs,
            courses:courses,
            departments:departments,
            classifications:data.classifications,
            loading:false,
          })
        })
        .catch((e)=>{
          console.log('Error Retrieving data',e);
        });
    };
  getCompany = () =>{
    axios.get(`/backend/admin/approvedCompanies`)
      .then((response) => {
        const data = response.data.approvedCompanies;
        this.handleCompanyList(data);
      })
      .catch((error)=>{
        console.log('Error Retrieving data',error);
      });
  }
  handleChange = (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(value);
    if(name==="companyName")
    {
      var list = value.split(',');
        this.setState({
          companyId:list[0],
          companyName:list[1],
          cName:value
        })
    }
    else{
      this.setState({
        [name]:value
      })
    }
    console.log(this.state);
  }
  handleCompanyList = (data) =>{
    console.log(data);
  const companyList = data.map((company,index) =>
    <option key={company._id} label={company.companyName} value={[company._id,company.companyName]}>{company.companyName}</option>
    )
    this.setState({
      companyList:companyList
    })
  }

  handleAllProgramsChecked = (event) => {
    let programs = this.state.programs
    programs.forEach(program => program.isChecked = event.target.checked)
    this.setState({programs: programs})
  }

  handleProgramsCheckChildElement = (event) => {
    let programs = this.state.programs
    programs.forEach(program => {
       if (program.value === event.target.value)
          program.isChecked =  event.target.checked
    })
    this.setState({programs: programs})
  }
  handleAllCoursesChecked = (event) => {
    let courses = this.state.courses
    courses.forEach(course => course.isChecked = event.target.checked)
    this.setState({courses: courses})
  }

  handleDepartmentsCheckChildElement = (event) => {
    let departments = this.state.departments
    departments.forEach(department => {
       if (department.value === event.target.value)
          department.isChecked =  event.target.checked
    })
    this.setState({departments: departments})
  }
  handleAllDepartmentsChecked = (event) => {
    let departments = this.state.departments
    departments.forEach(department => department.isChecked = event.target.checked)
    this.setState({departments: departments})
  }

  handleCoursesCheckChildElement = (event) => {
    let courses = this.state.courses
    courses.forEach(course => {
       if (course.value === event.target.value)
          course.isChecked =  event.target.checked
    })
    this.setState({courses: courses})
  }
  handleSubmit = async (event) =>{
    event.preventDefault();
    this.setState({loading:true});
    let courses = [];
    let departments = [];
    let programs = [];
    this.state.programs.forEach((item, i) => {
      if(item.isChecked)programs.push(item.value);
    });
    this.state.departments.forEach((item, i) => {
      if(item.isChecked)departments.push(item.value);
    });
    this.state.courses.forEach((item, i) => {
      if(item.isChecked)courses.push(item.value);
    });
    let eligibilityCriteria={
      department:departments,
      program:programs,
      course:courses
    }
    let payload={
      companyName:this.state.companyName,
      companyId:this.state.companyId,
      jobTitle:this.state.jobTitle,
      jobType:this.state.jobType,
      jobCategory:this.state.jobCategory,
      eligibilityCriteria:eligibilityCriteria,
      modeOfInterview:this.state.modeOfInterview,
      publicRemarks:this.state.publicRemarks,
      privateRemarks:this.state.privateRemarks
    }
    await axios({
      url: '/backend/admin/jobs/addJob',
      method: 'post',
      data: payload
    })
    .then(() =>{
      console.log('data has been sent to server');
      this.setState({
        redirect:'/admin/companies'
      })
    })
    .catch((error)=>{
      console.log('data error',error);
    });
  }
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      {
        this.state.loading ?
        (
          <div className="d-flex justify-content-center">
          <div className="spinner-grow text-success"></div>
          <div className="spinner-grow text-success"></div>
          <div className="spinner-grow text-success"></div>
          </div>
        )
        :(
      <form className="form row" onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div className="col-md-6 p-3">
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="companyName">Company:</label>
            </div>
            <div className="col-md-9 p-1">
              <select
                className="form-control"
                name="companyName"
                value={this.state.cName}
                required>
                <option value="">Select</option>
                {this.state.companyList}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="jobType">Registering for:</label>
            </div>
            <div className="col-md-9 p-1">
              <select
                className="form-control"
                name="jobType"
                value={this.state.jobType}

                required>
                <option value="">Select</option>
                <option value="FTE">FTE</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="modeOfInterview">Mode Of Interview:</label>
            </div>
            <div className="col-md-9 p-1">
              <select
                className="form-control"
                name="modeOfInterview"
                value={this.state.modeOfInterview}

                required>
                <option value="">Select</option>
                <option value="offCampus">Off Campus</option>
                <option value="onCampus">On Campus</option>
              </select>
            </div>
          </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="jobTitle">Job Title:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="jobTitle"
              className="form-control"
              placeholder="Enter job title"
              maxLength="300"
              value={this.state.jobTitle}

              required
              />
          </div>
        </div>

        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="jobCategory">Classification:</label>
          </div>
          <div className="col-md-9 p-1">
            <select
              className="form-control"
              name="jobCategory"
              value={this.state.jobCategory}
              required>
              <option value="">Select</option>
              {
                this.state.classifications.map((element)=>{
                  return(<Dropdown value={element} name={element}/>)
                })
              }
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="ctc">CTC:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="ctc"
              className="form-control"
              placeholder="Enter ctc"
              maxLength="300"
              value={this.state.ctc}
              />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="jafFiles" className='text-nowrap'>Enter JAF:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="file"
              name="jafFiles"
              className="form-control-file border"
              onChange={this.handleFile}
              />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="publicRemarks">Public Remarks:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="publicRemarks"
              className="form-control"
              placeholder="Enter Remark"
              maxLength="300"
              value={this.state.publicRemarks}
              />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="privateRemarks">Private Remarks:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="privateRemarks"
              className="form-control"
              placeholder="Enter Remark"
              maxLength="300"
              value={this.state.privateRemarks}
              />
          </div>
        </div>
      </div>
      <div className="col-md-6 p-3">
        <div className="row">
          <div className="col-md-4">
            <h5>Program</h5>
          <input type="checkbox" onClick={this.handleAllProgramsChecked}  value="checkedall"/> Check / Uncheck All
            <ul>
            {
              this.state.programs.map((program) => {
                return (<CheckBox handleCheckChildElement={this.handleProgramsCheckChildElement}  {...program} />)
              })
            }
            </ul>
          </div>
        <div className="col-md-4">
          <h5>Department</h5>
        <input type="checkbox" onClick={this.handleAllDepartmentsChecked}  value="checkedall"/> Check / Uncheck All
          <ul>
          {
            this.state.departments.map((department) => {
              return (<CheckBox handleCheckChildElement={this.handleDepartmentsCheckChildElement}  {...department} />)
            })
          }
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Courses</h5>
        <input type="checkbox" onClick={this.handleAllCoursesChecked}  value="checkedall"/> Check / Uncheck All
          <ul>
          {
            this.state.courses.map((course) => {
              return (<CheckBox handleCheckChildElement={this.handleCoursesCheckChildElement}  {...course} />)
            })
          }
          </ul>
        </div>
      </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="cpiCutOff">Cutoff CPI:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="cpiCutOff"
              className="form-control"
              placeholder="Enter CPI"
              maxLength="300"
              value={this.state.cpiCutOff}
              />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="tenthMarks">Tenth Marks:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="tenthMarks"
              className="form-control"
              placeholder="Enter Marks"
              maxLength="300"
              value={this.state.tenthMarks}
              />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="twelthMarks">Twelfth Marks:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="twelthMarks"
              className="form-control"
              placeholder="Enter Marks"
              maxLength="300"
              value={this.state.twelthMarks}
              />
          </div>
        </div>
      </div>
      <hr/>
      <button type="submit" className="btn btn-primary btn-block">Add Job</button>
    </form>)}
    </div>
  );
  }
}
