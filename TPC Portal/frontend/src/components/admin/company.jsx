import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

export class Company extends React.Component
{

    state = {
      companyName:"",
      userName: "",
      password: "",
      companyAddress: "",
      contact1:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },
      contact2:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },
      contact3:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },

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

    getCompany = () =>{
      axios.get('url')
        .then((response) => {
          const data = response.data;
          this.setState({posts: data});
          console.log('data',this.state.posts);
        })
        .catch(()=>{
          console.log('Error Retrieving data');
        });
    }

  render()
  {
    return(
      <div className="base-container float-right admin">
        <div className="row">
          <div className="col-md-6 border p-3 m-3 rounded border-success">
            <h4 className="m-3">
              <div className="row">
                <div className="col-md-4 text-nowrap">
                  Company Name
                </div>
                <div className="col-md-8">
                  :{this.state.companyName}
                </div>
              </div>
            </h4>
            <p className="m-3 p-2">
              Contact 1
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      Name
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact1.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Designation
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact1.designation}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      MailId
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact1.mailId}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Mobile
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact1.mobileNumber}
                    </div>
                  </div>
                </div>
              </div>
            </p>
            <p className="m-3 p-2">
              Contact 2
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      Name
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact2.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Designation
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact2.designation}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      MailId
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact2.mailId}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Mobile
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact2.mobileNumber}
                    </div>
                  </div>
                </div>
              </div>
            </p>
            <p className="m-3 p-2">
              Contact 3
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      Name
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact3.name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Designation
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact3.designation}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4">
                      MailId
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact3.mailId}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      Mobile
                    </div>
                    <div className="col-md-8">
                      :{this.state.contact3.mobileNumber}
                    </div>
                  </div>
                </div>
              </div>
            </p>
            <p className="m-3 p-2">
              <div className="row">
                <div className="col-md-4">
                  Company Address
                </div>
                <div className="col-md-8">
                  :{this.state.companyAddress}
                </div>
              </div>
            </p>
          </div>
          <div className="col-md-5 border p-3 m-3 rounded border-success">
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
      </div>
      <div className="container-fluid row">
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1">Add Job</button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1">Edit Details</button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1">Deactivate</button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.ButtonClick}>Reset Password</button>
        </div>
        <div className="col-md-2"></div>
        <div className="col-md-2">
          <button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button>
        </div>
      </div>
    </div>
  );
  }
}
