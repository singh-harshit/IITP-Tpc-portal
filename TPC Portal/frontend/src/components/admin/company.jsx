import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
import Popup from "reactjs-popup";
export class AdminCompany extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    id: props.match.params.cid,

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
        {headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Job Category',field: 'jobCategory', sortable:true, filter:true},
        {headerName: 'Job Type',field: 'jobType', sortable:true, filter:true},
        {headerName: 'Job Status',field: 'jobStatus', sortable:true, filter:true},
      ],
      jobs: [],
      }
    };
    componentDidMount = () =>{
      this.getCompany();
    };
    getCompany = () =>{
        axios.get('/backend/admin/companies/'+this.state.id,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.companyDetails;
            this.setState(data)
          })
          .catch((e)=>{
            this.setState({
              redirect:"/error"
            })
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
      };

      handleSubmit = (event) =>
      {
        event.preventDefault();
        let payload = {
          userName:this.state.userName,
          password:this.state.password
        }
        axios({
          url: `/backend/admin/companies/${this.state.id}/reset-password/`,
          method: 'patch',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then((e) =>{
          alert(`Updated Password for: `+e.data.updatedCompany.companyName);
        })
        .catch((e)=>{
          alert("Password Update unsuccessful");
        });
      };

      handleDeactivate = () =>{
        const idList = [];
        idList.push(this.state.id)
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
          alert('Deactiveted: '+e.data.successFul+' Deactivate Failed for: '+e.data.unSuccessFul);
        })
        .catch(()=>{
          alert("Deactivate unsuccessful");
        });
      }

      handleClick = (e) =>{
        var link = `/admin/job/${e.data._id}`;
        this.setState({
          redirect:link
        })
      }

  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container admin mr-1">
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
            <p className="m-3">
              <div className="row">
                <div className="col-md-4 text-nowrap">
                  Company UserName
                </div>
                <div className="col-md-8">
                  :{this.state.userName}
                </div>
              </div>
            </p>
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
              rowData = {this.state.jobs  }
              rowSelection = "multiple"
              onGridReady = {params => this.gridApi = params.api}
              onCellDoubleClicked = {this.handleClick}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid row">
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to="/admin/addJob"><button type="button" className="btn btn-block btn-success m-1">Add Job</button></Link>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/editCompany/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Edit Details</button></Link>
        </div>
        <div className="col-md-2">
          <Popup trigger={
          <button type="button" className="btn btn-block btn-success m-1">Deactivate</button>}position="top center"
            >{close => (
            <div className=" p-1">
              <a className="close" onClick={close}>&times;</a>
                <button type="button" className="btn btn-block btn-warning p-1 mt-1" onClick={this.handleDeactivate}>Confirm</button>
            </div>
          )}
          </Popup>
        </div>
        <div className="col-md-2">
          <Popup trigger={
          <button type="button" className="btn btn-block btn-success m-1">Reset Password</button>}position="top center"
          >{close => (
          <div className=" p-1">
            <a className="close" onClick={close}>&times;</a>
            <form className="form" onSubmit = {this.handleSubmit} onChange={this.handleChange}>
                <label htmlFor="password">New Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    maxLength="300"
                    value={this.state.password}
                    required
                    />
                  <button type="submit" className="btn btn-block btn-primary p-1 mt-1">Confirm</button>
            </form>
          </div>)}
          </Popup>
        </div>
        <div className="col-md-2"></div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to="/admin/companies/"><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
