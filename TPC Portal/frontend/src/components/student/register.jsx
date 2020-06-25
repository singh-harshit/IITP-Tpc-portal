import React from "react";
import axios from 'axios';

export class StudentRegister extends React.Component
{

    state = {
      name:'',
      password:'',
      rollNo:'',
      gender:'',
      instituteEmail:'',
      personalEmail:'',
      mobileNumber:null,
      registrationFor:'',
      program:'',
      department:'',
      course:'',
      currentSemester:null,
      sem1: null,
      sem2: null,
      sem3: null,
      sem4: null,
      sem5: null,
      sem6: null,
      sem7: null,
      cpi:null,
      tenthMarks:null,
      twelthMarks:null,
      bachelorsMarks: null,
      mastersMarks:null,
      file:'',
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
  }

  handleFile = (event) =>
  {
    let file = event.target.files[0];
    console.log('uploaded:',file);
    this.setState({
      file: file,
    });
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
        const formData = new FormData();
        formData.append('name',this.state.name);
        formData.append('password',this.state.password);
        formData.append('rollNo',this.state.rollNo);
        formData.append('gender',this.state.gender);
        formData.append('instituteEmail',this.state.instituteEmail);
        formData.append('personalEmail',this.state.personalEmail);
        formData.append('mobileNumber',this.state.mobileNumber);
        formData.append('registrationFor',this.state.registrationFor);
        formData.append('program',this.state.program);
        formData.append('department',this.state.department);
        formData.append('course',this.state.course);
        formData.append('currentSemester',this.state.currentSemester);
        formData.append('spi',spi);
        formData.append('cpi',this.state.cpi);
        formData.append('tenthMarks',this.state.tenthMarks);
        formData.append('twelthMarks',this.state.tenthMarks);
        formData.append('bachelorsMarks',this.state.bachelorsMarks);
        formData.append('mastersMarks',this.state.mastersMarks);
        formData.append('image',this.state.file);
        console.log(formData);
        axios.post('/backend/student/registration/',formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() =>{
          console.log('data has been sent to server');

        })
        .catch((e)=>{
          console.log('data error',e);
        });
    };

  render()
  {
    return(
      <div className="base-container border rounded border-success m-3 admin">
        <section className="container-fluid">
          <section className="row justify-content-around m-1 p-1 text-left">
              <form className="form-inline" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="col-sm-6 p-3">

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="name">Name:</label>
                  </div>
                  <div className="col-md-9 p-1">
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
                  <div className="col-md-3 p-1">
                    <label htmlFor="rollNo">RollNo:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="text"
                    name="rollNo"
                    className="form-control"
                    placeholder="Enter Roll No"
                    maxLength="10"
                    value={this.state.rollNo}

                    required
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="password">set password:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={this.state.password}
                      required
                      />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="mobileNumber">Phone No:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="mobileNumber"
                    className="form-control"
                    placeholder="Enter Phone No"
                    value={this.state.mobileNumber}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="gender">Gender:</label>
                  </div>
                  <div className="col-md-9 p-1">
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
                  <div className="col-md-3 p-1">
                    <label htmlFor="program">Program:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select
                      className="form-control"
                      name="program"
                      value={this.state.program}
                      required>
                      <option value="">Select</option>
                      <option value="BTech">B.Tech</option>
                      <option value="MTech">M.Tech</option>
                      <option value="Msc">M.Sc</option>
                      <option value="PhD">Phd</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="cpi">CPI:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="cpi"
                    className="form-control"
                    placeholder="Enter CPI"
                    value={this.state.cpi}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="tenthMarks">Tenth Marks :</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="tenthMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.tenthMarks}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="twelthMarks">Twelfth Marks:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="twelthMarks"
                    className="form-control"
                    placeholder="Enter percentage"
                    value={this.state.twelthMarks}

                    required
                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="bachelorsMarks">Bachelor's Marks</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="bachelorsMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.bachelorsMarks}

                  />
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="mastersMarks">Master's Marks:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input
                    type="number"
                    name="mastersMarks"
                    className="form-control"
                    placeholder="Enter Percentage/CGPA"
                    value={this.state.mastersMarks}

                  />
                  </div>
                </div>

              </div>


              <div className="col-sm-6 p-3">
                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="instituteEmail">Institute Email address:</label>
                  </div>
                  <div className="col-md-9 p-1">
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
                  <div className="col-md-3 p-1">
                    <label htmlFor="personalEmail">Alternate Email address:</label>
                  </div>
                  <div className="col-md-9 p-1">
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
                  <div className="col-md-3 p-1">
                    <label htmlFor="registrationFor">Registering for:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select
                      className="form-control"
                      name="registrationFor"
                      value={this.state.registrationFor}

                      required>
                      <option value="">Select</option>
                      <option value="FTE">FTE</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="department">Department:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select
                      className="form-control"
                      name="department"
                      value={this.state.department}

                      required>
                      <option value="">Select</option>
                      <option value="CB">Chemical & Biochemical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                      <option value="CH">Chemistry</option>
                      <option value="CS">Computer Science & Engineering</option>
                      <option value="EE">Electrical Engineering</option>
                      <option value="HS">Humanities & Social Sciences</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="MM">Metallurgical & Materials Engineering</option>
                      <option value="MT">Maths</option>
                      <option value="PH">Physics</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="currentSemester">Current Semester:</label>
                  </div>
                  <div className="col-md-9 p-1">
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
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
                      type="number"
                      name="sem7"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem7}
                      />
                  </div>

                </div>
                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="" className='text-nowrap'>Enter Profile Pic:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input
                      type="file"
                      className="form-control-file border"
                      onChange={this.handleFile}
                      />
                  </div>
                </div>
              </div>
              <hr/>
              <button type="submit" className="btn btn-primary btn-block">Submit For Approval</button>
            </form>
          </section>
        </section>
      </div>
  );
  }
}
