import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Redirect} from 'react-router-dom';


export class CompanyJobs extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
        refreshToken:localStorage.getItem('refreshToken'),
        authToken:localStorage.getItem('authToken'),
        _id:localStorage.getItem('_id'),
      columnDefs: [
        {headerName: 'SNo.',field: 'sno', sortable:true, filter:true,checkboxSelection:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
        {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
        {headerName: 'Job Type',field: 'jobType', sortable:true, filter:true},
        {headerName: 'Current Process',field: 'schedule.stepName', sortable:true, filter:true},
        {headerName: 'Deadline',field: 'schedule.stepDate', sortable:true, filter:true},
        {headerName: 'Registered Student',field: 'regStudent', sortable:true, filter:true},
        {headerName: 'Selected Student',field: 'selectedStudent', sortable:true, filter:true}
      ],
      rowData: []
    };
  }
  componentDidMount = () =>{
    this.getJobs();
  };

  fillTableData = (data) =>{
    data.map((element)=>{
    element.schedule=element.schedule[element.schedule.length-1];
    element.selectedStudent=element.progressSteps[element.progressSteps.length-1].qualifiedStudents.map((student)=>{return student.rollNo});
    element.regStudent=element.progressSteps[0].qualifiedStudents.map((student)=>{return student.rollNo});
    })
    this.setState({
      rowData:data
    });
  }

  getJobs = () =>{
    axios.get('/backend/company/jobs/'+this.state._id,{
      headers:
      {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.allJobs.jobs;
        this.fillTableData(data);
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
      });
  }

  render(){
    return(
      <div className="base-container float-right m-3 admin">
        <h4 className="m-2">Jobs</h4>
        <div
          className="ag-theme-balham"
          style={{
            height:450
          }}
        >

          <AgGridReact
            columnDefs = {this.state.columnDefs}
            rowData = {this.state.rowData}
            rowSelection = "multiple"
            onGridReady = {params => this.gridApi = params.api}
            autoGroupColumnDef={this.state.columnDefs}
          />
        </div>
      </div>
  )};


}
