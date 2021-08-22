import React from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import  CheckBox  from '../../assets/checkbox';
import  Dropdown  from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';
export class AdminJobEligibility extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      id: props.match.params.jid,
      currentSteps:[],
      programs:[]
      }
    };
    componentDidMount = () =>{
      this.getSteps();
      this.getJob();
      this.getAllDetails();
    }
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
        axios.get('/backend/admin/jobs/'+this.state.id,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.jobDetails;
            let programs=this.state.programs;
            let index=0;
            programs.forEach((program, i) => {
              if((index<data.eligibilityCriteria.length) && (data.eligibilityCriteria[index].program===program.value))
              {
                program.isChecked=true;
                let jindex=0;
                program.courses.forEach((course, i) => {
                  if(jindex<data.eligibilityCriteria[index].course.length && course.value===data.eligibilityCriteria[index].course[jindex])
                  {
                    course.isChecked=true;
                    jindex+=1;
                  }
                });
                program.cpi=data.eligibilityCriteria[index].cpiCutOff;
                program.tenthMarks=data.eligibilityCriteria[index].tenthMarks;
                program.twelthMarks=data.eligibilityCriteria[index].twelthMarks;
                program.ctc=data.eligibilityCriteria[index].ctc;
                program.bachelorsMarks=data.eligibilityCriteria[index].bachelorsMarks;
                program.mastersMarks=data.eligibilityCriteria[index].mastersMarks;
                index+=1;
              }
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
    getSteps = ()=>{
      axios.get(`/backend/admin/jobs/stepsWithStatus/${this.state.id}`,{
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
        .then((response) => {
          const data = response.data.stepsWithStatus;
          this.setState({currentSteps:data});
          let steps = [];
          data.forEach((item, i) => {
            let status=false
            if(item.stepStatus==="Completed")status=true
            steps.push({value:item.stepName,isChecked:status})
          });
          this.setState({steps:steps})
        })
        .catch((e)=>{
          this.setState({
            redirect:"/error"
          })
        });
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
            ctc:program.ctc
          })
        }
      });
      let payload={
        eligibilityCriteria:eligibilityCriteria
      }
      axios({
        url: `/backend/admin/jobs/updateEligibilityCriteria/${this.state.id}`,
        method: 'patch',
        data: payload,
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
      .then((s)=>{
        this.setState({
          redirect:'/admin/job/'+this.state.id
        })
      })
      .catch((e)=>{
        alert("Could Not Edit Eligibility Criteria");
      })
    }
    handleChange = (event) =>
    {
      const target = event.target;
      const name = target.name;
      const value = target.value;
        this.setState({
          [name]:value
        })
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
    <button type="submit" className="btn btn-primary btn-block">Edit Job Eligibility</button>
  </form>
  <div className="container-fluid row mt-2">
    <div className="col-md-3"></div>
    <div className="col-md-3"></div>
    <div className="col-md-3"></div>
    <div className="col-md-3">
      <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/job/"+this.state.id}><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
    </div>
  </div>
    </div>
  );
  }
}
