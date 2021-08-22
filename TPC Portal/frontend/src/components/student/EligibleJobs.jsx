import React from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Redirect} from 'react-router-dom';

export class StudentEligibleJobs extends React.Component {
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
      {headerName: 'Job Title',field: 'jobTitle'},
      {headerName: 'Job Category',field: 'jobCategory', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
      {headerName: 'JAF',field: 'jafFiles', sortable:true, filter:true,cellRenderer: function(params){  if(params.value.length!==0){return `<a href="${params.value}" target="_blank" rel="noopener">`+"Open JAF"+'</a>'}else{return `<div>No JAF File</div>`}}},
      {headerName: 'Deadline',field:'schedule', sortable:true, filter:true},
      {headerName: 'Apply',field: 'apply',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Apply</button></div>`}}
    ],
    rowData: [],
    getRowHeight: function(params) {
     return 50;
   },
   defaultColDef: { resizable: true },
  }
}
  // Fetching Data and Making json for table
  componentDidMount() {
    this.getStudentInfo();
  }

  getStudentInfo = async() => {
    await axios
      .get("/backend/student/eligible/jobs/" + this.state._id,{
        headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
        }
      })
      .then((response) => {
        const data = response.data.studentJobs.eligibleJobs;
        data.forEach((item, i) => {
          item.schedule=item.schedule[0].stepDate;
        });
        this.setState({rowData:data})
      })
      .catch((error) => {
        this.setState({
          redirect:"/error"
        })
      });
  };
  handleClick = async (e) =>{
    this.setState({
      loading:true,
    })
    if(e.column.colId==='apply')
    {
      let payload={
        jobId:e.data._id
      }
      await axios({
        url: `/backend/student/apply/${this.state._id}`,
        method: 'post',
        data: payload,
        headers: {
					'x-auth-token': this.state.authToken,
					'x-refresh-token': this.state.refreshToken,
				}
      })
      .then((s) =>{
        if(s.data.message)alert(s.data.message);
        else alert("Applied in Job");
        this.getStudentInfo();
      })
      .catch((e)=>{
        alert("Could Not Apply. Note: Add Resume If not added. Or Check your selection status");
      });
    }
    this.setState({
      loading:false
    })
  }
  render() {

    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="base-container admin m-3">
        {
          this.state.loading===true ?
          (
            <div className="d-flex justify-content-center">
            <div className="spinner-grow text-success"></div>
            <div className="spinner-grow text-success"></div>
            <div className="spinner-grow text-success"></div>
            </div>
          ):(
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
            onCellDoubleClicked={this.handleClick}
            getRowHeight={this.state.getRowHeight}
          />
      </div>)}
      </div>
    );
  }
}
