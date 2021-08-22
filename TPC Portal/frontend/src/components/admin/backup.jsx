import React from "react";
import axios from 'axios';
import Dropdown from '../../assets/dropDown';
import {Redirect} from 'react-router-dom';
import  JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from "file-saver";
export class AdminBackup extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
    loading:false,
    dloading:false,
    bloading:false,
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
            this.setState({
              backupDates:data.backupDates
            })
          })
          .catch((e)=>{
            this.setState({
              redirect:"/error"
            })
          });
      };
      backup = async() =>{
        this.setState({bloading:true})
        await axios.get('/backend/admin/backup',{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
          .then((response) => {
            const data = response.data;
            alert("Backup Completed")
            this.getBackup();
          })
          .catch((e)=>{
            alert("Backup Failed")
          });
          this.setState({bloading:false});
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
        })
        .catch((e)=>{
        });
      }
      restore = async () =>{
        const options = {
          onUploadProgress: (progressEvent) =>{
            const {loaded,total} = progressEvent;
            let percent = Math.floor(loaded*100/total);
          }
        }
        let payload = {
          restorationDate:this.state.restorationDate
        }
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
            this.setState({restorationDate:''})
          });
          this.setState({
            loading:false});
        }catch(error){
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
      downloadBackup = async () =>{
        this.setState({dloading:true})
        let payload={
          backupDate:this.state.downloadDate,
        }
        await axios({
          url:`/backend/admin/downloadBackup`,
          method:"post",
          data:payload,
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(async res =>{
          this.setState({downloadDate:''});

          let urls=res.data.links.map((link)=>"/files/"+link);
          var zip = new JSZip();
          var count = 0;
          let date=this.state.downloadDate
          await urls.forEach(function(url){
            var filename = url.replace(`/files/http://iitp-tpc-portal-file-storage.s3.ap-south-1.amazonaws.com/`,"");
            var fileURL = url.replace("http://iitp-tpc-portal-file-storage.s3.ap-south-1.amazonaws.com/","");
            // loading a file and add it in a zip file
             JSZipUtils.getBinaryContent(fileURL, function (err, data) {
               if(err) {
                  alert("file error")
               }
               zip.file(filename, data);
               count++;
               if (count == urls.length) {
                zip.generateAsync({ type: 'blob' }).then(function (content) {
                  FileSaver.saveAs(content, "backup.zip");
                });
              }
            });
          });
        })
        .catch((error)=>{
          alert("Download Failed");
        });
        this.setState({
          dloading:false
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
        {
          this.state.bloading ?
          (
            <div className="col-md-4">
              <button className="btn btn-primary btn-block">
                <span className="spinner-border spinner-border-sm"></span>
                Downloading..
              </button>
            </div>
          ):(
            <div className="col-md-4">
              <button type="button" class="btn btn-primary btn-block" onClick={this.backup}>Backup</button>
            </div>
          )
        }
      </div>
      <div className="container-fluid row mt-5">
        <div className="col-md-4">
          <h3>Download Backup</h3>
        </div>
        <div className="col-md-4">
          <select className="form-control" name="downloadDate" onChange={this.handleChange} value={this.state.downloadDate} required>
            <option value="">Select</option>
            {
              this.state.backupDates.map((element) =>{
                return(<Dropdown value={element} name={element}/>)
              })
            }
          </select>
        </div>
        {
          this.state.dloading ?
          (
            <div className="col-md-4">
              <button className="btn btn-primary btn-block">
                <span className="spinner-border spinner-border-sm"></span>
                Downloading..
              </button>
            </div>
          ):
          (
              <div className="col-md-4">
                <button type="button" class="btn btn-primary btn-block" onClick={this.downloadBackup}>Download</button>
              </div>
          )
        }
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
          <button type="button" class="btn btn-primary btn-block">Start New Session</button>
        </div>
      </div>
    </div>
  );
  }
}
