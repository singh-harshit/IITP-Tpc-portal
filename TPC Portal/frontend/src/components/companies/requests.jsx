import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';


export class CompanyRequests extends React.Component{

  constructor(props){
    super(props);

    this.state = {
        refreshToken:localStorage.getItem('refreshToken'),
        authToken:localStorage.getItem('authToken'),
        _id:localStorage.getItem('_id'),
    subject: "",
    message: "",
    posts: [],
  };
  }

  displayPost = (posts) =>{
    if(!posts.length){ return null;}
    return posts.map((post,index) =>(
      <div key={index} className="container bg-success text-light p-3 my-3 border">
        <h3>{post.subject}</h3>
        <p>{post.message}</p>
      </div>
    ));
  };

  componentDidMount = () =>{
    this.getPost();
  };

  getPost = () =>{
    axios.get('/backend/company/requests/'+this.state._id,{
      headers:
      {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then((response) => {
        const data = response.data.oldRequests.requests;
        this.setState({posts: data});
        this.displayPost(this.state.posts);
      })
      .catch(()=>{
        this.setState({
          redirect:"/error"
        })
      });
  }

  handleChange = (event) =>{
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
     [name]:value
    });

  };

  submit = (event) =>{
    event.preventDefault();

    let subject = this.state.subject;
    let message = this.state.message;
    let payload = {
      subject: subject,
      message: message,
    };
    axios({
      url: "/backend/company/new-request/" + this.state._id,
      method: "post",
      data: payload,
      headers:
      {
        'x-auth-token': this.state.authToken,
        'x-refresh-token': this.state.refreshToken,
      }
    })
      .then(() => {
        this.resetUserInputs();
        this.getPost();
      })
      .catch((error) => {
        alert("Could Not Send Request");
      });
  };

  resetUserInputs = () =>{
    this.setState({
      subject:'',
      message:''
    });
  };

  render(){
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container">
        <section className="container-fluid">
          <section className="row justify-content-around bg-light new-request">
            <div>
              <h2 className="text-center">New Request:</h2>
              <br />
              <form onSubmit={this.submit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    placeholder="Enter Subject"
                    value={this.state.subject}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-input">
                  <textarea
                    name="message"
                    className="form-control"
                    cols="30"
                    rows="5"
                    value={this.state.message}
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <br />
                <button type="submit" className="btn btn-primary btn-block">
                  Submit Request
                </button>
              </form>
              <br />
              <h2>Old Request:</h2>
            </div>

          </section>

          <div className="container p-3 border old-request">
            {this.displayPost(this.state.posts)}
          </div>
        </section>
      </div>
    );
  }
}
