import React from "react";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

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
      {headerName: 'Company',field: 'companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
      {headerName: 'Job Title',field: 'jobTitle'},
      {headerName: 'Job Category',field: 'jobCategory', sortable:true, filter:true},
      {headerName: 'JAF',field: 'jafFiles', sortable:true, filter:true},
      {headerName: 'Deadline',field:'schedule', sortable:true, filter:true},
      {headerName: 'Apply',field: 'apply',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Apply</button></div>`}}
    ],
    rowData: [],
    getRowHeight: function(params) {
     return 50;
   }
  }
}
  // Fetching Data and Making json for table
  componentDidMount() {
    this.getStudentInfo();
  }

  getStudentInfo = () => {
    axios
      .get("/backend/student/eligible/jobs/" + this.state._id,{
        headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
        }
      })
      .then((response) => {
        const data = response.data.studentJobs.eligibleJobs;
        console.log('data',data);
        data.forEach((item, i) => {
          item.schedule=item.schedule[0].stepDate;
        });
        console.log("rowData",data);
        this.setState({rowData:data})
      })
      .catch((error) => {
        console.log("Receiving Student Data List Failed");
        console.log(error);
      });
  };
  handleClick = (e) =>{
    if(e.column.colId==='apply')
    {
      let payload={
        jobId:e.data._id
      }
      axios({
        url: `/backend/student/apply/${this.state._id}`,
        method: 'post',
        data: payload,
        headers: {
					'x-auth-token': this.state.authToken,
					'x-refresh-token': this.state.refreshToken,
				}
      })
      .then((s) =>{
        console.log('data has been sent to server',s);
        alert(s.data.message);
        this.getStudentInfo();
      })
      .catch((e)=>{
        console.log('data error');
      });
    }
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
            onCellDoubleClicked={this.handleClick}
            getRowHeight={this.state.getRowHeight}
          />
        </div>
      </div>
    );
  }
}
const scheduleRenderer = (props)=>{
  return console.log('schedule',props);
}
