import React, { Component } from "react";
import axios from "axios";

export class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studId: props.match.params.id,
      name: null,
      roll: null,
      schedules: [],
      eligibleJobsCount: 0,
    };
  }

  componentDidMount() {
    this.getStudentInfo();
  }

  getStudentInfo = () => {
    console.log("I am called!!!");
    // Get Roll Number and Name
    axios
      .get("/backend/student/profile/" + this.state.studId)
      .then((response) => {
        this.setState({
          roll: response.data.studentInfo.rollNo,
          name: response.data.studentInfo.name,
        });
        console.log(
          "[+] Roll No: ",
          this.state.roll,
          " Name: ",
          this.state.name
        );
      })
      .catch((error) => {
        console.log("Something happened!");
        console.log("[-] ", error);
      });

    // Get Applied Jobs for Displaying Schedules
    axios
      .get("/backend/student/applied/jobs/" + this.state.studId)
      .then((response) => {
        console.log(response.data);
        const jobsList = response.data.studentWithAppliedJobs.appliedJobs;
        console.log(jobsList);
        /* Extract ScheduleDate, JobTitle, CompanyName from above jobsList and store it in this.state.schedules */
      })
      .catch((error) => {
        console.log("[-] Error ", error);
      });

    // Get Eligible Jobs count
    axios
      .get("/backend/student/eligible/jobs/" + this.state.studId)
      .then((response) => {
        console.log(response.data);
      });
  };

  render() {
    /*
    To Be Displayed:
    ----------------

    Name: 
    Roll: 
    Schedules:
    EligibleJobs Count:
    */
    return <div className="AppliedJobs"></div>;
  }
}
