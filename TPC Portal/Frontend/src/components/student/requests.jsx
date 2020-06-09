import React from 'react';
import axios from 'axios';


export class Requests extends React.Component{

  state = {
    title:'',
    body:'',
    posts:[]
  };

  displayBlogPost = (posts) =>{
    if(!posts.length){ return null;}

    return posts.map((post,index) =>(
      <div key={index} className="container bg-success text-light p-3 my-3 border">
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    ));
  };

  componentDidMount = () =>{
    this.getBlogPost();
  };

  getBlogPost = () =>{
    axios.get('/api')
      .then((response) => {
        const data = response.data;
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
      const payload = {
        title: this.state.title,
        body: this.state.body
      };

      axios({
        url: '/api/save',
        method: 'POST',
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
      title:'',
      body:''
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
              name="title"
              placeholder="Enter Subject"
              value={this.state.title}
              onChange={this.handleChange}
              />
          </div>
          <div className="form-input">
            <textarea
              name="body"
              class ="form-control"
              cols="30"
              rows="5"
              value={this.state.body}
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
