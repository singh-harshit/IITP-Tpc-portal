import React from "react";
import axios from 'axios';
import Dropdown from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';

export class AdminBackup extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    loading:false,
    backupDates:[],
    restorationDate:'',
  };
  }
    componentDidMount = () =>{
      this.getBackup();
    };
    getBackup = () =>{
        axios.get('/backend/admin/backupDates',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data;
            console.log('dates',data);
            this.setState({
              backupDates:data.backupDates
            })
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
            this.setState({
              redirect:"/error"
            })
          });
      };
      backup = () =>{
        axios.get('/backend/admin/backup',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data;
            console.log('data',data);
            this.getBackup();
          })
          .catch((e)=>{
            console.log('Error Retrieving data',e);
          });
      }
      startNewSession = () =>{
        axios.patch('/backend/admin/startNewSession',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
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
          restorationDate:this.state.restorationDate
        }
        console.log(payload);
        try{
          this.setState({loading:true});
          await axios({
            url:`/backend/admin/restore`,
            method:"post",
            data:payload,
            options:options,
            headers: {
    					'x-auth-token': this.state.authToken,
    					'x-refresh-token': this.state.refreshToken,
    				}
          })
          .then(res =>{
            console.log('data has been sent to server',res);
            this.setState({restorationDate:''})
          });
          this.setState({
            loading:false});
        }catch(error){
          console.log('data error',error);
        }
      }
      handleChange = (event)=>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]:value
        })
      }
  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
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
        <div className="col-md-4">
          <h3>Restore</h3>
        </div>
        <div className="col-md-4">
          <select className="form-control" name="restorationDate" onChange={this.handleChange} value={this.state.restorationDate} required>
            <option value="">Select</option>
            {
              this.state.backupDates.map((element) =>{
                return(<Dropdown value={element} name={element}/>)
              })
            }
          </select>
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
