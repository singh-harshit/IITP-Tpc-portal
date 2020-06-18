import React from 'react';
import axios from 'axios';


export class Requests extends React.Component{

  state = {
    id:'1701CS55',
    _id:'5edd3dab78d3a45b97471400',
    subject:'',
    message:'',
    posts:[]
  };

  displayBlogPost = (posts) =>{
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
    this.getBlogPost();
  };

  getBlogPost = () =>{
    axios.get('/company/requests/'+this.state.id)
      .then((response) => {
        const data = response.data.oldRequests.requests;
        this.setState({posts: data});
        console.log('data',this.state.posts);
        this.displayBlogPost(this.state.posts);
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
      let val = this.state.posts;
      val.push({rid:1,subject: this.state.subject,message: this.state.message});
      let payload = {
        requests: val
      };

      axios({
        url: '/company/new-request/'+this.state._id,
        method: 'post',
        data: payload
      })
      .then(() =>{
        console.log('data has been sent to server');
        this.resetUserInputs();
        this.getBlogPost();
      })
      .catch(()=>{
        console.log('data error');
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
        <section className="row justify-content-around new-request bg-light">
          <div><h2 className="text-center">New Request:</h2><br/>
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
              className ="form-control text-area"
              cols="30"
              value={this.state.message}
              onChange={this.handleChange}
              ></textarea>
          </div><br/>
          <button type="submit" className="btn btn-primary btn-block">Submit Request</button>
        </form>
        <br/>
        <h2>Old Request:</h2>
      </div>

      </section>
      <div className='container white-board'></div>
      <div className="container p-3 border old-request">
        {this.displayBlogPost(this.state.posts)}
      </div>
    </section>
    </div>
    );
  }
}
