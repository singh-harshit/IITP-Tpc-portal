import React from "react";
import axios from "axios";


export class StudentEligibleJobs extends React.Component {
  constructor(props){
    super(props);
  this.state = {
    studId: props.match.params.id,
    rawData: [],
    jsonDataForTable: [],
  };
}
  // Fetching Data and Making json for table
  componentDidMount() {
    this.getStudentInfo();
  }

  getStudentInfo = () => {
    axios
      .get("/student/eligible/jobs/" + this.state.studId)
      .then((response) => {
        const data = response.data.studentJobs.eligibleJobs;
        this.setState({ rawData: data });
        console.log("Student Data List Received!!!");
        console.log(this.state.rawData);
        console.log(response.data);
        this.dataToJson(this.state.rawData);
      })
      .catch((error) => {
        console.log("Receiving Student Data List Failed");
        console.log(error);
      });
  };

  dataToJson = (jobsList) => {
    let jsonData = [];
    for (let i = 0; i < jobsList.length; i++) {
      let tempJsonObject = {
        SNo: i + 1,
        company: jobsList[i].companyName,
        title: jobsList[i].jobTitle,
        classification: jobsList[i].jobCategory,
        jaf: jobsList[i].jaf,
        lastDate: jobsList[i].schedule.Test,
      };
      jsonData.push(tempJsonObject);
    }

    this.setState({
      jsonDataForTable: jsonData,
    });

    console.log(this.state.jsonDataForTable);
  };

  // Making Table

  getKeys = () => {
    return Object.keys(this.state.jsonDataForTable);
  };

  getHeaders = () => {
    const headers = [
      "S.No",
      "Company",
      "Title",
      "Classification",
      "JAF",
      "Last Date",
      "Apply",
    ];

    return headers.map((key, index) => {
      return <th key={key}>{key.toUpperCase()}</th>;
    });
  };

  getRowsData = () => {
    return this.state.jsonDataForTable.map((info, index) => {
      const { SNo, company, title, classification, jaf, lastDate } = info;
      return (
        <tr key={SNo}>
          <td>{SNo}</td>
          <td>{company}</td>
          <td>{title}</td>
          <td>{classification}</td>
          <td>{jaf}</td>
          <td>{lastDate}</td>
          <td>Apply</td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="eligible jobs admin">
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
