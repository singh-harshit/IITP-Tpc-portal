import React from "react";
import axios from "axios";
import "./Table.css";

class JobsTable extends React.Component {
  state = {
    studId: "5edd3dab78d3a45b97471400",
    rawData: null,
    jsonDataForTable: [],
  };

  constructor() {
    super();
    this.getKeys = this.getKeys.bind(this);
    this.getHeaders = this.getHeaders.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
  }

  // Fetching Data and Making json for table
  componentDidMount() {
    this.getStudentInfo();
  }

  getStudentInfo = () => {
    axios
      .get("/student/applied/jobs/" + this.state.studId)
      .then((response) => {
        const data = response.data.studentWithAppliedJobs.appliedJobs;
        this.setState({
          rawData: data,
        });
        console.log("Student Job List Received!!");
        console.log(this.state.rawData);
        console.log(response.data);
        console.log(data);

        const jsonData = this.dataToJson(data);

        this.setState({
          jsonDataForTable: jsonData,
        });

        console.log("Converted Data: ", jsonData);
        console.log("COnverted Data: ", this.state.jsonDataForTable);
      })
      .catch((error) =>
        console.log("Error receiving in Student Job List", error)
      );
  };

  dataToJson = (jobsList) => {
    let jsonData = [];
    for (let i = 0; i < jobsList.length; i++) {
      let jsonDataObject = {
        SNo: i + 1,
        company: jobsList[i].jobId.companyName,
        title: jobsList[i].jobId.jobTitle,
        classification: jobsList[i].jobId.jobCategory,
        schedule: jobsList[i].jobId.schedule.ppt,
        status: jobsList[i].jobStatus,
      };

      jsonData.push(jsonDataObject);
    }
    return jsonData;
  };

  // Creating Table

  getKeys = function () {
    return Object.keys(this.state.jsonDataForTable);
  };

  getHeaders = function () {
    let headers = [
      "S.No",
      "Company",
      "Title",
      "Classification",
      "Schedule",
      "Status",
    ];
    return headers.map((key, index) => {
      return <th key={key}>{key.toUpperCase()}</th>;
    });
  };

  getRowsData = function () {
    return this.state.jsonDataForTable.map((info, index) => {
      const { SNo, company, title, classification, schedule, status } = info;
      return (
        <tr key={SNo}>
          <td>{SNo}</td>
          <td>{company}</td>
          <td>{title}</td>
          <td>{classification}</td>
          <td>{schedule}</td>
          <td>{status}</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="applied jobs">
        <table className="table table-bordered">
          <tbody>
            <tr>{this.getHeaders()}</tr>
            {this.getRowsData()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default JobsTable;
