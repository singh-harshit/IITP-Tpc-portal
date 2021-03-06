import React from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
export class StudentAppliedJobs extends React.Component {
  constructor(props)
  {
  super(props);
  this.state =
  {
    refreshToken:localStorage.getItem('refreshToken'),
    authToken:localStorage.getItem('authToken'),
    _id:localStorage.getItem('_id'),
    columnDefs: [
      {headerName: 'Company',field: 'jobId.companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
      {headerName: 'Job Title',field: 'jobId.jobTitle'},
      {headerName: 'Job Category',field: 'jobId.jobCategory', sortable:true, filter:true},
      {headerName: 'Process',field:'jobId.process',filter:true},
      {headerName: 'Deadline',field:'jobId.deadline', sortable:true, filter:true},
    ],
    rowData: [],
  }
  }
  componentDidMount() {
    axios
      .get("/backend/student/applied/jobs/" + this.state._id,{
        headers: {
					'x-auth-token': this.state.authToken,
					'x-refresh-token': this.state.refreshToken,
				}
      })
      .then((response) => {
        console.log("rsponse",response);
        const data = response.data.studentWithAppliedJobs.appliedJobs;
        data.forEach((item, i) => {
          item.jobId.deadline=item.jobId.schedule[item.jobId.schedule.length-1].stepDate;
          item.jobId.process=item.jobId.schedule[item.jobId.schedule.length-1].stepName;
        });
        this.setState({
          rowData:data
        })
      })
      .catch((error) =>
        console.log("Error receiving in Student Job List", error)
      );
  }


  render() {

      return (
        <div className="base-container admin m-3">
          <div
            className="ag-theme-balham"
            style={{
              height:500,
            }}
            >
            <AgGridReact
              columnDefs = {this.state.columnDefs}
              rowData = {this.state.rowData}
              rowSelection = "multiple"
              onGridReady = {params => this.gridApi = params.api}
            />
          </div>
        </div>
      );
  }
}
