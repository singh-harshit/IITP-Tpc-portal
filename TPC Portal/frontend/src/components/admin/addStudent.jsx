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
        axios.get('/backend/admin/students')
          .then((response) => {
            const data = response.data.studentsInfo;
            console.log('data',data);
            this.setState({
              rowData:data
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      };

     handleSelect = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        console.log("helloo",selectedNodes);
        selectedNodes.forEach((student, i) => {
          let payload={
            rollNo:student.data.rollNo
          }
          axios({
            url: `/backend/admin/jobs/addStudent/${this.state.id}`,
            method: 'patch',
            data: payload
          })
          .then(() =>{
            console.log('data has been sent to server');
          })
          .catch((error)=>{
            alert('data error',error);
          });
        });

        /*this.setState({
          redirect:`/admin/job/${this.state.id}`
        })*/
      }
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
