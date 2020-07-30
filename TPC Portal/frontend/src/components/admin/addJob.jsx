import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import  CheckBox  from '../../assets/checkbox';
import  Dropdown  from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';
export class AdminAddJob extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
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
      await axios.get('/backend/allDetails')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
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
            redirect:'/error'
          })
        });
    };
  getCompany = () =>{
    axios.get(`/backend/admin/approvedCompanies`,{
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
          redirect:'/error'
        })
      });
  }
  handleChange = (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(event.value);
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

  handleCoursesCheckChildElement = (event) => {
    let programs=this.state.programs  ;
    let checkprogram=event.target.name;
    let checkcourse=event.target.value;
  //  console.log(checkprogram,checkcourse);
    programs.forEach((program, i) => {
      if(program.value===checkprogram)
      {
        program.courses.forEach((course, j) => {
          if(course.value===checkcourse)course.isChecked=event.target.checked;
        });

      }
    });
  }
  handleProgramChange = (event)=>{
    let target=event.target;
    console.log(target.value);
    let upprogram=target.name.split(',');
    let upfield=upprogram[1];
    upprogram=upprogram[0];
    let programs=this.state.programs;
    programs.forEach((program, i) => {
      if(program.value===upprogram){program[upfield]=target.value}
    });

  }
  handleSubmit = async (event) =>{
    event.preventDefault();
    this.setState({loading:true});
    let eligibilityCriteria = [];
    this.state.programs.forEach((program, i) => {
      if(program.isChecked)
      {
        let courses=[];
        program.courses.forEach((course, j) => {
          if(course.isChecked)courses.push(course.value)
        });
        eligibilityCriteria.push({
          program:program.value,
          course:courses,
          cpiCutOff:program.cpi,
          tenthMarks:program.tenthMarks,
          twelthMarks:program.twelthMarks,
          bachelorsMarks:program.bachelorsMarks?program.bachelorsMarks:0,
          mastersMarks:program.mastersMarks?program.mastersMarks:0,
          ctc:program.ctc,
        })
      }
    });
    let date=this.state.date+','+this.state.time
    let payload={
      companyName:this.state.companyName,
      companyId:this.state.companyId,
      jobTitle:this.state.jobTitle,
      jobType:this.state.jobType,
      jobCategory:this.state.jobCategory,
      eligibilityCriteria:eligibilityCriteria,
      modeOfInterview:this.state.modeOfInterview,
      publicRemarks:this.state.publicRemarks,
      privateRemarks:this.state.privateRemarks,
      schedule:{stepName:'Registration',stepDate:date}
    }
    try {
      await axios({
        url: '/backend/admin/jobs/addJob',
        method: 'post',
        data: payload,
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
      .then( async(s)=>{
        console.log('data has been sent to server');
        const formData = new FormData();
        formData.append('resumeFiles',this.state.file);
        await this.setState({
          jid:s.data.jobId
        })
        await axios({
          url: `/backend/admin/jobs/jafFiles/${this.state.jid}`,
          method: 'patch',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then((s)=>
        {
          this.setState({
            redirect:'/admin/companies'
          })
        })
        .catch((e)=>{
          alert("Job added JAF not added");
        })
      })
    } catch (e) {
      alert('Could Not Add job')
    } finally {

    }

  }
  handleFile = (event) =>
  {
    let file = event.target.files[0];
    console.log('uploaded:',file);
    this.setState({
      file: file,
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
            <label htmlFor="regDate">Last Registration Date:</label>
          </div>
          <div className="col-md-5 p-1">
            <input
              type="date"
              name="date"
              className="form-control"
              value={this.state.date}
              required
              />
          </div>
          <div className="col-md-4 p-1">
            <input
              type="time"
              name="time"
              className="form-control"
              value={this.state.time}
              required
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
      <div className="col-md-12 p-3">
        <h5>Eligibility Criteria</h5>
          <div className="col-md-4">
            <h5>Program</h5>
          <input type="checkbox" onClick={this.handleAllProgramsChecked}  value="checkedall"/> Select All
            <ul>
            {
              this.state.programs.map((program) => {
                return (<CheckBox handleCheckChildElement={this.handleProgramsCheckChildElement}  {...program} />)
              })
            }
            </ul>
          </div>
        <div className="row">
          {

            this.state.programs.map((program) => {
              if(program.isChecked)
              return (
                <div className='col-md-4 m-4 p-5 shadow border'>
                  <div className=" rounded">
                    <h5>{program.value} Courses:</h5>
                    {
                      program.courses.map((course) => {
                        return (<CheckBox handleCheckChildElement={this.handleCoursesCheckChildElement}  {...course} />)
                      })
                    }
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="cpiCutOff">Cutoff CPI:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="number"
                          name={program.value+",cpi"}
                          className="form-control"
                          placeholder="Enter CPI"
                          maxLength="300"
                          value={program.cpi}
                          onChange={this.handleProgramChange}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="tenthMarks">Minimum Tenth Marks:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="text"
                          name={program.value+",tenthMarks"}
                          className="form-control"
                          placeholder="Enter Marks"
                          maxLength="300"
                          onChange={this.handleProgramChange}
                          value={program.tenthMarks}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="">Minimum Twelfth Marks:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="number"
                          name={program.value+",twelthMarks"}
                          className="form-control"
                          placeholder="Enter Marks"
                          maxLength="300"
                          onChange={this.handleProgramChange}
                          value={program.twelthMarks}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="">Bachelor's Marks:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="number"
                          name={program.value+",bachelorsMarks"}
                          className="form-control"
                          placeholder="Enter Marks"
                          maxLength="300"
                          onChange={this.handleProgramChange}
                          value={program.bachelorsMarks}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="">Master's Marks:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="number"
                          name={program.value+",mastersMarks"}
                          className="form-control"
                          placeholder="Enter Marks"
                          maxLength="300"
                          onChange={this.handleProgramChange}
                          value={program.mastersMarks}
                          />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-md-3 p-1">
                        <label htmlFor="">CTC:</label>
                      </div>
                      <div className="col-md-9 p-1">
                        <input
                          type="text"
                          name={program.value+',ctc'}
                          className="form-control"
                          placeholder="Enter CTC"
                          maxLength="300"
                          onChange={this.handleProgramChange}
                          value={program.ctc}
                          />
                      </div>
                    </div>
                  </div>
                </div>
                )
            })
          }

        </div>
      </div>
      <hr/>
      <button type="submit" className="btn btn-primary btn-block">Add Job</button>
    </form>)}
      <div className="container-fluid row mt-2">
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/companies/"}><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
