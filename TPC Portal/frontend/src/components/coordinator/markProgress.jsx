import React from "react";
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Link,Redirect} from 'react-router-dom';
import  CheckBox  from '../../assets/checkbox';
export class CoordinatorJobMarkProgress extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    id: props.match.params.jid,
      columnDefs: [
        {headerName: 'Name',field: 'name', sortable:true, filter:true},
        {headerName: 'Roll No',field: 'rollNo', sortable:true, filter:true},
        {headerName: 'Program',field: 'program', sortable:true, filter:true},
        {headerName: 'Course',field: 'course', sortable:true, filter:'agTextColumnFilter'},
        {headerName: 'Attendance',field: 'attendance',cellRenderer: 'GridCheckBox',},
        {headerName: 'Shortlisted',field: 'selection', sortable:true,cellRenderer: 'GridCheckBox'},
      ],
      studentData:
      [
        {
          name:'Registration',
          students:[{_id : 1, name:'harshit',attendance:false,selection:true},{_id : 2, name:'harshit',attendance:false,selection:false},{_id : 3, name:'dasds',attendance:true,selection:false}],
        },
        {
          name:'PPT',
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
      jobStatus:'',
      oldsteps:[],
      currentSteps:[],
      status:[],
      }
    };
    componentDidMount = () =>{
      this.getAllDetails()
      this.getProgress();
      this.getSteps();
    }
    getSteps = ()=>{
      axios.get(`/backend/coordinator/jobs/stepsWithStatus/${this.state.id}`,{
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
        .then((response) => {
          const data = response.data.stepsWithStatus;
          this.setState({currentSteps:data});
          let steps = [];
          data.forEach((item, i) => {
            let status=false
            if(item.stepStatus==="Completed")status=true
            steps.push({value:item.stepName,isChecked:status})
          });
          this.setState({steps:steps})
        })
        .catch((e)=>{
          this.setState({
            redirect:"/error"
          })
        });
    }
    getAllDetails = () =>{
        axios.get('/backend/allDetails')
          .then((response) => {
            const data = response.data;
            this.setState({
              oldsteps:data.steps,
              status:data.status
            })
          })
          .catch((e)=>{
            this.setState({
              redirect:"/error"
            })
          });
      };
      getProgress = () =>{
        axios.get(`/backend/coordinator/jobs/markProgress/${this.state.id}`,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data.jobStepsInfo.progressSteps;
            let studentData=[];
            data.forEach((item, i) => {
              var students=[];
              if(i!==0)
              {
                studentData[i-1].students.forEach((student, j) => {
                  let selection=false;
                  let attendance=false;
                  if(item.qualifiedStudents.find((selected)=> selected._id===student._id))selection=true;
                  else selection=false;
                  if(item.absentStudents.find((selected)=> selected._id===student._id))attendance=false;
                  else attendance=true;
                  if(student.selection){
                     students.push({
                    _id:student._id,
                    name:student.name,
                    rollNo:student.rollNo,
                    program:student.program,
                    course:student.course,
                    attendance:attendance,
                    selection:selection,
                })}
               })
               item.qualifiedStudents.forEach((student, i) => {
                 if(students.find((selected)=> selected._id===student._id));
                 else {
                   students.push({
                  _id:student._id,
                  name:student.name,
                  rollNo:student.rollNo,
                  program:student.program,
                  course:student.course,
                  attendance:true,
                  selection:true,
              })
                 }
               });

                studentData.push({
                  name:item.name,
                  students:students,
                  status:item.status
                })
              }
              else {
                item.qualifiedStudents.forEach((student, j) => {
                  students.push({
                    _id:student._id,
                    name:student.name,
                    rollNo:student.rollNo,
                    program:student.program,
                    course:student.course,
                    attendance:true,
                    selection:true,
                  })
                });
                studentData.push({
                  name:item.name,
                  students:students,
                  status:item.status
                })
              }
            });
            this.setState({studentData:studentData})
          })
          .catch((e)=>{

            this.setState({
              redirect:"/error"
            })
          });
      }

      handleAllChecked = (event) => {
        let steps = this.state.steps
        steps.forEach(step => step.isChecked = event.target.checked)
        this.setState({steps: steps})
      }

      handleCheckChildElement = (event) => {
        let steps = this.state.steps;
        steps.forEach(step => {
           if (step.value === event.target.value)
              step.isChecked =  event.target.checked
        })
        this.setState({steps: steps})
      }
      handleMarkCompleted = (event) =>{
        event.preventDefault();
        let stepsWithStatus=[]
        this.state.steps.forEach((item, i) => {
          let status= item.isChecked ? "Completed":"Not Completed"
          stepsWithStatus.push({name:item.value,status:status})
        });
        let payload = {
          stepsWithStatus:stepsWithStatus
        }
        axios({
          url: `/backend/coordinator/jobs/markCompleted/${this.state.id}`,
          method: 'patch',
          data: payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then((s) =>{
          alert("Marked");
          this.getProgress();
          this.getSteps();
        })
        .catch((e)=>{
          alert('Could Not Process the Request');
        });
      }
      handleClick = (e) =>{
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
    let studentData = this.state.studentData;
    this.setState({
      currentStep:e.target.value,
      rowData:[]
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
    let target=e.target;
    let name = target.name;
    let value = target.value;
    this.setState({
      [name]:value
    })
  }
  handleSubmit = (event) =>{
    event.preventDefault();
    let payload={
      stepName:this.state.stepName,
      date:this.state.stepDate+","+this.state.stepTime
    }
    axios({
      url: `/backend/coordinator/jobs/addStep/${this.state.id}`,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((s) =>{
      this.setState({
        stepDate:'',
        stepTime:'',
        stepName:'',
      })
      alert("Step Added");
      this.getAllDetails();
      this.getProgress();
      this.getSteps();
    })
    .catch((e)=>{
      alert("Step Not Added");
    });
  }
  handleSaveProgress = (event)=>{
    event.preventDefault();
    if(this.state.currentStep==="Registration"){alert("Registration Step Could not be updated");}
    else{
    let data=this.state.rowData;
    let selectedIds = [];
    data.forEach((student,i)=>{if(student.selection)selectedIds.push(student._id);});
    let absentIds = []
    data.forEach((student,i)=>{if(!student.attendance)absentIds.push(student._id);});
    let payload = {
      stepName:this.state.currentStep,
      selectedIds:selectedIds,
      absentIds:absentIds,
    }
    axios({
      url: `/backend/coordinator/jobs/saveProgress/${this.state.id}`,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((s) =>{
      this.getProgress();
      alert("Saved Progress");
      this.setState({
        currentStep:'',
        rowData:[]
      })
    })
    .catch((e)=>{
      alert("Request Failed")
    });
  }
  }
  handleSaveStatus = ()=>{
    let payload={
      jobStatus:this.state.jobStatus
    }
    axios({
      url: `/backend/coordinator/jobs/saveJobStatus/${this.state.id}`,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((s) =>{
      this.getProgress();
      alert("Saved Status",s.data.message);
      this.setState({jobStatus:''});
    })
    .catch((e)=>{
      alert("Request Failed");
    });
  }
  handleDeleteSubmit = (event)=>{
    event.preventDefault();
    let payload={
      stepName:this.state.delstepName
    }
    axios({
      url: `/backend/coordinator/jobs/removeStep/${this.state.id}`,
      method: 'patch',
      data: payload,
      headers: {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
    .then((s) =>{
      this.setState({
        delstepName:'',
      })
      alert("Step Added");
      this.getAllDetails();
      this.getProgress();
      this.getSteps();
    })
    .catch((e)=>{
      alert("Could Not Remove step");
    });
  }
  onBtnExport = () => {this.gridApi.exportDataAsCsv();}
  onShortlistAll = ()=>{
    this.setState(prevState => ({
      rowData: prevState.rowData.map(
        el => el?{ ...el, attendance:true,selection: true }:null
      )
    }))
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
        <form className="form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="stepName"><h6>Add New Step:</h6></label>
            </div>
            <div className="col-md-5 p-1">
                <select
                  className="form-control"
                  name="stepName"
                  value={this.state.stepName}
                  required
                  >
                  <option value="">Select</option>
                  {
                    this.state.oldsteps.map((step)=>{return (<option value={step}>{step}</option>)})
                  }
                </select>

            </div>
            <div className="col-md-2 p-1"><input className="form-control" type="date" name="stepDate" value={this.state.stepDate} required/></div>
            <div className="col-md-2 p-1"><input className="form-control" type="time" name="stepTime" value={this.state.stepTime} required/></div>
          </div>
          <div className="d-flex justify-content-center"><button type="submit" className="btn btn-primary btn-block col-md-3">Add Step</button></div>
        </form>
        <hr/>
        <form className="form" onSubmit={this.handleDeleteSubmit} onChange={this.handleChange}>
          <div className="form-group row">
            <div className="col-md-3 p-1">
              <label htmlFor="delstepName"><h6>Delete Step:</h6></label>
            </div>
            <div className="col-md-5 p-1">
                <select
                  className="form-control"
                  name="delstepName"
                  value={this.state.delstepName}
                  required
                  >
                  <option value="">Select</option>
                  {
                    this.state.currentSteps.map((step)=>{return (<option value={step.stepName}>{step.stepName}</option>)})
                  }
                </select>
            </div>
            <div className="col-md-4"><button type="submit" className="btn btn-primary btn-block">Delete Step</button></div>
            </div>
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
              {
                this.state.currentSteps.map((step)=>{return <option value={step.stepName}>{step.stepName}</option>})
              }
            </select>
        </div>
      </div>
    <button onClick={() => this.onBtnExport()}>Export</button>
    <button onClick={() => this.onShortlistAll()}>Shortlist All</button>
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
          <label htmlFor="jobStatus"><h5>Select Status:</h5></label>
        </div>
        <div className="col-md-9 p-1">
            <select
              className="form-control"
              name="jobStatus"
              value={this.state.jobStatus}
              onChange={this.handleChange}
              >
              <option value="">Select</option>
              {
                this.state.status.map((element)=>{return<option value={element}>{element}</option>})
              }
            </select>
        </div>
      </div>
      <div className="container-fluid row mt-2">
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleSaveProgress}>Save Progress</button>
        </div>
        <div className="col-md-3">
          <button type="button" className="btn btn-block btn-success m-1" onClick={this.handleSaveStatus}>Save Status</button>
        </div>
        <div className="col-md-3"></div>
        <div className="col-md-2">
          <Link style={{ textDecoration: 'none', color: 'white' }} to={"/coordinator/job/"+this.state.id}><button type="button" class="btn btn-outline-dark btn-block m-1 mr-5">Back</button></Link>
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
