import React from "react";
import axios from 'axios';
export class AdminBackup extends React.Component
{
  constructor(props)
  {
  super(props);
  this.state =
  {
    loading:false,
  };
  }
    componentDidMount = () =>{
      this.getBackup();
    };
    getBackup = () =>{
        axios.get('/backend/admin/backupDates')
          .then((response) => {
            const data = response.data;
            console.log('dates',data);
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      };
      backup = () =>{
        axios.get('/backend/admin/backup')
          .then((response) => {
            const data = response.data;
            console.log('data',data);
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      }
      startNewSession = () =>{
        axios.patch('/backend/admin/startNewSession')
        .then((response) => {
          const data = response.data;
          console.log('data',data);
        })
        .catch((e)=>{
          console.log('Error Retrieving data',e);
        });
      }
      restore = async () =>{
        const options = {
          onUploadProgress: (progressEvent) =>{
            const {loaded,total} = progressEvent;
            let percent = Math.floor(loaded*100/total);
            console.log(`${loaded} of ${total} | percent:${percent}%`);
          }
        }
        let payload = {
          restorationDate:'2020-6-4-0-33-59'
        }
        try{
          this.setState({loading:true});
          await axios
          .post(`/backend/admin/restore`,payload,options)
          .then(res =>{
            console.log('data has been sent to server',res);
          });
          this.setState({
            loading:false});
        }catch(error){
          console.log('data error',error);
        }
      }
  render()
  {
    return(
    <div className="base-container admin border rounded border-success m-3 p-3">
      <div className="container-fluid row mt-5">
        <div className="col-md-8">
          <h3>Backup</h3>
        </div>
        <div className="col-md-4">
          <button type="button" class="btn btn-primary btn-block" onClick={this.backup}>Backup</button>
        </div>
      </div>
      <div className="container-fluid row mt-5">
        <div className="col-md-8">
          <h3>Restore</h3>
        </div>
        {
          this.state.loading ?
          (
            <div className="col-md-4">
              <button className="btn btn-primary btn-block">
                <span className="spinner-border spinner-border-sm"></span>
                Restoring..
              </button>
            </div>
          ):
          (
              <div className="col-md-4">
                <button type="button" class="btn btn-primary btn-block" onClick={this.restore}>Restore</button>
              </div>
          )
        }
      </div>
      {
        [<div>hello</div>]
      }
      <div className="container-fluid row mt-5 mb-5">
        <div className="col-md-8">
          <h3>Start New Session</h3>
        </div>
        <div className="col-md-4">
          <button type="button" class="btn btn-primary btn-block" onClick={this.startNewSession}>Start New Session</button>
        </div>
      </div>
    </div>
  );
  }
}
