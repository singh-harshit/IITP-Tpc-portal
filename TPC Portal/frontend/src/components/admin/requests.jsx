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
        {headerName: 'Company',field: 'companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="https://iitp-tpc-portal.netlify.app/admin/company/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-success m-1">Approve</button>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData1: [],
      columnDefs2: [
        {headerName: 'Student',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="https://iitp-tpc-portal.netlify.app/admin/student/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-success m-1">Approve</button>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData2: [],
      columnDefs3: [
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params){ return `<a href="https://iitp-tpc-portal.netlify.app/admin/job/${params.data._id}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
        {headerName: 'Company Name',field: 'companyName', sortable:true, filter:true},
        {headerName: 'Classification',field: 'jobCategory', sortable:true,filter:true},
        {headerName: 'Jaf',field: 'jafFiles',cellRenderer: function(params){ if(params.value.length!==0){return `<a href="${params.value}" target="_blank" rel="noopener">`+"Open JAF"+'</a>'}else{return `<div>No JAF File</div>`}}},
        {headerName: 'Approve',field: 'approve',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Approve</button></div>`}},
        {headerName: 'Delete',field: 'deleteApproval',cellRenderer: function(params) {return `<button type="button" class="btn btn-block btn-danger m-1">Delete</button>`}},
      ],
      rowData3: [],
      columnDefs4: [
        {headerName: 'Name',field: 'companyId.companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Subject',field: 'subject', sortable:true,filter:true},
        {headerName: 'Content',field: 'content', sortable:true,filter:true,cellRenderer: function(params) {return `<p data-toggle="tooltip" data-placement="top" title="${params.value}">`+params.value+`</p>`}},
        {headerName: 'Mark Read',field: 'readCompany',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Mark Read</button></div>`}},
      ],
      rowData4: [],
      columnDefs5: [
        {headerName: 'Name',field: 'studId.name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Roll No',field: 'studId.rollNo', sortable:true,filter:true},
        {headerName: 'Subject',field: 'subject', sortable:true,filter:true,},
        {headerName: 'Content',field: 'content', sortable:true,filter:true,cellRenderer: function(params) {return `<p data-toggle="tooltip" data-placement="top" title="${params.value}">`+params.value+`</p>`}},
        {headerName: 'Mark Read',field: 'readStudent',cellRenderer: function(params) {return `<div><button type="button" class="btn btn-block btn-success m-1">Mark Read</button></div>`}},
      ],
      rowData5: [],
      defaultColDef:{
        resizable: true,
      },
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
            this.setState({
              rowData1:data.companyApprovals,
              rowData2:data.studentApprovals,
              rowData3:data.jobApprovals,
              rowData4:data.companyRequests,
              rowData5:data.studentRequests
            })
          })
          .catch((e)=>{
            this.setState({
              redirect:"/error"
            })
          });
      };

      handleClick = async (e) =>{
        this.setState({loading:true});
        let payload;
        if(e.data.jobTitle){payload={approvalType:'J',deletionType:'J'}}
        else if(e.data.companyName){payload={approvalType:"C",deletionType:"C"}}
        else if(e.data.name){payload={approvalType:"S",deletionType:"S"}}
        if(e.column.colId==='approve')
        {
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
            alert(s.data.message);
            this.setState({loading:false});
            this.getRequests();
          })
          .catch((e)=>{
            alert("Could Not Approve");
            this.setState({loading:false});
          });
        }


        else if(e.column.colId==='deleteApproval')
        {
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
            alert(s.data.message);
            this.setState({loading:false});
            this.getRequests();
          })
          .catch((e)=>{
            alert("Could Not Delete");
            this.setState({loading:false});
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
            alert(s.data.message);
            this.getRequests();
            this.setState({loading:false});
          })
          .catch((e)=>{
            alert("Request Error");
            this.setState({loading:false});
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
            alert(s.data.message);
            this.setState({loading:false});
            this.getRequests();
          })
          .catch((e)=>{
            alert("Request Error");
            this.setState({loading:false});
          });
        }
      }

  render()
  {
    return(
      <div className="base-container border border-success m-3 rounded admin p-3">
        {
          this.state.loading===true ?
          (
            <div className="d-flex justify-content-center">
            <div className="spinner-grow text-success"></div>
            <div className="spinner-grow text-success"></div>
            <div className="spinner-grow text-success"></div>
            </div>
          ):(
      <div>
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
                defaultColDef={this.state.defaultColDef}
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
                defaultColDef={this.state.defaultColDef}
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
                defaultColDef={this.state.defaultColDef}
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
                defaultColDef={this.state.defaultColDef}
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
                defaultColDef={this.state.defaultColDef}
              />
            </div>
          </div>
        </div>
      </div>)}
    </div>
  );
  }
}
