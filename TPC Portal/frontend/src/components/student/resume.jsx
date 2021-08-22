import React from "react";
import axios from 'axios';
import {Redirect} from 'react-router-dom';

export class StudentResume extends React.Component
{

  constructor(props){
    super(props);
  this.state = {
    refreshToken:localStorage.getItem('refreshToken'),
    authToken:localStorage.getItem('authToken'),
    _id:localStorage.getItem('_id'),
    resumeLink:'',
    resumeFile:null
  };
}

  handleFile = (event) =>
  {
    this.setState({
      resumeFile: event.target.files[0]
    });
  }
  handleLink = (event) =>
  {
    this.setState({
      resumeLink: event.target.value
    });
  }
  handleSubmit = async(event) => {
        event.preventDefault();
        if(this.state.resumeFile.size>524288){
          alert("Enter A file size less than 512 KB");
        }
        else{
          this.setState({loading:true})
        const formData = new FormData();
        let resume=this.state.resumeFile;
        var newname=localStorage.getItem("rollNo")+".pdf";
        formData.append('resumeFile',this.state.resumeFile,newname);
        formData.append('resumeLink',this.state.resumeLink);
        await axios.post('/backend/student/resume/'+this.state._id,formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
    				'x-auth-token': this.state.authToken,
    				'x-refresh-token': this.state.refreshToken,
          }
        })
        .then(() =>{
          this.setState({
            loading:false,
            redirect:"/student"
          })
        })
        .catch((error)=>{
          alert("Could not upload resume")
        });
      }
    };

  render()
  {

    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container border rounded border-success admin m-3 p-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmFor="resumeFile">Resume File</label>
            <input type="file" className="form-control-file border" id='resumeFile' required onChange={this.handleFile}/>
            <label htmFor="resumeLink">Resume Link</label>
            <input type="url" className="form-control-file border" id='resumeLink' required onChange={this.handleLink}/>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
  );
  }
}
