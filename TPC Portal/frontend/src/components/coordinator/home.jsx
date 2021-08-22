import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import axios from "axios";
import  Dropdown  from '../../assets/dropDown';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Redirect} from 'react-router-dom';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class CoordinatorHome extends Component {

	constructor(props)
  {
	  super(props);
	  this.state =
	  {
	    refreshToken:localStorage.getItem('refreshToken'),
			authToken:localStorage.getItem('authToken'),
			combinedStats:{
				newCompanyRegistration:0,
				newStudentRegistration:0,
				totalOngoingProcess:0,
				totalOpenProcess:0,
				totalCompanyRequests:0,
				totalStudentRequests:0
			},
			options1 : {
	      height: 250,
	      width: 250,
				exportEnabled: true,
				animationEnabled: true,
				title: {
					text: "Student Data"
				},
				data: []
			},
			options2 : {
				height: 250,
				exportEnabled: true,
				animationEnabled: true,
					title:{
						text: "",
						fontFamily: "arial black",
						fontColor: "#695A42"
					},
					axisX: {
						interval: 1,

					},
					axisY:{
						gridColor: "#B6B1A8",
						tickColor: "#B6B1A8"
					},
					toolTip: {
						shared: true,
						reversed: true
					},
					data: []
			},
			current:0,
			programs:[],
			columnDefs: [
	      {headerName: 'Company',field: 'companyName', sortable:true, filter:true},
				{headerName: 'Job Title',field: 'jobTitle', sortable:true, filter:true},
	      {headerName: 'Process',field: 'stepName',sortable:true, filter:true},
	      {headerName: 'Date',field: 'stepDate', sortable:true, filter:true},
	     ],
			 rowData1:[],
			 rowData2:[]
		};

		this.renderChart = this.renderChart.bind(this);
	}

	componentDidMount() {
    this.getHome();
  }

  getHome = () => {
    axios.get("/backend/coordinator/home/",{
				headers: {
					'x-auth-token': this.state.authToken,
					'x-refresh-token': this.state.refreshToken,
				}
			})
      .then((response) => {
        const data = response.data;
				let program = [];
				let internshipStats=[];
				let fteStats=[];
				let placedStudents=0;
				let unplacedStudents=0;
				Object.keys(data.fteStats.fteData).forEach((key, i) => {
					let placedPoints=[];
					let unplacedPoints=[];
					data.fteStats.fteData[key].forEach((item, i) =>
					{
						placedPoints.push({label:item.course,y:item.placedStudents});
						let up=item.totalStudents-item.placedStudents;
						unplacedPoints.push({label:item.course,y:up});
						placedStudents+=item.placedStudents;
						unplacedStudents+=up;
					});

					let graphData=[];
					graphData.push({
						type: "stackedColumn",
						name: "Placed",
						showInLegend: true,
						dataPoints: placedPoints,
					});
					graphData.push({
						type: "stackedColumn",
						name: "Unplaced",
						showInLegend: true,
						dataPoints: unplacedPoints,
					});
					fteStats.push({
						program:key,
						graphData:graphData
					});
				});
				let fte={
					companiesRegistered:data.fteStats.companiesRegistered,
					jobRegistered:data.fteStats.jobRegistered,
					offerProvidedFte: data.fteStats.offerProvidedFte,
					ongoingFteJobs: data.fteStats.ongoingFteJobs,
					openFteJobs: data.fteStats.openFteJobs,
					placedStudents:placedStudents,
					unplacedStudents:unplacedStudents,
					fteStats:fteStats,
				};
				placedStudents=0;
				unplacedStudents=0;
				Object.keys(data.internshipStats.internData).forEach((key, i) => {
					let placedPoints=[];
					let unplacedPoints=[];
					data.internshipStats.internData[key].forEach((item, i) =>
					{
						placedPoints.push({label:item.course,y:item.placedStudents});
						let up=item.totalStudents-item.placedStudents;
						unplacedPoints.push({label:item.course,y:up});
						placedStudents+=item.placedStudents;
						unplacedStudents+=up;
					});
					program.push(key);
					let graphData=[];
					graphData.push({
						type: "stackedColumn",
						name: "Placed",
						showInLegend: true,
						dataPoints: placedPoints,
					});
					graphData.push({
						type: "stackedColumn",
						name: "Unplaced",
						showInLegend: true,
						dataPoints: unplacedPoints,
					});
					internshipStats.push({
						program:key,
						graphData:graphData
					});
				});
				let intern={
					companiesRegistered:data.internshipStats.companiesRegistered,
					jobRegistered:data.internshipStats.jobRegistered,
					offerProvidedInternship: data.internshipStats.offerProvidedInternship,
					ongoingInternshipJobs: data.internshipStats.ongoingInternshipJobs,
					openInternshipJobs: data.internshipStats.openInternshipJobs,
					placedStudents:placedStudents,
					unplacedStudents:unplacedStudents,
					internshipStats:internshipStats,
				}
				this.setState({
					combinedStats:data.combinedStats,
					programs:program,
					intern:intern,
					fte:fte,
					rowData1:data.combinedStats.upComingSchedule.fteUpcomingSchedule,
					rowData2:data.combinedStats.upComingSchedule.internUpcomingSchedule,
					onlyCpiUpdate:data.onlyCpiUpdate,
				})
				this.handleGraph1();
      })
      .catch((error) => {
        this.setState({
          redirect:"/error"
        })
      });
  };
	handleProgramChange = (event) =>{
		const target = event.target;
		const name = target.name;
		const value = target.value;
		this.setState({program:value})
		this.handleGraph2(value);
	}
	handleGraph2 =(value)=>{
		let option=this.state.options2;
		if(value==='')option.data=[];
		if(this.state.current===1)
		{
			let internshipStats=this.state.intern.internshipStats;
			internshipStats.forEach((item, i) => {
				if(item.program===value)
				{
					option.data=item.graphData;
				}
			});
		}
		else
		{
				let fteStats=this.state.fte.fteStats;
				fteStats.forEach((item, i) => {
					if(item.program===value)
					{
						option.data=item.graphData;
					}
				});
		}
		this.renderChart();
	}
	renderChart(){
		var chart = this.chart;
		chart.render();
		var chart1 = this.chart1;
		chart1.render();
	}
	handleGraph1= ()=>{
		let newdata = [];
		if(this.state.current===1)
		{
			this.setState({
				companiesRegistered:this.state.intern.companiesRegistered,
				jobRegistered:this.state.intern.jobRegistered,
				openJobs:this.state.intern.openInternshipJobs,
				offerProvided:this.state.intern.offerProvidedInternship,
				OngoingJobs:this.state.intern.ongoingInternshipJobs
			});
			let dataPoints=[];
			dataPoints.push({label:"Placed",y:this.state.intern.placedStudents});
			dataPoints.push({label:"Unplaced",y:this.state.intern.unplacedStudents});
			newdata.push({
				type: "pie",
				startAngle: 90,
				toolTipContent: "<b>{label}</b>: {y}",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 12,
				indexLabel: "{label} - {y}",
				dataPoints: dataPoints
			});
		}
		else {

			this.setState({
				companiesRegistered:this.state.fte.companiesRegistered,
				jobRegistered:this.state.fte.jobRegistered,
				openJobs:this.state.fte.openFteJobs,
				offerProvided:this.state.fte.offerProvidedFte,
				OngoingJobs:this.state.fte.ongoingFteJobs
			});
			let dataPoints=[];
			dataPoints.push({label:"Placed",y:this.state.fte.placedStudents});
			dataPoints.push({label:"Unplaced",y:this.state.fte.unplacedStudents});
			newdata.push({
				type: "pie",
				startAngle: 0,
				toolTipContent: "<b>{label}</b>: {y}",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 12,
				indexLabel: "{label} - {y}",
				dataPoints: dataPoints
			});
		}
		this.state.options1.data=newdata;
		this.renderChart();
	}
	handleChange = async () =>{
		try {
			 if(this.state.current===1)
			{
				 await this.setState({
					current:0,
					program:''
				});
			}
			else
			{
				await this.setState({current:1,program:''});
			}
		} catch (e) {

		} finally {

		}
		this.handleGraph1();
		this.handleGraph2('');
	}

	render() {
		if (this.state.redirect)
		{
			return <Redirect to={this.state.redirect} />
		}
		return (
		<div className=" p-3 m-3 admin">
			<div className="d-flex bg-dark rounded p-2 mb-2 justify-content-center">
				<div className="col-md-6">
					<button type="button" className="btn btn-block btn-primary m-1" onClick={this.handleChange}>
						{
							this.state.current ? "INTERNSHIP":"FTE"
						}
					</button>
				</div>
			</div>
			<div className="row border rounded border-success">
				<div className="col-md-4">
					<ul className="list-group list-group-flush">
					  <li className="list-group-item d-flex justify-content-between align-items-center">Companies Registered:<span className="badge badge-primary badge-pill">{this.state.companiesRegistered}</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Jobs Registered:<span className="badge badge-primary badge-pill">{this.state.jobRegistered}</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Jobs Open:<span className="badge badge-primary badge-pill">{this.state.openJobs}</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Offers Provided:<span className="badge badge-primary badge-pill">{this.state.offerProvided}</span></li>
						<li className="list-group-item d-flex justify-content-between align-items-center">Ongoing processes:<span className="badge badge-primary badge-pill">{this.state.OngoingJobs}</span></li>
					</ul>
				</div>
				<div className="col-md-3">
					<CanvasJSChart options = {this.state.options1} onRef={ref => this.chart1 = ref}/></div>
				<div className="col-md-5 p-1">
					<select className="form-control" name="program" value={this.state.program} onChange={this.handleProgramChange} >
						<option value="">Select</option>
						{
							this.state.programs.map((element,i) =>{
								return(<Dropdown key={i} value={element} name={element}/>)
							})
						}
					</select>
      		<CanvasJSChart options = {this.state.options2} onRef={ref => this.chart = ref}/>
				</div>
			</div>
			<div className="row border rounded border-success mt-3">
				<div className="col-md-4">
					<h4>New registrations:</h4>
					<ul className="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Companies:<span className="badge badge-primary badge-pill">{this.state.combinedStats.newCompanyRegistration}</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Students:<span className="badge badge-primary badge-pill">{this.state.combinedStats.newStudentRegistration}</span></li>
					</ul>
				</div>
				<div className="col-md-4">
					<h4>New Requeusts:</h4>
					<ul className="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Companies:<span className="badge badge-primary badge-pill">{this.state.combinedStats.totalCompanyRequests}</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Students:<span className="badge badge-primary badge-pill">{this.state.combinedStats.totalStudentRequests}</span></li>
					</ul>
				</div>
				<div className="col-md-4">
					<h4>Ongoing processes:</h4>
					<ul className="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Open registrations:<span className="badge badge-primary badge-pill">{this.state.combinedStats.totalOpenProcess}</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Ongoing processes:<span className="badge badge-primary badge-pill">{this.state.combinedStats.totalOngoingProcess}</span></li>
					</ul>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-md-6 border rounded border-success p-3">
					<p>FTE Upcoming Schedule</p>
					<div
	          className="ag-theme-balham"
	          style={{
	            height:500,
	          }}
	          >
	          <AgGridReact
	            columnDefs = {this.state.columnDefs}
	            rowData = {this.state.rowData1}
	            rowSelection = "multiple"
	            onGridReady = {params => this.gridApi = params.api}
	            onCellDoubleClicked={this.handleClick}
	            getRowHeight={this.state.getRowHeight}
	          />
	        </div>
				</div>
				<div className="col-md-6 border rounded border-success p-3">
					<p>Intern Upcoming Schedule</p>
					<div
	          className="ag-theme-balham"
	          style={{
	            height:500,
	          }}
	          >
	          <AgGridReact
	            columnDefs = {this.state.columnDefs}
	            rowData = {this.state.rowData2}
	            rowSelection = "multiple"
	            onGridReady = {params => this.gridApi = params.api}
	            onCellDoubleClicked={this.handleClick}
	            getRowHeight={this.state.getRowHeight}
	          />
	        </div>
				</div>
			</div>
		</div>
		);
	}
}
