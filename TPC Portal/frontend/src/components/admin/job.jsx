import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
export class AdminJob extends React.Component
{
  constructor(props)
  {
  super(props);
  this.state =
  {
    id: props.match.params.jid,
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'CPI',field: 'cpi', sortable:true, filter:true},
        {headerName: 'Program',field: 'program', sortable:true, filter:true},
        {headerName: 'Mail',field: 'instituteEmail', sortable:true, filter:true},
        {headerName: 'Mob',field: 'mobileNumber', sortable:true, filter:true},
        {headerName: 'Application Status',field: 'selectedStudents', sortable:true, filter:true},
        {headerName: 'Resume',field: 'resumeFile', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      ],
      rowData: [],
    };
  }
    componentDidMount = () =>{
      this.getJob();
      this.getApplicants();
    };
    getJob = () =>{
        axios.get('/backend/admin/jobs/'+this.state.id)
          .then((response) => {
            const data = response.data.jobDetails;
            console.log('data',data);
            this.setState(data);
            this.setState({
              fillSchedule:this.fillSchedule()
            });
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      };
      getApplicants = () =>{
        axios.get(`/backend/admin/jobs/${this.state.id}/activeApplicants`)
          .then((response) => {
            const data = response.data.activeStudents;
            console.log('Applicants',data);
            this.setState({
              rowData:data
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      }
      fillSchedule = () =>{
        var schedule = Object.entries(this.state.schedule);
        const list = [];

        schedule.forEach((item, i) => {
          var stepDate=item[1].stepDate.split(',');
          var date=stepDate[0];
          var time=stepDate[1];
          list.push(<div key={i}> {item[1].stepName} - Date : {date} Time: {time}<br/></div>);
        });
        console.log(list);
        return(
          <div>{list}</div>
        );
      }
      handleDelete = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        console.log(selectedData);
        selectedNodes.forEach((student, i) => {
          let payload={
            rollNo:student.data.rollNo
          }
          axios({
            url: `/backend/admin/jobs/removeStudent/${this.state.id}`,
            method: 'patch',
            data: payload
          })
          .then(() =>{
            console.log('data has been sent to server');
            this.getApplicants()
            alert(`Removed : ${student.data.rollNo}`)
          })
          .catch((error)=>{
            alert('data error',error);
          });
        });
      }
  render()
  {
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div>
        Company Name : {this.state.companyName} <br/>
        Job Title : {this.state.jobTitle} <br/>
        Job Type: {this.state.jobType} <br/>
        Classification : {this.state.jobCategory} <br/>
        JAF : {this.state.jafFiles} <br/>
        Schedule : <br/>
      {this.state.fillSchedule}
      <hr/>
      </div>
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
      <div className="container-fluid row mt-2">
        <div className="col-md-3"></div>
        <div className="col-md-3"><button type="button" class="btn btn-warning btn-block m-1" onClick={this.opneRegistration}>Open Registration</button></div>
        <div className="col-md-3"><button type="button" class="btn btn-warning btn-block m-1" onClick={this.closeRegistration}>Close Registration</button></div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/editJob/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Edit Job</button></Link>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/job/markProgress/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Mark Progress</button></Link>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/job/addStudent/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Add Student</button></Link>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDelete}>Delete Student</button>
        </div>
        <div className="col-md-2">
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/company/"+this.state.companyId}><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
