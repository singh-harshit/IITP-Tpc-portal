import React from "react";
import axios from 'axios';
import Dropdown from "../../assets/dropDown";
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
export class AdminEditStudent extends React.Component
{
    constructor(props){
      super(props);
    this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      id:props.match.params.id,
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
      twelthMarks: null,
      bachelorsMarks: '',
      mastersMarks: '',
      approvalStatus: 'Nun',
      file:'',
      loading:true,
      courses:[],
      programs:[]
    };
  }


    getDetails = () => {
      axios
        .get("/backend/admin/student/" + this.state.id,{
    				headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
    			})
        .then((response) => {
          const data = response.data.studentInfo;
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
            sem1:data.spi.sem1,
            sem2:data.spi.sem2,
            sem3:data.spi.sem3,
            sem4:data.spi.sem4,
            sem5:data.spi.sem5,
            sem6:data.spi.sem6,
            sem7:data.spi.sem7,
            cpi:data.cpi,
            tenthMarks: data.tenthMarks,
            twelthMarks: data.twelthMarks,
            bachelorsMarks: data.bachelorsMarks,
            mastersMarks: data.mastersMarks,
            approvalStatus: data.approvalStatus,
            file:data.image,
            rowData1:data.studentAppliedJobs,
            rowData2:data.studentEligibleJobs
          });
        })
        .catch(() => {
          this.setState({
            redirect:"/error"
          })
        });
    };
    componentDidMount = async() =>{
      this.getAllDetails();
      this.getDetails();
      this.setState({loading:false});
    };
    getAllDetails =  () =>{
        this.setState({loading:true})
         axios.get('/backend/allDetails')
          .then((response) => {
            const data = response.data;
            this.setState({
              programs:data.programs,
              courses:data.programAndCourses,
              loading:false,
            })
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
  }
  handleSubmit = (event) => {
        event.preventDefault();
        let spi = {
          sem1:this.state.sem1,
          sem2:this.state.sem2,
          sem3:this.state.sem3,
          sem4:this.state.sem4,
          sem5:this.state.sem5,
          sem6:this.state.sem6,
          sem7:this.state.sem7
        };
        if(!this.state.bachelorsMarks)this.state.bachelorsMarks=0;
        if(!this.state.mastersMarks)this.state.mastersMarks=0;
        let payload=({
          name:this.state.name,
          password:this.state.password,
          rollNo:this.state.rollNo.toUpperCase(),
          gender:this.state.gender,
          instituteEmail:this.state.instituteEmail,
          personalEmail:this.state.personalEmail,
          mobileNumber:this.state.mobileNumber,
          registrationFor:this.state.registrationFor,
          program:this.state.program,
          course:this.state.course,
          currentSemester:this.state.currentSemester,
          spi:spi,
          cpi:this.state.cpi,
          tenthMarks:this.state.tenthMarks,
          twelthMarks:this.state.twelthMarks,
          bachelorsMarks:this.state.bachelorsMarks,
          mastersMarks:this.state.mastersMarks,
          registrationFor:this.state.registrationFor,
        });
        axios.patch(`/backend/admin/student/${this.state.id}`,payload,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          this.setState({redirect:`/admin/student/${this.state.id}`})
        })
        .catch((e)=>{
        });
    };
  render()
  { if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container border rounded border-success admin">
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
        <section className="container-fluid">
          <section className="m-1 p-1 text-left">
              <form className="form row" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="col-md-6 p-5">
                  <div className="form-group row">
                    <div className="col-md-4 p-1">
                      <label htmlFor="name">Name:</label>
                    </div>
                    <div className="col-md-8 p-1">
                      <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter Full Name"
                      maxLength="300"
                      value={this.state.name}
                      required
                      />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="rollNo">RollNo:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="text"
                    name="rollNo"
                    className="form-control"
                    placeholder="Enter Roll No"
                    maxLength="10"
                    value={this.state.rollNo}
                    pattern="[0-9]{4}[A-Za-z]{2}[0-9]{2}"
                    required
                    />
                  </div>
                </div>


                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="mobileNumber">Phone No:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="mobileNumber"
                    className="form-control"
                    placeholder="Enter Phone No"
                    value={this.state.mobileNumber}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="gender">Gender:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="gender"
                      value={this.state.gender}
                      required>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="program">Program:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="program"
                      value={this.state.program}
                      required>
                      <option value="">Select</option>
                        {
                          this.state.programs.map((element) =>{
                            return(<Dropdown value={element} name={element}/>)
                          })
                        }
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="cpi">CPI:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="cpi"
                    className="form-control"
                    placeholder="Enter CPI"
                    value={this.state.cpi}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="tenthMarks">Tenth Marks :</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="tenthMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.tenthMarks}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="twelthMarks">Twelfth Marks:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="twelthMarks"
                    className="form-control"
                    placeholder="Enter percentage"
                    value={this.state.twelthMarks}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="bachelorsMarks">Bachelor's Marks</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="bachelorsMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.bachelorsMarks}

                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="mastersMarks">Master's Marks:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="mastersMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.mastersMarks}

                  />
                  </div>
                </div>

              </div>


              <div className="col-md-6 p-5">
                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="instituteEmail">Institute Email address:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <input
                      type="email"
                      name="instituteEmail"
                      className="form-control"
                      placeholder="Enter Webmail"
                      value={this.state.instituteEmail}

                      required
                      />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="personalEmail">Alternate Email address:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <input
                      type="email"
                      name="personalEmail"
                      className="form-control"
                      placeholder="Enter email"
                      value={this.state.personalEmail}
                      required/>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="registrationFor">Registering for:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="registrationFor"
                      value={this.state.registrationFor}

                      required>
                      <option value="">Select</option>
                      <option value="FTE">FTE</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="course">Course:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="course"
                      value={this.state.course}
                      required>
                      <option value="">Select</option>
                        {
                          this.state.courses.map((element) =>{
                            if(element.program===this.state.program)
                            {
                              return element.courses.map((course)=>
                              {
                                return(<Dropdown value={course} name={course}/>);
                              })
                            }
                          })
                        }
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="currentSemester">Current Semester:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="currentSemester"
                      value={this.state.currentSemester}
                      required>
                      <option value="">Select</option>
                      <option value="1">I</option>
                      <option value="2">II</option>
                      <option value="3">III</option>
                      <option value="4">IV</option>
                      <option value="5">V</option>
                      <option value="6">VI</option>
                      <option value="7">VII</option>
                      <option value="8">VIII</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem1" className='text-nowrap'>Sem 1:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="text"
                      name="sem1"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem1}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem2" className='text-nowrap'>Sem 2:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem2"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem2}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem3" className='text-nowrap'>Sem 3:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem3"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem3}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem4" className='text-nowrap'>Sem 4:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem4"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem4}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem5" className='text-nowrap'>Sem 5:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem5"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem5}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem6" className='text-nowrap'>Sem 6:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem6"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem6}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem7" className='text-nowrap'>Sem 7:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem7"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem7}
                      />
                  </div>
                </div>
              </div>
              <hr/>
              <div className="container-fluid row mt-2">
                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary btn-block">Edit Profile</button>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-3"></div>
                <div className="col-md-3">
                  <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/student/"+this.state.id}><button type="button" class="btn btn-outline-dark btn-block m-1">Back</button></Link>
                </div>
              </div>
            </form>
          </section>
        </section>)}
      </div>
  );
  }
}
