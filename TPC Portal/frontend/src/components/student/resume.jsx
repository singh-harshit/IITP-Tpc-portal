import React from "react";
import axios from 'axios';

export class StudentResume extends React.Component
{

  constructor(props){
    super(props);
  this.state = {
    id: props.match.params.id,
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
  handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        const formData = new FormData();
        formData.append('resumeFile',this.state.resumeFile);
        formData.append('resumeLink',this.state.resumeLink);
        console.log(formData);
        axios.post('/student/resume/'+this.state.id,formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() =>{
          console.log('data has been sent to server');
        })
        .catch((error)=>{
          console.log('data error',error);
        });
    };

  render()
  {
    return(
      <div className="base-container border rounded border-success admin m-3 p-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label for="resumeFile">Resume File</label>
            <input type="file" className="form-control-file border" id='resumeFile' required onChange={this.handleFile}/>
            <label for="resumeLink">Resume Link</label>
            <input type="text" className="form-control-file border" id='resumeLink' onChange={this.handleLink}/>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
  );
  }
}
