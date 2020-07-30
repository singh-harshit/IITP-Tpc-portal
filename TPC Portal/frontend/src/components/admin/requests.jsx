import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class AdminRequests extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      columnDefs1: [
        {headerName: 'Company',field: 'companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="http://localhost:3000/admin/company/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Approve</button></div>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData1: [],
      columnDefs2: [
        {headerName: 'Student',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="http://localhost:3000/admin/student/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Approve</button></div>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData2: [],
      columnDefs3: [
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="http://localhost:3000/admin/job/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Company Name',field: 'companyName', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobCategory', sortable:true,filter:true},
        {headerName: 'Jaf',field: 'jafFiles'},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Approve</button></div>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData3: [],
      columnDefs4: [
        {headerName: 'Name',field: 'companyId.companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Subject',field: 'subject', sortable:true,filter:true},
        {headerName: 'Content',field: 'content', sortable:true,filter:true},
        {headerName: 'Mark Read',field: 'readCompany',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Mark Read</button></div>`}},
      ],
      rowData4: [],
      columnDefs5: [
        {headerName: 'Name',field: 'studId.name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Roll No',field: 'studId.rollNo', sortable:true,filter:true},
        {headerName: 'Subject',field: 'subject', sortable:true,filter:true},
        {headerName: 'Content',field: 'content', sortable:true,filter:true},
        {headerName: 'Mark Read',field: 'readStudent',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Mark Read</button></div>`}},
      ],
      rowData5: [],
      getRowHeight: function(params) {
       return 50;
     }
      }
    };
    componentDidMount = () =>{
      this.getRequests();
    };
    getRequests = () =>{
        axios.get('/backend/admin/requests',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data;
            console.log('data',data);
            this.setState({
              rowData1:data.companyApprovals,
              rowData2:data.studentApprovals,
              rowData3:data.jobApprovals,
              rowData4:data.companyRequests,
              rowData5:data.studentRequests
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
            this.setState({
              redirect:"/error"
            })
          });
      };

      handleClick = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        const id = selectedData.map(node => '' + node._id).join('/');
        var payload;
        if(e.data.jobTitle){payload={approvalType:'J',deletionType:'J'}}
        else if(e.data.companyName){payload={approvalType:"C",deletionType:"C"}}
        else if(e.data.name){payload={approvalType:"S",deletionType:"S"}}
        if(e.column.colId==='approve')
        {
          console.log(`/backend/admin/approve/request/${e.data._id}`);
          axios({
            url: `/backend/admin/approve/request/${e.data._id}`,
            method: 'patch',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then((s) =>{
            console.log('data has been sent to server',e);
            alert(s.data.message);
            this.getRequests();
          })
          .catch((e)=>{
            console.log('data error',e,payload);
            alert("Could Not Approve");
          });
        }


        else if(e.column.colId==='deleteApproval')
        {
          console.log(`/backend/admin/delete/request/${e.data._id}`)
          axios({
            url: `/backend/admin/delete/request/${e.data._id}`,
            method: 'delete',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then((s) =>{
            console.log('data has been sent to server');
            alert(s.data.message);
            this.getRequests();
          })
          .catch((e)=>{
            console.log('data error',e);
            alert("Could Not Delete");
          });
        }


        else if (e.column.colId==='readCompany') {
          payload= {
            companyId:e.data.companyId._id
          }
          axios({
            url: `/backend/admin/companyRequest/markRead/${e.data._id}`,
            method: 'patch',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then((s) =>{
            console.log('data has been sent to server');
            alert(s.data.message);
            this.getRequests();
          })
          .catch((e)=>{
            console.log('data error',e);
            alert("Request Error");
          });
        }


        else if (e.column.colId==='readStudent') {
          payload= {
            studId:e.data.studId._id
          }
          axios({
            url: `/backend/admin/studentRequest/markRead/${e.data._id}`,
            method: 'patch',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then((s) =>{
            console.log('data has been sent to server');
            alert(s.data.message);
            this.getRequests();
          })
          .catch((e)=>{
            console.log('data error',e);
            alert("Request Error")
          });
        }
        console.log(e);
      }

  render()
  {
    return(
      <div className="base-container border border-success m-3 rounded admin p-3">
        <div className="row">
          <div className="col-md-6 mt-2 mb-2">
            <h4>Company Approval Requests -</h4>
            <div
              className="ag-theme-balham"
              style={{
                height:500,
              }}
              >
              <AgGridReact
                columnDefs = {this.state.columnDefs1}
                rowData = {this.state.rowData1}
                rowSelection = "multiple"
                onGridReady = {params => this.gridApi = params.api}
                onCellDoubleClicked={this.handleClick}
                getRowHeight={this.state.getRowHeight}
              />
            </div>
          </div>
          <div className="col-md-6 mt-2 mb-2">
            <h4>Student Approval Requests -</h4>
            <div
              className="ag-theme-balham"
              style={{
                height:500,
              }}
              >
              <AgGridReact
                columnDefs = {this.state.columnDefs2}
                rowData = {this.state.rowData2}
                rowSelection = "multiple"
                onGridReady = {params => this.gridApi = params.api}
                onCellDoubleClicked={this.handleClick}
                getRowHeight={this.state.getRowHeight}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mt-2 mb-2">
            <h4>Jobs Approval Requests -</h4>
            <div
              className="ag-theme-balham"
              style={{
                height:500,
              }}
              >
              <AgGridReact
                columnDefs = {this.state.columnDefs3}
                rowData = {this.state.rowData3}
                rowSelection = "multiple"
                onGridReady = {params => this.gridApi = params.api}
                onCellDoubleClicked={this.handleClick}
                getRowHeight={this.state.getRowHeight}
              />
            </div>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="col-md-6 mt-2 mb-2">
            <h4>Company Requests -</h4>
            <div
              className="ag-theme-balham"
              style={{
                height:500,
              }}
              >
              <AgGridReact
                columnDefs = {this.state.columnDefs4}
                rowData = {this.state.rowData4}
                rowSelection = "multiple"
                onGridReady = {params => this.gridApi = params.api}
                onCellDoubleClicked={this.handleClick}
                getRowHeight={this.state.getRowHeight}
              />
            </div>
          </div>
          <div className="col-md-6 mt-2 mb-2">
            <h4>Student Requests -</h4>
            <div
              className="ag-theme-balham"
              style={{
                height:500,
              }}
              >
              <AgGridReact
                columnDefs = {this.state.columnDefs5}
                rowData = {this.state.rowData5}
                rowSelection = "multiple"
                onGridReady = {params => this.gridApi = params.api}
                onCellDoubleClicked={this.handleClick}
                getRowHeight={this.state.getRowHeight}
              />
            </div>
          </div>
        </div>
      </div>
  );
  }
}
