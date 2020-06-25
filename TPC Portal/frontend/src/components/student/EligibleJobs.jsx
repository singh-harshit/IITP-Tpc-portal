import React from "react";
import axios from "axios";

export class StudentEligibleJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studId: props.match.params.id,
      rawData: [],
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
      jobsList: [],
>>>>>>> f55b5ccf627cf9ff3597d1f4d34734496763000e
=======
      jobsList: [],
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======
      jobsList: [],
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
      jsonDataForTable: [],
    };
  }
  // Fetching Data and Making json for table
  componentDidMount() {
    /* Fetch Data */
    axios
      .get("/backend/student/eligible/jobs/" + this.state.studId)
      .then((response) => {
        const jobsList = response.data.studentJobs.eligibleJobs;
        this.setState({ jobsList: jobsList });
        console.log("Student Data List Received!!!");
        console.log("JobsList: ", this.state.jobsList);
        /* Make JSON */
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

        console.log("JSON Data: ", this.state.jsonDataForTable);
      })
      .catch((error) => {
        console.log("Receiving Student Data List Failed");
        console.log(error);
      });
  }

  // Making Table

  getKeys = () => {
    return Object.keys(this.state.jsonDataForTable);
  };

  displayHeaders = () => {
    const headers = [
      "S.No",
      "Company",
      "Title",
      "Classification",
      "JAF",
      "Last Date",
      "Apply",
    ];

    return headers.map((header, index) => {
      return <th key={index}>{header}</th>;
    });
  };

  displayTable = () => {
    const jsonData = this.state.jsonDataForTable;
    return jsonData.map((row, index) => {
      return (
        <tr key={index}>
          <RenderRow key={index} data={row} />
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="AppliedJobs">
        <table className="table">
          <thead className="thead-light">
            <tr>{this.displayHeaders()}</tr>
          </thead>

          <tbody>{this.displayTable()}</tbody>
        </table>
      </div>
    );
  }
}

const RenderRow = (props) => {
  const keys = Object.keys(props.data);
  return keys.map((key, index) => {
    return <td key={index}>{props.data[key]}</td>;
  });
};
