import React, { Component } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
export class AdminStudents extends Component {
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    redirect:null,
    columnDefs: [
      {headerName: 'Rollno',field: 'rollNo', sortable:true, filter:true,checkboxSelection:true},
      {headerName: 'Name',field: 'name', sortable:true, filter:true},
      {headerName: 'CPI',field: 'cpi', sortable:true, filter:"agNumberColumnFilter"},
      {headerName: 'Program',field: 'program', sortable:true, filter:true},
      {headerName: 'Mail',field: 'instituteEmail', sortable:true, filter:true},
      {headerName: 'Mob',field: 'mobileNumber', sortable:true, filter:true},
      {headerName: 'Status',field: 'status', sortable:true, filter:true},
      {headerName: 'Resume',field: 'resumeFile', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
    ],
    rowData: [],
    autoGroupColumnDef:{
      cellRendererParams:{
        checkbox:true
      }
    }
  };
}
/*
  componentDidMount(){
    fetch('url')
      .then(res => res.json())
      .then(rowData => this.setState({rowData}))
      .catch(err => console.log(err));
  }
*/
  handleClick = () =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => '/admin/student/' + node._id).join('/');
    this.setState({
      redirect:selectedDataStringPresentation
    })
  }

  componentDidMount = () =>{
    this.getStudents();
  };
  getStudents = () =>{
    axios.get('/backend/admin/students/',{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.studentsInfo;
        console.log('data',data);
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
      <AgGridReact
        columnDefs = {this.state.columnDefs}
        rowData = {this.state.rowData}
        rowSelection = "multiple"
        onGridReady = {params => this.gridApi = params.api}
        onCellDoubleClicked={this.handleClick}
      />
      </div>
    </div>
    );
  }
}
