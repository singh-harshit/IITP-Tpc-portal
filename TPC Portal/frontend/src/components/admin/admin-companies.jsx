import React, { Component } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';

export class AdminCompanies extends Component {
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    columnDefs: [
      {headerName: 'Company',field: 'companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
      {headerName: 'status',field: 'companyStatus', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
      {headerName: 'Classification',field: 'jobCategory', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
    ],
    rowData: [],
    redirect:'',
    defaultColDef: { resizable: true },
  };
}
  componentDidMount = () =>{
    this.getCompanies();
  };
  getCompanies = () =>{
    axios.get('/backend/admin/companies/',{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.companyList;
        this.fillTableData(data);
      })
      .catch((e)=>{
        this.setState({
          redirect:"/error"
        })
      });
  }
  fillTableData = (data) =>{
    let rowData = [];
    for (var i = 0; i < data.length; i++) {
      const newData = data[i];
      let job=newData.jobs
      if(job.length==0){
        const row ={
          _id: newData._id,
          companyName : newData.companyName,
          companyStatus : newData.companyStatus,
        }
        rowData.push(row);
      }
      for(var j = 0; j < job.length; j++) {
        const row ={
          _id:newData._id,
          companyName : newData.companyName,
          companyStatus : newData.companyStatus,
          jobTitle: job[j].jobTitle,
          jobCategory: job[j].jobCategory,
          jobStatus: job[j].jobStatus,
        }
        rowData.push(row);
      }
  }
  this.setState({
    rowData:rowData
  });
  var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
}
  handleSelect = (e) =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => '/admin/company/' + node._id).join('/');
    var link = `/admin/company/${e.data._id}`;
    this.setState({
      redirect:link
    })
  }

  handleDeactivate = () =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const idList = selectedData.map(node =>node._id);
    let payload = {
      idList:idList
    }
    axios({
      url: '/backend/admin/companies/deactivateCompany',
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      this.getCompanies();
      alert('Deactivated: '+e.data.successFul+' Deactivate Failed for: '+e.data.unSuccessFul);
    })
    .catch(()=>{
      alert('Request Failed');
    });
  }

  handleDelete = () =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const idList = selectedData.map(node =>node._id);
    let payload = {
      idList:idList
    }
    axios({
      url: '/backend/admin/companies/deleteCompany',
      method: 'delete',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      this.getCompanies();
      alert('Deleted: '+e.data.successFul+' Delete Failed for: '+e.data.unSuccessFul);
    })
    .catch(()=>{
      alert("Deletion Failed");
    });
  }

  handleBulkFile = (event) =>
  {
    this.setState({
      bulkFile: event.target.files[0]
    });
  }

  handleBulkFileSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('companyDetails',this.state.bulkFile);
        axios.post('/backend/admin/companies/addBulkCompany',formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
    				'x-auth-token': this.state.authToken,
    				'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          alert("Uploaded Bulk file");
        })
        .catch((error)=>{
          alert("Bulk Update Failed")
        });
    };
    onBtnExport = () => {this.gridApi.exportDataAsCsv();}
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="container border rounded p-3 m-2 border-success admin">
      <button onClick={() => this.onBtnExport()}>Export</button>
      <div
        className="ag-theme-balham"
        style={{
          height:700
        }}
      >
      <AgGridReact
        columnDefs = {this.state.columnDefs}
        rowData = {this.state.rowData}
        rowSelection = "multiple"
        onGridReady = {params => {this.gridApi = params.api;this.gridColumnApi = params.columnApi;}}
        defaultColDef={this.state.defaultColDef}
        onCellDoubleClicked = {this.handleSelect}

      />
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to="/admin/addCompany"><button type="button" className="btn btn-block btn-success m-1">Add Company</button></Link>
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDelete}>Delete Company</button>
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDeactivate}>Deactivate</button>
        </div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to="/admin/addJob"><button type="button" className="btn btn-block btn-success m-1">Add Job</button></Link>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <div className="col-md-6 m-4">
          <form className="row" onSubmit={this.handleBulkFileSubmit}>
            <div className="col-md-6 custom-file rounded">
              <input type="file" className="" id='bulk' required onChange={this.handleBulkFile}/>
            </div>
            <div className="col-md-6">
              <button type="submit" class="btn btn-block btn-primary">Add Bulk Company</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
  }
}
