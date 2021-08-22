import React, { Component } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
export class CoordinatorStudents extends Component {
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    redirect:null,
    columnDefs: [
      {headerName: 'Rollno',field: 'rollNo', sortable:true, filter:true},
      {headerName: 'Name',field: 'name', sortable:true, filter:true},
      {headerName: 'CPI',field: 'cpi', sortable:true, filter:"agNumberColumnFilter"},
      {headerName: '10th Score',field: 'tenthMarks', sortable:true, filter:"agNumberColumnFilter"},
      {headerName: '12th Score',field: 'twelthMarks', sortable:true, filter:"agNumberColumnFilter"},
      {headerName: 'Program',field: 'program', sortable:true, filter:true},
      {headerName: 'Course',field: 'course', sortable:true, filter:true},
      {headerName: 'Mail',field: 'instituteEmail', sortable:true, filter:true},
      {headerName: 'Mob',field: 'mobileNumber', sortable:true, filter:true},
      {headerName: 'Status',field: 'status', sortable:true, filter:true},
      {headerName: 'Registred For',field: 'registrationFor', sortable:true, filter:true},
      {headerName: 'Resume',field: 'resumeFile', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      {headerName: 'Resume Link',field: 'resumeLink', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
    ],
    rowData: [],
    defaultColDef: { resizable: true },
  };
}
  handleClick = () =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => '/coordinator/student/' + node._id).join('/');
    this.setState({
      redirect:selectedDataStringPresentation
    })
  }

  componentDidMount = () =>{
    this.getStudents();
  };
  getStudents = async() =>{
    await axios.get('/backend/coordinator/students/',{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.studentsInfo;
        this.setState({
          rowData:data
        })
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
      });

  }
  onBtnExport = () => {this.gridApi.exportDataAsCsv();};
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="container border rounded p-4 m-3 border-success admin">
      <div
        className="ag-theme-balham"
        style={{
          height:430
        }}
      >
      <button onClick={() => this.onBtnExport()}>Export</button>
      <AgGridReact
        columnDefs = {this.state.columnDefs}
        rowData = {this.state.rowData}
        rowSelection = "multiple"
        onGridReady = {params => {this.gridApi = params.api;this.gridColumnApi = params.columnApi;}}
        defaultColDef={this.state.defaultColDef}
        onCellDoubleClicked={this.handleClick}
      />
      </div>
    </div>
    );
  }
}
