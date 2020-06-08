import React from "react";

export class Register extends React.Component
{

  constructor(props)
  {
    super(props)

    this.state = {
      currSemester: '',
      sem: [],
      prog: '',
      mark:[]
    }
  }

  handlesem(n)
  {
    const name=['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8']
    const items = []
    for (var i = 1; i < n; i++) {
      items.push(
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor={name[i-1]}>Semester {i}</label>
          </div>
          <div className="col-md-9 p-1">
          <input type="number" name={name[i-1]} className="form-control" placeholder="Enter SGPA" required/>
          </div>
        </div>
      )
    }
    return(
      <div>
        {items}
      </div>
    )
  }

  handleCurrSemester = (event) => {
    let cur =event.target.value;
    this.setState({
      currSemester: cur,
      sem:this.handlesem(cur)
    })
  }

  handlemarks(prg)
  {
    const name=['CPI','10th Marks','12th Marks','Bachelor\'s Marks','Master\'s Marks']
    const items = []
    let n;
    if(prg=='BTech')n=3;
    else if(prg=='MTech'||prg=='Msc')n=4;
    else n=5;
    for (var i = 0; i < n; i++) {
      items.push(
        <div className="form-group row">
          <div className="col-md-3 p-1">
            <label htmlFor={name[i]}>{name[i]}:</label>
          </div>
          <div className="col-md-9 p-1">
          <input type="text" name={name[i]} className="form-control" placeholder="Enter Marks" required/>
          </div>
        </div>
      )
    }
    return(
      <div>
        {items}
      </div>
    )
  }

  handleProg = (event) => {
    let cur =event.target.value;
    this.setState({
      prog: cur,
      mark:this.handlemarks(cur)
    })
  }

  handleSubmit(event)
  {
    alert("your favorite ")
  }

  render()
  {
    const {currSemester,sem,prog,mark} = this.state;
    return(
      <div className="base-container">
        <section className="container-fluid">
          <section className="row justify-content-around m-1 p-1">
              <form action="#" className="form-inline" method="POST" encType="multipart/form-data">
                <div className="col-sm-6 p-3">

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="name">Name:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input type="text" name="name" className="form-control"placeholder="Enter Full Name" maxLength="300" required></input>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="rollno">RollNo / EMPID:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input type="text" name="rollno" className="form-control" placeholder="Enter Roll No / EMPID" maxLength="10" required></input>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="dob">Birthday:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input type="date" name="dob" required></input>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="phone">Phone No:</label>
                  </div>
                  <div className="col-md-9 p-1">
                  <input type="number" name="phone" className="form-control" placeholder="Enter Phone No" required/>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="Profile">Profile</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input name="file" type="file" className="form-control-file border"/>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="gender">Gender:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select className="form-control" name="gender" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="prog">Program:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select className="form-control" name="prog" value={prog} onChange={this.handleProg}required>
                      <option value="">Select</option>
                      <option value="BTech">B.Tech</option>
                      <option value="MTech">M.Tech</option>
                      <option value="Msc">M.Sc</option>
                      <option value="PhD">Phd</option>
                    </select>
                  </div>
                </div>
                {mark}
              </div>


              <div className="col-sm-6 p-3">
                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="email">Institute Email address:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input type="email" name="email" className="form-control" placeholder="Enter Webmail" required/>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="aemail">Alternate Email address:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <input type="email" name="aemail" className="form-control" placeholder="Enter email" required/>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="registerfor">Registering for:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select className="form-control" name="registerfor" required>
                      <option value="">Select</option>
                      <option value="FTE">FTE</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-3 p-1">
                    <label htmlFor="dept">Department:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select className="form-control" name="dept" required>
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
                    <label htmlFor="curr_semester">Current Semester:</label>
                  </div>
                  <div className="col-md-9 p-1">
                    <select className="form-control" name="currSemester" value={currSemester} onChange={this.handleCurrSemester} required>
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

                {sem}
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
