import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link} from 'react-router-dom';
import Popup from "reactjs-popup";
import {Redirect} from 'react-router-dom';
export class AdminJob extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    id: props.match.params.jid,
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true,checkboxSelection:true,onlySelected:true},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'CPI',field: 'cpi', sortable:true, filter:true},
        {headerName: 'Program',field: 'program', sortable:true, filter:true},
        {headerName: 'Mail',field: 'instituteEmail', sortable:true, filter:true},
        {headerName: 'Mob',field: 'mobileNumber', sortable:true, filter:true},
        {headerName: 'Application Status',field: 'selectedStudents', sortable:true, filter:true},
        {headerName: 'Resume',field: 'resumeFile', sortable:true, filter:true,cellRenderer: function(params) {return `<a href="${params.value}" target="_blank" rel="noopener">`+ params.value+'</a>'}},
      ],
      rowData: [],
      eligibilityCriteria:[]
    };
  }
    componentDidMount = () =>{
      this.getJob();
      this.getApplicants();
    };
    getJob = () =>{
        axios.get('/backend/admin/jobs/'+this.state.id,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.jobDetails;
            console.log('data',data);
            this.setState(data);
            this.setState({
              fillSchedule:this.fillSchedule()
            });
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
            this.setState({
              redirect:"/error"
            })
          });
      };
      getApplicants = () =>{
        axios.get(`/backend/admin/jobs/${this.state.id}/activeApplicants`,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.activeStudents;
            console.log('Applicants',data);
            this.setState({
              rowData:data
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
            this.setState({
              redirect:"/error"
            })
          });
      }
      fillSchedule = () =>{
        var schedule = Object.entries(this.state.schedule);
        const list = [];

        schedule.forEach((item, i) => {
          var stepDate=item[1].stepDate.split(',');
          var date=stepDate[0];
          var time=stepDate[1];
          list.push(<div key={i}> {item[1].stepName} - Date : {date} Time: {time}<br/></div>);
        });

        return(
          <div>{list}</div>
        );
      }
      handleDelete = (e) =>{
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data._id);
        let payload={
          studentIds:selectedData
        }
        axios({
          url: `/backend/admin/jobs/removeStudent/${this.state.id}`,
          method: 'patch',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          console.log('data has been sent to server');
          this.getApplicants()
        })
        .catch((error)=>{
          alert('Could Not Remove Student');
        });


      }
      openRegistration = (e) =>{
        let payload={
          jobId:this.state.id
        }
        axios({
          url: `/backend/admin/jobs/openRegistration`,
          method: 'patch',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          console.log('data has been sent to server');
        })
        .catch((error)=>{
          alert('Could Not Open');
        });
      }
      closeRegistration = (e) =>{
        let payload={
          jobId:this.state.id
        }
        axios({
          url: `/backend/admin/jobs/closeRegistration`,
          method: 'patch',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          console.log('data has been sent to server');
        })
        .catch((error)=>{
          alert('Could Not Close');
        });
      }
      handleDeleteJob = ()=>{
        let payload={
          jobId:this.state.id,
        }
        axios({
          url:'/backend/admin/jobs/deleteJob',
          method:'delete',
          data:payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then((s)=>{
          this.setState({
            redirect:"/admin/company/"+this.state.companyId,
          })
        })
        .catch((e)=>{
          alert("Could Not Delete Job");
        });
      }
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div>
        <button className="btn btn-block btn-sm btn-primary">{this.state.jobStatus}</button>
        Company Name : <b>{this.state.companyName}</b> <br/>
        Job Title : <b>{this.state.jobTitle}</b> <br/>
        Job Type: <b>{this.state.jobType}</b> <br/>
        JAF:
        {
            <a className="ml-2"style={{ textDecoration: 'none', color: 'black' }} href={this.state.jafFiles} target="_blank"><button type="button" className="btn btn-sm btn-primary"> Visit JAF</button></a>
        }
        <br/>
        Classification : <b>{this.state.jobCategory}</b> <br/>
        Eligibility Criteria : <div className="">{
          this.state.eligibilityCriteria.map((element)=>{
            return (
              <div className="p-3 shadow m-3 " style={{background: '#ebf6f5' }}>
                Program:{element.program}<br/>
              Courses:  {element.course.map((item)=>{return item+",";})}<br/>
                CPI Cutoff:{element.cpiCutOff}<br/>
                Tenth Marks Cutoff:{element.tenthMarks}<br/>
                Twelfth Marks Cutoff:{element.twelthMarks}<br/>
                Bachelor's Marks Cutoff:{element.bachelorsMarks}<br/>
                Master's Marks Cutoff:{element.mastersMarks}<br/>
                CTC:{element.ctc}<br/>
              </div>
            )
          })
        }
      </div>
      <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/job/eligibilityCriteria/"+this.state.id}><button type="button" class="btn btn-outline-dark m-1 btn-sm">Edit Eligibility Criteria</button></Link><br/>
        Schedule : <br/>
      {this.state.fillSchedule}
      <hr/>
      </div>
      <div
        className="ag-theme-balham"
        style={{
          height:500,
        }}
        >
        <AgGridReact
          columnDefs = {this.state.columnDefs}
          rowData = {this.state.rowData}
          rowSelection = "multiple"
          onGridReady = {params => this.gridApi = params.api}
          onCellDoubleClicked={this.handleClick}
          getRowHeight={this.state.getRowHeight}
        />
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3"></div>
        <div className="col-md-3"><button type="button" class="btn btn-warning btn-block m-1" onClick={this.openRegistration}>Open Registration</button></div>
        <div className="col-md-3"><button type="button" class="btn btn-warning btn-block m-1" onClick={this.closeRegistration}>Close Registration</button></div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/editJob/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Edit Job</button></Link>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/job/markProgress/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Mark Progress</button></Link>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }}to={"/admin/job/addStudent/"+this.state.id}><button type="button" className="btn btn-block btn-success m-1">Add Student</button></Link>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDelete}>Delete Student</button>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleDeleteJob}>Delete Job</button>
        </div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/company/"+this.state.companyId}><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}
