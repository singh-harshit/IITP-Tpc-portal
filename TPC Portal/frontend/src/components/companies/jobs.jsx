import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


export class CompanyJobs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
    id: props.match.params.id,

    columnDefs: [
      {headerName: 'SNo.',field: 'sno', sortable:true, filter:true,checkboxSelection:true},
      {headerName: 'Company',field: 'company', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      {headerName: 'status',field: 'status', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true}
    ],
    rowData: [
    ],
  };
}
  componentDidMount = () =>{
    this.getJobs();
  };
  getJobs = () =>{
    axios.get('/backend/company/jobs/'+this.state.id)
      .then((response) => {
        const data = response.data.allJobs.jobs;
        this.setState({
          rowData:data
        })
        console.log('data',this.state.rowData);
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
