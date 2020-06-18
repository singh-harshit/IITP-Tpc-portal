import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

export class Admin_students extends Component {
  state = {
    columnDefs: [
      {headerName: 'SNo.',field: 'sno', sortable:true, filter:true,checkboxSelection:true},
      {headerName: 'Rollno',field: 'roll', sortable:true, filter:true},
      {headerName: 'Name',field: 'name', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      {headerName: 'CPI',field: 'cpi', sortable:true, filter:true},
      {headerName: 'Course',field: 'course', sortable:true, filter:true},
      {headerName: 'Program',field: 'program', sortable:true, filter:true},
      {headerName: 'Mail',field: 'mailID', sortable:true, filter:true},
      {headerName: 'Mob',field: 'mobileNumber', sortable:true, filter:true},
      {headerName: 'Status',field: 'status', sortable:true, filter:true},
      {headerName: 'Resume',field: 'resume', sortable:true, filter:true},
    ],
    rowData: [{
      sno:'1',
      roll:'1701me18',
      name:'harshit',
      cpi:8.26,
      course:'BTech',
      program:'mechanical',
      mailID:'h@abc',
      mobileNumber:'1234567',
      status:'1',
      resume:1},
      {
        sno:'1',
        roll:'1701me18',
        name:'Akshat',
        cpi:8.26,
        course:'BTech',
        program:'mechanical',
        mailID:'h@abc',
        mobileNumber:'1234567',
        status:'1',
        resume:1}
    ],
    autoGroupColumnDef:{
      headerName: 'Program',
      field:'program',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams:{
        checkbox:true
      }
    }
  };
/*
  componentDidMount(){
    fetch('url')
      .then(res => res.json())
      .then(rowData => this.setState({rowData}))
      .catch(err => console.log(err));
  }
*/
  ButtonClick = () =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.name + ' ' + node.program).join(', ');
    alert(`Selected Nodes: ${selectedDataStringPresentation}`)
  }
  render()
  {
    return(
      <div className="container border rounded p-4 m-3 border-success float-right admin-student">
      <div
        className="ag-theme-balham"
        style={{
          height:430
        }}
      >
      <button onClick={this.ButtonClick}>Get Selected Rows</button>
      <AgGridReact
        columnDefs = {this.state.columnDefs}
        rowData = {this.state.rowData}
        rowSelection = "multiple"
        onGridReady = {params => this.gridApi = params.api}
        autoGroupColumnDef={this.state.columnDefs}
      />
      </div>
    </div>
    );
  }
}
