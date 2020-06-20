import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

export class AdminStudent extends React.Component
{
  state = {
    name:'',
    password:'',
    rollNo:'',
    gender:'',
    instituteEmail:'',
    personalEmail:'',
    mobileNumber:'',
    registrationFor:'',
    program:'',
    department:'',
    course:'',
    currentSemester:'',
    spi:{sem1:'',sem2:'',sem3:'',sem4:'',sem5:'',sem6:''},
    sem1: '',
    sem2: '',
    sem3: '',
    sem4: '',
    sem5: '',
    sem6: '',
    sem7: '',
    cpi:'',
    tenthMarks: '',
    twelthMarks: '',
    bachelorsMarks: '',
    mastersMarks: '',
    approvalStatus: 'approved',
    columnDefs: [
      {headerName: 'SNo.',field: 'sno', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
      {headerName: 'Company',field: 'company', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      {headerName: 'status',field: 'status', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'job', sortable:true, filter:true},
      {headerName: 'Classification',field: 'classification', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
    ],
    rowData: [{
        sno:'1',
        company:'1701me18',
        status:'1',
        cpi:8.26,
        job:'Akshat',
        classification:'BTech',
        jobStatus:1
      },
      {
          sno:'1',
          company:'1701me18',
          status:'1',
          cpi:8.26,
          job:'harshit',
          classification:'BTech',
          jobStatus:1
        },
        {
            sno:'1',
            company:'1701me18',
            status:'1',
            cpi:8.26,
            job:'harshit',
            classification:'BTech',
            jobStatus:1
          }
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

  render()
  {
    return(
      <div className="base-container float-right admin border rounded border-success m-3">
        <p className="m-3 p-2">
          <div className="row">
            <div className="col-md-2">
              <img className="img-fluid rounded" src="https://i.pinimg.com/236x/0c/92/0d/0c920d58b210a74a75868df885160a5f--jon-snow-wolf-dire-wolf.jpg" alternate="hello"></img>
              <button type="button" className="btn btn-block btn-primary mt-2">{this.state.approvalStatus}</button>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  Name
                </div>
                <div className="col-md-8">
                  :{this.state.name}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Roll No
                </div>
                <div className="col-md-8">
                  :{this.state.rollNo}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Gender
                </div>
                <div className="col-md-8">
                  :{this.state.gender}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Program
                </div>
                <div className="col-md-8">
                  :{this.state.program}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Department
                </div>
                <div className="col-md-8">
                  :{this.state.department}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Course
                </div>
                <div className="col-md-8">
                  :{this.state.course}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Semester
                </div>
                <div className="col-md-8">
                  :{this.state.currentSemester}
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="row">
                <div className="col-md-4">
                  Institute Email
                </div>
                <div className="col-md-8">
                  :{this.state.instituteEmail}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Personal Email
                </div>
                <div className="col-md-8">
                  :{this.state.personalEmail}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  Mobile Number
                </div>
                <div className="col-md-8">
                  :{this.state.instituteEmail}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  SPI
                </div>
                <div className="col-md-8">
                  :{this.state.spi.sem}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  CPI
                </div>
                <div className="col-md-8">
                  :{this.state.spi.sem}
                </div>
              </div>
            </div>
          </div>
        </p>
        <div className="container-fluid">
          <hr className="bg-dark"/>
          <h4>Application Details</h4>
          <div
            className="ag-theme-balham"
            style={{
              height:250
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
          <hr className="bg-dark"/>
          <h4 className="mt-2">Eligible Jobs</h4>
          <div
            className="ag-theme-balham"
            style={{
              height:250
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
        <div className="container-fluid row mt-2">
          <div className="col-md-2">
            <button type="button" className="btn btn-block btn-success m-1">Deactivate</button>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-block btn-success m-1" onClick={this.ButtonClick}>Reset Password</button>
          </div>
          <div className="col-md-2">
            <button type="button" className="btn btn-block btn-success m-1" onClick={this.ButtonClick}>Reset Password</button>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-2"></div>
          <div className="col-md-2">
            <button type="button" class="btn btn-outline-dark btn-block m-1">Back</button>
          </div>
        </div>
      </div>
    );
  }
}
