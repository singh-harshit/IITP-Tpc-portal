import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-enterprise";

export class Admin_companies extends Component {
  state = {
    columnDefs: [
      {
        headerName: "SNo.",
        field: "sno",
        sortable: true,
        filter: true,
        checkboxSelection: true,
        onlySelected: true,
      },
      {
        headerName: "Company",
        field: "company",
        sortable: true,
        filter: true,
        cellRenderer: function (params) {
          return (
            `<a href="https://www.google.com/search?q=${params.value}" target="_blank" rel="noopener">` +
            params.value +
            "</a>"
          );
        },
      },
      { headerName: "status", field: "status", sortable: true, filter: true },
      { headerName: "Job Title", field: "job", sortable: true, filter: true },
      {
        headerName: "Classification",
        field: "classification",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Job Status",
        field: "jobStatus",
        sortable: true,
        filter: true,
      },
    ],
    rowData: [
      {
        sno: "1",
        company: "1701me18",
        status: "1",
        cpi: 8.26,
        job: "Akshat",
        classification: "BTech",
        jobStatus: 1,
      },
      {
        sno: "1",
        company: "1701me18",
        status: "1",
        cpi: 8.26,
        job: "harshit",
        classification: "BTech",
        jobStatus: 1,
      },
      {
        sno: "1",
        company: "1701me18",
        status: "1",
        cpi: 8.26,
        job: "harshit",
        classification: "BTech",
        jobStatus: 1,
      },
    ],
    autoGroupColumnDef: {
      headerName: "Program",
      field: "program",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        checkbox: true,
      },
    },
  };
  /*
  componentDidMount(){
    fetch('url')
      .then(res => res.json())
      .then(rowData => this.setState({rowData}))
      .catch(err => console.log(err));
  }
*/
  ButtonClick = () => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => node.company + " " + node.job)
      .join(", ");
    alert(`Selected Nodes: ${selectedDataStringPresentation}`);
  };
  render() {
    return (
      <div className="container border rounded p-3 m-2 border-success float-right admin">
        <div
          className="ag-theme-balham"
          style={{
            height: 700,
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            rowSelection="multiple"
            onGridReady={(params) => (this.gridApi = params.api)}
            autoGroupColumnDef={this.state.columnDefs}
          />
        </div>
        <div className="container-fluid row mt-2">
          <div className="col-md-3">
            <button type="button" className="btn btn-block btn-success m-1">
              Add Company
            </button>
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-block btn-success m-1">
              Delete Company
            </button>
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-block btn-success m-1">
              Deactivate
            </button>
          </div>
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-block btn-success m-1"
              onClick={this.ButtonClick}
            >
              Add Bulk Company
            </button>
          </div>
        </div>
      </div>
    );
  }
}
