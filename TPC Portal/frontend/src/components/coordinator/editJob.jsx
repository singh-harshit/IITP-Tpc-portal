import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import  CheckBox  from '../../assets/checkbox';
import  Dropdown  from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';
export class CoordinatorEditJob extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      jobId:props.match.params.jid,
      companyName:'',
      cName:'',
      programs: [],
      loading: true,
      schedule:[]
    }
  };
  componentDidMount = () =>{
    this.getCompany();
    this.getAllDetails();
    this.getJob();
  };
  getAllDetails = async () =>{
      this.setState({loading:true})
      await axios.get('/backend/allDetails')
        .then((response) => {
          const data = response.data;
          let programs = [];
          data.programAndCourses.forEach((item, i) => {
            let program = item.program;
            let courses = [];
            item.courses.forEach((course, i) => {
              courses.push({program:program,id:i,value:course,isChecked:false})
            });
            programs.push({id:item._id,value:program,isChecked:false,courses:courses,cpi:'',tenthMarks:'',twelthMarks:'',ctc:''});
          });
          this.setState({
            programs:programs,
            classifications:data.classifications,
            loading:false,
          })
        })
        .catch((e)=>{
          this.setState({
            redirect:"/error"
          })
        });
    };
    getJob = () =>{
        axios.get('/backend/coordinator/jobs/'+this.state.jobId,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.jobDetails;
            data.schedule.forEach((item, i) => {
              item.date=item.stepDate.split(",")[0];
              item.time=item.stepDate.split(",")[1];
            });

            this.setState(data);
            this.setState({
              cName:`${data.companyId},${data.companyName}`
            })
          })
          .catch((e)=>{
            this.setState({
              redirect:"/error"
            })
          });
      };
  getCompany = () =>{
    axios.get(`/backend/coordinator/approvedCompanies`,{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.approvedCompanies;
        this.handleCompanyList(data);
      })
      .catch((error)=>{

        this.setState({
          redirect:"/error"
        })
      });
  }
  handleChange = (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
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
  }
  handleCompanyList = (data) =>{
  const companyList = data.map((company,index) =>
    <option key={company._id} label={company.companyName} value={[company._id,company.companyName]}>{company.companyName}</option>
    )
    this.setState({
      companyList:companyList
    })
  }


  handleSubmit = async (event) =>{
    event.preventDefault();
    this.setState({loading:true});
    let date=this.state.date+','+this.state.time
    let payload={
      companyName:this.state.companyName,
      companyId:this.state.companyId,
      jobTitle:this.state.jobTitle,
      jobType:this.state.jobType,
      jobCategory:this.state.jobCategory,
      modeOfInterview:this.state.modeOfInterview,
      publicRemarks:this.state.publicRemarks,
      privateRemarks:this.state.privateRemarks,
      schedule:this.state.schedule
    }
    try {
      await axios({
        url: `/backend/coordinator/jobs/${this.state.jobId}`,
        method: 'patch',
        data: payload,
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
      .then( async(s)=>{
        const formData = new FormData();
        formData.append('resumeFiles',this.state.file);
        await this.setState({
          jid:s.data.jobId
        })
        await axios({
          url: `/backend/coordinator/jobs/jafFiles/${this.state.jobId}`,
          method: 'patch',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(s)
        {
          this.setState({
            redirect:'/coordinator/companies'
          })
        }
      })
    } catch (e) {
      alert("Update Error. Coordinator can edit job only when it is not approved");
    } finally {

    }

  }
  handleFile = (event) =>
  {
    let file = event.target.files[0];
    this.setState({
      file: file,
    });
  }
  handleSchedule = (event)=>{
    let stepName=event.target.name.split(",")[0];
    let name=event.target.name.split(",")[1];
    this.state.schedule.forEach((item, i) => {
      if(item.stepName===stepName){item[name]=event.target.value;
        item.stepDate=item.date+','+item.time;
      }
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
      </div>
      <div className="col-md-6 p-3">
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
      </div>
      <hr/>
      <div>Schedule</div><br/>
      <div className="col-md-12">
        {
          this.state.schedule.map((item)=>{
            return(
            <div className="col-md-12">
              <div className="row">
              <div className="col-md-4">{item.stepName}</div>
              <div className="col-md-4">
                <input
                  type="date"
                  name={item.stepName+",date"}
                  className="form-control"
                  value={item.date}
                  onChange={this.handleSchedule}
                  />
              </div>
              <div className="col-md-4">
                <input
                type="time"
                name={item.stepName+",time"}
                className="form-control"
                value={item.time}
                onChange={this.handleSchedule}
                />
              </div>
            </div>
            </div>)
          })
        }
      </div>
      <hr/>
      <button type="submit" className="btn btn-primary btn-block">Edit Job</button>
    </form>)}
      <div className="container-fluid row mt-2">
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/coordinator/companies/"}><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
