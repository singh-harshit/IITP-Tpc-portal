import React, { Component } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';

export class CoordinatorCompanies extends Component {
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    columnDefs: [
      {headerName: 'Company',field: 'companyName', sortable:true, filter:true,checkboxSelection:true,onlySelected:true,cellRenderer: function(params) {return `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      {headerName: 'status',field: 'companyStatus', sortable:true, filter:true},
      {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
      {headerName: 'Classification',field: 'jobCategory', sortable:true, filter:true},
      {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
    ],
    rowData: [],
    redirect:''
  };
}
  componentDidMount = () =>{
    this.getCompanies();
  };
  getCompanies = () =>{
    axios.get('/backend/coordinator/companies/',{
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.companyList;
        console.log('data',data);
        this.fillTableData(data);
      })
      .catch((e)=>{
        console.log('Error Retrieving data',e);
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
}
  handleSelect = (e) =>{
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    console.log("helloo",selectedNodes);
    const selectedDataStringPresentation = selectedData.map(node => '/coordinator/company/' + node._id).join('/');
    var link = `/coordinator/company/${e.data._id}`;
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
      url: '/backend/coordinator/companies/deactivateCompany',
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      console.log('data has been sent to server');
      this.getCompanies();
      console.log(e);
      alert('Deactiveted: '+e.data.successFul+' Deactivate Failed for: '+e.data.unSuccessFul);
    })
    .catch(()=>{
      console.log('data error');
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
      url: '/backend/coordinator/companies/deleteCompany',
      method: 'delete',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((e) =>{
      console.log('data has been sent to server');
      this.getCompanies();
      console.log(e);
      alert('Deleted: '+e.data.successFul+' Delete Failed for: '+e.data.unSuccessFul);
    })
    .catch(()=>{
      console.log('data error');
    });
  }

  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="container border rounded p-3 m-2 border-success admin">
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
        onGridReady = {params => this.gridApi = params.api}
        onCellDoubleClicked = {this.handleSelect}

      />
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to="/coordinator/addCompany"><button type="button" className="btn btn-block btn-success m-1">Add Company</button></Link>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDelete}>Delete Company</button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDeactivate}>Deactivate</button>
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1">Add Bulk Company</button>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to="/coordinator/addJob"><button type="button" className="btn btn-block btn-success m-1">Add Job</button></Link>
        </div>
      </div>
    </div>
    );
  }
}
