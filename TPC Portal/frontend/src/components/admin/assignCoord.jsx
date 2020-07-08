import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
import Popup from "reactjs-popup";
export class AdminAssignCoordinators extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Email',field: 'emailId', sortable:true, filter:true},
        {headerName: 'Mobile Number 1',field: 'mobileNumber1', sortable:true, filter:true},
        {headerName: 'Mobile Number 2',field: 'mobileNumber2', sortable:true, filter:true},
      ],
      rowData: [],
      coordspassword:''
    }
  };
    componentDidMount = () =>{
      this.getAllCoordinators();
    };
    getAllCoordinators = () =>{
        axios.get('/backend/admin/coordinators')
          .then((response) => {
            const data = response.data.allCoordinators;
            console.log('data',data);
            this.setState({
              rowData:data
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      };
      handleChange = (event) =>
      {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
          [name]:value
        })
        console.log(this.state);
      };
     handleDeleteCoordinator = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        const del = selectedData.map(data=>data._id);
        console.log("helloo",del);
        let payload={
          coordinatorsId:del
        }
        axios({
          url: `/backend/admin/deleteCoordinator`,
          method: 'patch',
          data: payload
        })
        .then(() =>{
          console.log('data has been sent to server');
          this.getAllCoordinators();
        })
        .catch((error)=>{
          alert('data error',error);
        });
      }
      handleCoordPasswordReset = (e) =>{
        e.preventDefault();
         const selectedNodes = this.gridApi.getSelectedNodes();
         const selectedData = selectedNodes.map(node => node.data);
         const del = selectedData.map(data=>data._id);
         console.log("helloo",del,del.length);
         if(del.length!==1)alert('Select one student')
         else
         {
           let payload={
             newPassword:this.state.coordspassword
           }
           axios({
             url: `/backend/admin/resetCodPassword/${del[0]}`,
             method: 'patch',
             data: payload
           })
           .then((s) =>{
             alert(s.data.message);
             this.setState({
               coordspassword:''
             })
           })
           .catch((error)=>{
             console.log(error);
           });
         }
       }
      addCoordinator = (event) =>{
        event.preventDefault();
        let payload={
          name:this.state.name,
          rollNo:this.state.rollNo,
          emailId:this.state.email,
          password:this.state.password,
          mobileNumber1:this.state.mobileNumber1,
          mobileNumber2:this.state.mobileNumber2
        }
        axios({
          url: `/backend/admin/newCoordinator`,
          method: 'post',
          data: payload
        })
        .then(() =>{
          console.log('data has been sent to server');
          this.resetState();
          this.getAllCoordinators();
        })
        .catch((error)=>{
          alert('data error',error);
        });
      }
      resetState = () =>{
        this.setState({
          name:'',
          rollNo:'',
          email:'',
          password:'',
          mobileNumber1:'',
          mobileNumber2:''
        })
      }
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
    <div className="base-container admin m-2 p-1">
      <div className="row">
        <div className="col-md-6 border border-success rounded p-3 m-2">
          <div
            className="ag-theme-balham"
            style={{
              height:421,
            }}
            >
            <AgGridReact
              columnDefs = {this.state.columnDefs}
              rowData = {this.state.rowData}
              rowSelection = "multiple"
              onGridReady = {params => this.gridApi = params.api}
            />
          </div>
          <div className="container-fluid row mt-2">
            <div className="col-md-6">
              <Popup trigger={<button type="button" className="btn btn-block btn-primary m-1">Reset Coord Password</button>} position="top center"
              >{close => (
                <div className=" p-1">
                  <a className="close" onClick={close}>&times;</a>
                  <form className="form" onSubmit = {this.handleCoordPasswordReset} onChange={this.handleChange}>
                    <label htmlFor="coordspassword">Password:</label>
                    <input
                      type="password"
                      name="coordspassword"
                      className="form-control"
                      placeholder="Enter Password"
                      maxLength="300"
                      value={this.state.coordspassword}
                      required
                    />
                    <button type="submit" className="btn btn-block btn-primary p-1 mt-1">Confirm</button>
                  </form>
                </div>)}
              </Popup>
            </div>
            <div className="col-md-6">
              <button type="button" className="btn btn-block btn-primary m-1" onClick={this.handleDeleteCoordinator}>Delete Coordinator</button>
            </div>
          </div>
        </div>
        <div className="col-md-5 border border-success rounded p-3 m-2">
          <form className="form d-flex flex-column " onChange={this.handleChange} onSubmit={this.addCoordinator}>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="email" className="mr-sm-2">Email:</label>
              </div>
              <div className="col-md-8">
                <input type="text" name="email" value={this.state.email} className="form-control mb-2 mr-sm-2" required placeholder="Enter Email"/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="password" className="mr-sm-2">Password:</label>
              </div>
              <div className="col-md-8">
                <input type="password" name="password" value={this.state.password} className="form-control mb-2 mr-sm-2" required placeholder="Enter password"/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="name" className="mr-sm-2">Name:</label>
              </div>
              <div className="col-md-8">
                <input type="text" name="name" value={this.state.name} className="form-control mb-2 mr-sm-2" required placeholder="Enter Name"/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="rollNo" className="mr-sm-2">Roll No:</label>
              </div>
              <div className="col-md-8">
                <input type="text" name="rollNo" value={this.state.rollNo} className="form-control mb-2 mr-sm-2" required placeholder="Enter Roll No"/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="mobileNumber1" className="mr-sm-2">Contact Number #1:</label>
              </div>
              <div className="col-md-8">
                <input type="text" name="mobileNumber1" value={this.state.mobileNumber1} className="form-control mb-2 mr-sm-2" required placeholder="Enter Contact Number"/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="mobileNumber2" className="mr-sm-2">Conatact Nuber #2:</label>
              </div>
              <div className="col-md-8">
                <input type="text" name="mobileNumber2" value={this.state.mobileNumber2} className="form-control mb-2 mr-sm-2" placeholder="Enter Conatact Number"/>
              </div>
            </div>
            <div className="container-fluid row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <button type="submit" className="btn btn-primary btn-block m-1">Add Coordinator</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-3">
          <Link style={{ textDecoration: 'none', color: 'white' }} to="/admin/settings"><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
