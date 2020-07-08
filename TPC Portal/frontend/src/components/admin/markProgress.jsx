import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link} from 'react-router-dom';
import  CheckBox  from '../../assets/checkbox';
export class AdminJobMarkProgress extends React.Component
{
  constructor(props)
  {
  super(props);
  this.state =
  {
    id: props.match.params.jid,
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'CPI',field: 'cpi', sortable:true, filter:'agNumberColumnFilter'},
        {headerName: 'Program',field: 'program', sortable:true, filter:true},
        {headerName: 'Attendance',field: 'attendance',cellRenderer: 'GridCheckBox',},
        {headerName: 'Shortlisted',field: 'selection', sortable:true,cellRenderer: 'GridCheckBox'},
      ],
      studentData:
      [
        {
          name:'step1',
          students:[{_id : 1, name:'harshit',attendance:false,selection:true},{_id : 2, name:'harshit',attendance:false,selection:false},{_id : 3, name:'dasds',attendance:true,selection:false}],
        },
        {
          name:'step2',
          students:[{_id : 1, name:'harshit',attendance:false,selection:true},{_id : 2, name:'harshit',attendance:false,selection:false}],
          status:'ongoing'
        },
      ],
      rowData:[],
      components: { GridCheckBox: getGridCheckBox() },
      steps:[
        {value:'step1',isChecked:true},
        {value:'step2',isChecked:false}],
      currentStep:null,
      jobStatus:''
      }
    };
    componentDidMount = () =>{
      this.getApplicants();
    }
      getApplicants = () =>{
        axios.get(`/backend/admin/jobs/${this.state.id}/activeApplicants`)
          .then((response) => {
            const data = response.data.activeStudents;
            console.log('Applicants',data);
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      }

      handleAllChecked = (event) => {
        let steps = this.state.steps
        steps.forEach(step => step.isChecked = event.target.checked)
        this.setState({steps: steps})
      }

      handleCheckChildElement = (event) => {
        let steps = this.state.steps;
        console.log(event.target.checked);
        steps.forEach(step => {
           if (step.value === event.target.value)
              step.isChecked =  event.target.checked
        })
        this.setState({steps: steps})
      }
      handleMarkCompleted = () =>{
        console.log(this.state.steps);
      }
      handleClick = (e) =>{
        console.log("E",e);
        if(e.colDef.field === 'attendance')
        {
          if(e.value===false){
            this.setState(prevState => ({
              rowData: prevState.rowData.map(
                el => el._id === e.data._id ? { ...el, attendance: true }: el
              )
            }))
          }
          else{
            this.setState(prevState => ({
              rowData: prevState.rowData.map(
                el => el._id === e.data._id ? { ...el, attendance: false }: el
              )
            }))
          }
        }
        else if(e.colDef.field==='selection')
        {
          if(e.value===false){
            this.setState(prevState => ({
              rowData: prevState.rowData.map(
                el => el._id === e.data._id ? { ...el, attendance:true,selection: true }: el
              )
            }))
          }
          else{
            this.setState(prevState => ({
              rowData: prevState.rowData.map(
                el => el._id === e.data._id ? { ...el, selection: false }: el
              )
            }))
          }
        }
      };


  handleStepChange = (e) =>{
    console.log(this.state);
    let studentData = this.state.studentData;
    this.setState({
      currentStep:e.target.value
    })
    studentData.forEach((data, i) => {
      if(data.name === e.target.value)
      {
        this.setState({
          rowData:data.students
        })
      }
    });
  }
  handleChange = (e)=>{
    console.log(this.state);
    let target=e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]:value
    })
  }
  render()
  {

    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div>
        <form className="form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="newStep"><h5>Add New Step:</h5></label>
            </div>
            <div className="col-md-9 p-1">
                <select
                  className="form-control"
                  name="newStep"
                  value={this.state.newStep}
                  >
                  <option value="">Select</option>
                  <option value="BTech">B.Tech</option>
                  <option value="MTech">M.Tech</option>
                  <option value="Msc">M.Sc</option>
                  <option value="PhD">Phd</option>
                </select>

            </div>
          </div>
          <div className="d-flex justify-content-center"><button type="submit" className="btn btn-primary btn-block col-md-3">Add Step</button></div>
        </form>
      </div>
      <hr/>
      <div>
        <h5>Mark Progress</h5>
        <div className="row">
          <div className="col-md-6">
            <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall"/> Check / Uncheck All
              <ul>
              {
                this.state.steps.map((step) => {
                  return (<CheckBox handleCheckChildElement={this.handleCheckChildElement}  {...step} />)
                })
              }
              </ul>
          </div>
          <div class="col-md-3"><button type="button" class="btn btn-primary btn-block" onClick={this.handleMarkCompleted}>Mark Completed</button></div>
        </div>
      </div>
      <hr/>
      <div className="row m-3">
        <div className="col-md-3 p-1">
          <label htmlFor="currentStep"><h5>Select Step:</h5></label>
        </div>
        <div className="col-md-9 p-1">
            <select
              className="form-control"
              name="currentStep"
              value={this.state.currentStep}
              onChange={this.handleStepChange}
              >
              <option value="">Select</option>
              <option value="step1">Step1</option>
              <option value="step2">Step2</option>
              <option value="Msc">M.Sc</option>
              <option value="PhD">Phd</option>
            </select>
        </div>
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
          getRowHeight={this.state.getRowHeight}
          components={this.state.components}
          onCellClicked={this.handleClick}
        />
      </div>
      <div className="row m-3">
        <div className="col-md-3 p-1">
          <label htmlFor="jobStatus"><h5>Select Step:</h5></label>
        </div>
        <div className="col-md-9 p-1">
            <select
              className="form-control"
              name="jobStatus"
              value={this.state.jobStatus}
              onChange={this.handleChange}
              >
              <option value="">Select</option>
              <option value="step1">Step1</option>
              <option value="step2">Step2</option>
              <option value="Msc">M.Sc</option>
              <option value="PhD">Phd</option>
            </select>
        </div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.state.handleSaveProgress}>Save Progress</button>
        </div>
        <div className="col-md-3"></div>
        <div className="col-md-3"></div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/admin/job/"+this.state.id}><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button></Link>
        </div>
      </div>
    </div>
  );
  }
}

function getGridCheckBox() {

  function GridCheckBox() {}
  GridCheckBox.prototype.init = function(params) {
    var tempDiv = document.createElement('div');
    if(params.colDef.field==='attendance')
    {
      if (params.value==true) {

        tempDiv.innerHTML = '<span><input type="checkbox" checked=true> Present</span>';
      } else {
        tempDiv.innerHTML =
          `<span><input type="checkbox"> Absent</span>`;
      }
    }
    else{
      if (params.value==true) {

        tempDiv.innerHTML = '<span><input type="checkbox" checked=true> Shortlisted</span>';
      } else {
        tempDiv.innerHTML =
          `<span><input type="checkbox"> Not Selected</span>`;
      }
    }
    this.eGui = tempDiv.firstChild;
  };
  GridCheckBox.prototype.getGui = function() {
    return this.eGui;
  };
  return GridCheckBox;
}
