import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
export class AdminJobAddStudent extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      id: props.match.params.jid,
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
      ],
      rowData: [],
    }
  };
    componentDidMount = () =>{
      this.getStudents();
    };
    getStudents = () =>{
        axios.get('/backend/admin/students',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.studentsInfo;
            this.setState({
              rowData:data
            })
          })
          .catch((e)=>{
            this.setState({
              redirect:'/error'
            })
          });
      };

     handleSelect = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data._id);
          let payload={
            studentIds:selectedData
          }
          axios({
            url: `/backend/admin/jobs/addStudent/${this.state.id}`,
            method: 'patch',
            data: payload,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then(() =>{
            alert('Added Students')
          })
          .catch((error)=>{
            alert('Could Not Add Student');
          });

        /*this.setState({
          redirect:`/admin/job/${this.state.id}`
        })*/
      }
      onBtnExport = () => {this.gridApi.exportDataAsCsv();}
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div className="row">
        <div
          className="ag-theme-balham col-md-12"
          style={{
            height:500,
          }}
          >
          <button onClick={() => this.onBtnExport()}>Export</button>
          <AgGridReact
            columnDefs = {this.state.columnDefs}
            rowData = {this.state.rowData}
            rowSelection = "multiple"
            onGridReady = {params => this.gridApi = params.api}
          />
        </div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-primary m-1" onClick={this.handleSelect} width="40vw">Add Student</button>
        </div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/job/"+this.state.id}><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
