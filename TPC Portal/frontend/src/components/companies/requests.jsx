import React from 'react';
import axios from 'axios';


export class CompanyRequests extends React.Component{

  constructor(props){
    super(props);

  this.state = {
    id : props.match.params.id,
    subject: "",
    message: "",
    posts: [],
  };
  }

  displayPost = (posts) =>{
    if(!posts.length){ return null;}
    console.log(posts);
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
    axios.get('/backend/company/requests/'+this.state.id)
      .then((response) => {
        const data = response.data.oldRequests.requests;
        this.setState({posts: data});
        console.log('data',this.state.posts);
        this.displayPost(this.state.posts);
      })
      .catch(()=>{
        console.log('Error Retrieving data');
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
      url: "/backend/company/new-request/" + this.state.id,
      method: "post",
      data: payload,
    })
      .then(() => {
        console.log("data has been sent to server");
        this.resetUserInputs();
        this.getPost();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  resetUserInputs = () =>{
    this.setState({
      subject:'',
      message:''
    });
  };

  render(){

    console.log('State:',this.state);
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
