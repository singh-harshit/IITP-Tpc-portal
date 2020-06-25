import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


export class CompanyJobs extends React.Component{
  constructor(props)
  {
    super(props);
    this.state =
    {
      id: props.match.params.id,
      columnDefs: [
        {headerName: 'SNo.',field: 'sno', sortable:true, filter:true,checkboxSelection:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
        {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
        {headerName: 'Job Type',field: 'jobType', sortable:true, filter:true},
        {headerName: 'Schedule',field: 'schedule', sortable:true, filter:true},
        {headerName: 'Eligibility Criteria',field: 'eligibilityCriteria', sortable:true, filter:true},
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
    let rowData = [];
    for (var i = 0; i < data.length; i++) {
      const newData = data[i];
      let rawSchedule = Object.entries(newData.schedule);
      let schedule=[];
      for(var j = 0; j < rawSchedule.length; j++) {
        let sch = "";
          for(var z = 0; z < rawSchedule[j].length; z++) {
            sch=sch+rawSchedule[j][z];
            if(z===0){  sch=sch+":";}
          }
          schedule.push(sch);
        }

        let rawCriteria = Object.entries(newData.eligibilityCriteria);
        let criteria=[];
        for(var j = 0; j < rawCriteria.length; j++) {
          let sch = "";
            for(var z = 0; z < rawCriteria[j].length; z++) {
              sch=sch+rawCriteria[j][z];
              if(z===0){  sch=sch+":";}
            }
            criteria.push(sch);
          }
      const row ={
      sno:i+1,
      jobTitle: newData.jobTitle,
      jobStatus: newData.jobStatus,
      jobType: newData.jobType,
      schedule: schedule,
      eligibilityCriteria: criteria,
      regStudent: newData.registeredStudents,
      selectedStudent: newData.selectedStudents,
      jafFiles: newData.jafFiles
    }
    rowData.push(row);
  }
  this.setState({
    rowData:rowData
  });
  }

  getJobs = () =>{
    axios.get('/backend/company/jobs/'+this.state.id)
      .then((response) => {
        const data = response.data.allJobs.jobs;
        console.log('data',data);
        this.fillTableData(data);
      })
      .catch((e)=>{
        console.log('Error Retrieving data',e);
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
