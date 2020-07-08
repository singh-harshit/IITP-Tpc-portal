import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import  CheckBox  from '../../assets/checkbox';
import {Redirect} from 'react-router-dom';
export class AdminEditJob extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      id:props.match.params.jid,
      companyName:'',
      cName:'',
      programs: [
        {id: 1, value: "banana", isChecked: false},
        {id: 2, value: "apple", isChecked: false},
        {id: 3, value: "mango", isChecked: false},
        {id: 4, value: "grap", isChecked: false}
      ],
    }
  };
  componentDidMount = () =>{
    this.getCompany();
    this.getJob();
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
  getJob = () =>{
      axios.get('/backend/admin/jobs/'+this.state.id)
        .then((response) => {
          const data = response.data.jobDetails;
          console.log('job',data);
          this.setState(data);
          this.setState({
            cName:`${data.companyId},${data.companyName}`
          })
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

  handleAllChecked = (event) => {
    let programs = this.state.programs
    programs.forEach(program => program.isChecked = event.target.checked)
    this.setState({programs: programs})
  }

  handleCheckChildElement = (event) => {
    let programs = this.state.programs
    programs.forEach(program => {
       if (program.value === event.target.value)
          program.isChecked =  event.target.checked
    })
    this.setState({programs: programs})
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    let payload={
      companyName:this.state.companyName,
      companyId:this.state.companyId,
      jobTitle:this.state.jobTitle,
      jobType:this.state.jobType,
      jobCategory:this.state.jobCategory,
      modeOfInterview:'onCampus'
    }
    axios({
      url: `/backend/admin/jobs/${this.state.id}`,
      method: 'patch',
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
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
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
        <h5>Program</h5>
      <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall"/> Check / Uncheck All
        <ul>
        {
          this.state.programs.map((program) => {
            return (<CheckBox handleCheckChildElement={this.handleCheckChildElement}  {...program} />)
          })
        }
        </ul>
        <h5>Department</h5>
      <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall"/> Check / Uncheck All
        <ul>
        {
          this.state.programs.map((program) => {
            return (<CheckBox handleCheckChildElement={this.handleCheckChildElement}  {...program} />)
          })
        }
        </ul>
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor="cutoffCPI">Cutoff CPI:</label>
          </div>
          <div className="col-md-9 p-1">
            <input
              type="text"
              name="cutoffCPI"
              className="form-control"
              placeholder="Enter CPI"
              maxLength="300"
              value={this.state.cutoffCPI}
              />
          </div>
        </div>
      </div>
      <hr/>
      <button type="submit" className="btn btn-primary btn-block">Edit Job</button>
    </form>
    </div>
  );
  }
}
