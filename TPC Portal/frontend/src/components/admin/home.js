import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class Home extends Component {
	render() {
		const options1 = {
      height: 250,
      width: 250,
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: "Student Data"
			},
			data: [{
				type: "pie",
				startAngle: 0,
				toolTipContent: "<b>{label}</b>: {y}%",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 12,
				indexLabel: "{label} - {y}",
				dataPoints: [
					{ y: 1, label: "Placed" },
					{ y: 1, label: "Unplaced" },
				]
			}]
		}
		const options2 = {
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
					intervalType: "year"
				},
				axisY:{
					valueFormatString:"$#0bn",
					gridColor: "#B6B1A8",
					tickColor: "#B6B1A8"
				},
				toolTip: {
					shared: true,
					content: toolTipContent
				},
				data: [{
					type: "stackedColumn",
					showInLegend: true,
					color: "#696661",
					name: "Q1",
					dataPoints: [
						{ y: 6.75, x: new Date(2010,0) },
						{ y: 8.57, x: new Date(2011,0) },
						{ y: 10.64, x: new Date(2012,0) },
						{ y: 13.97, x: new Date(2013,0) },
						{ y: 15.42, x: new Date(2014,0) },
						{ y: 17.26, x: new Date(2015,0) },
						{ y: 20.26, x: new Date(2016,0) }
					]
					},
					{
						type: "stackedColumn",
						showInLegend: true,
						name: "Q2",
						color: "#EDCA93",
						dataPoints: [
							{ y: 6.82, x: new Date(2010,0) },
							{ y: 9.02, x: new Date(2011,0) },
							{ y: 11.80, x: new Date(2012,0) },
							{ y: 14.11, x: new Date(2013,0) },
							{ y: 15.96, x: new Date(2014,0) },
							{ y: 17.73, x: new Date(2015,0) },
							{ y: 21.5, x: new Date(2016,0) }
						]
				}]
		}
		function toolTipContent(e) {
			var str = "";
			var total = 0;
			var str2, str3;
			for (var i = 0; i < e.entries.length; i++){
				var  str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\"> "+e.entries[i].dataSeries.name+"</span>: $<strong>"+e.entries[i].dataPoint.y+"</strong>bn<br/>";
				total = e.entries[i].dataPoint.y + total;
				str = str.concat(str1);
			}
			str2 = "<span style = \"color:DodgerBlue;\"><strong>"+(e.entries[0].dataPoint.x).getFullYear()+"</strong></span><br/>";
			total = Math.round(total * 100) / 100;
			str3 = "<span style = \"color:Tomato\">Total:</span><strong> $"+total+"</strong>bn<br/>";
			return (str2.concat(str)).concat(str3);
		}

		return (
		<div className="p-3 m-3 float-right admin-home">
			<div className="row border rounded border-success">
				<div className="col-md-4">
					<ul class="list-group list-group-flush">
					  <li className="list-group-item d-flex justify-content-between align-items-center">Companies Registered:<span class="badge badge-primary badge-pill">12</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Jobs Registered:<span class="badge badge-primary badge-pill">12</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Jobs Open:<span class="badge badge-primary badge-pill">12</span></li>
					  <li className="list-group-item d-flex justify-content-between align-items-center">Offers Provided:<span class="badge badge-primary badge-pill">12</span></li>
						<li className="list-group-item d-flex justify-content-between align-items-center">Ongoing processes:<span class="badge badge-primary badge-pill">12</span></li>
					</ul>
				</div>
				<div className="col-md-3">
					<CanvasJSChart options = {options1}/></div>
				<div className="col-md-5">
      		<CanvasJSChart options = {options2}/>
				</div>
			</div>
			<div className="row border rounded border-success mt-3">
				<div className="col-md-6">
					<h4>New registrations:</h4>
					<ul class="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Companies:<span class="badge badge-primary badge-pill">12</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Students:<span class="badge badge-primary badge-pill">12</span></li>
					</ul>
					<h4>New Requeusts:</h4>
					<ul class="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Companies:<span class="badge badge-primary badge-pill">12</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Students:<span class="badge badge-primary badge-pill">12</span></li>
					</ul>
				</div>
				<div className="col-md-6">
					<h4>Ongoing processes:</h4>
					<ul class="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Open registrations:<span class="badge badge-primary badge-pill">12</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Ongoing processes:<span class="badge badge-primary badge-pill">12</span></li>
					</ul>
					<h4>Upcoming Schedule:</h4>
					<ul class="list-group list-group-flush">
						 <li className="list-group-item d-flex justify-content-between align-items-center">Companies:<span class="badge badge-primary badge-pill">12</span></li>
						 <li className="list-group-item d-flex justify-content-between align-items-center">Students:<span class="badge badge-primary badge-pill">12</span></li>
					</ul>
				</div>
			</div>
		</div>
		);
	}
}
