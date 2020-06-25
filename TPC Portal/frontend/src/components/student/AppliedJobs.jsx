import React from "react";
import axios from "axios";

export class StudentAppliedJobs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studId: props.match.params.id,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      rawData: [],
      jsonDataForTable: [],
    };
  }
  componentDidMount() {
    this.getStudentInfo();
    //this.dataToJson();
=======
      jobsList: [],
      jsonDataForTable: [],
    };
>>>>>>> f55b5ccf627cf9ff3597d1f4d34734496763000e
=======
      jobsList: [],
      jsonDataForTable: [],
    };
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======
      jobsList: [],
      jsonDataForTable: [],
    };
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======
      jobsList: [],
      jsonDataForTable: [],
    };
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
  }
  componentDidMount() {
    /* Fetch Data */
    axios
      .get("/backend/student/applied/jobs/" + this.state.studId)
      .then((response) => {
        const data = response.data;
        this.setState({
          jobsList: data.studentWithAppliedJobs.appliedJobs,
        });
        console.log("State Variable Set!");
        /* Make JSON */
        const jobsList = this.state.jobsList;
        let jsonData = [];
        for (let i = 0; i < jobsList.length; i++) {
          if (jobsList[i].jobId) {
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
        }
        this.setState({
          jsonDataForTable: jsonData,
        });
        console.log("Json Variable Set!");
        return null;
      })
      .catch((error) =>
        console.log("Error receiving in Student Job List", error)
      );
  }

  displayHeaders = () => {
    const headers = [
      "S.No",
      "Company Name",
      "Title",
      "Classification",
      "Schedule",
      "Status",
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
    // console.log("Raw Data: ", this.state.jobsList);
    // console.log("Json Data: ", this.state.jsonDataForTable);
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
