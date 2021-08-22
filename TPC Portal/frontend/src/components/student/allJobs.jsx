import React from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Redirect} from 'react-router-dom';
export class StudentAllJobs extends React.Component {
  constructor(props)
  {
  super(props);
  this.state =
  {
    refreshToken:localStorage.getItem('refreshToken'),
    authToken:localStorage.getItem('authToken'),
    _id:localStorage.getItem('_id'),
    columnDefs: [
      {headerName: 'Company',field: 'companyName', sortable:true, filter:true},
      {headerName: 'Status',field: 'companyStatus', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
      {headerName: 'Classification',field: 'jobCategory', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
    ],
    rowData: [],
    defaultColDef: { resizable: true },
  }
  }
  componentDidMount () {
    this.getAllJobs();
  }
  getAllJobs= ()=>{
    axios
      .get("/backend/student/companies/",{
        headers: {
					'x-auth-token': this.state.authToken,
					'x-refresh-token': this.state.refreshToken,
				}
      })
      .then((response) => {
        const data = response.data.companyList;
        this.fillTableData(data);
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
      });
  }
  fillTableData = (data) =>{
    let rowData = [];
    for (var i = 0; i < data.length; i++) {
      const newData = data[i];
      let job=newData.jobs
      if(job.length==0){
        const row ={
          _id: newData._id,
          companyName : newData.companyName,
          companyStatus : newData.companyStatus,
        }
        rowData.push(row);
      }
      for(var j = 0; j < job.length; j++) {
        if(job[j].jobStatus!=="Pending Approval"&&job[j].jobType===localStorage.getItem("registrationFor")){
          const row ={
            _id:newData._id,
            companyName : newData.companyName,
            companyStatus : newData.companyStatus,
            jobTitle: job[j].jobTitle,
            jobCategory: job[j].jobCategory,
            jobStatus: job[j].jobStatus,
          }
        rowData.push(row);
        }
      }
  }
  this.setState({
    rowData:rowData
  });
  var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
}

  render() {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
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
              onGridReady = {params => {this.gridApi = params.api;this.gridColumnApi = params.columnApi;}}
              defaultColDef={this.state.defaultColDef}
            />
          </div>
        </div>
      );
  }
}
