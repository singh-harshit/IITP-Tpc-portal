import React from "react";
import axios from "axios";

export class StudentRequests extends React.Component {
<<<<<<< HEAD
<<<<<<< HEAD
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      subject: "",
      message: "",
      posts: [],
    };
  }
=======
=======
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
  constructor(props){
    super(props);

  this.state = {
    id : props.match.params.id,
    subject: "",
    message: "",
    posts: [],
  };
}
<<<<<<< HEAD
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======
>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
  displayPost = (posts) => {
    if (!posts.length) {
      return null;
    }
    console.log(posts);
    return posts.map((post, index) => (
      <div
        key={index}
        className="container bg-success text-light p-3 my-3 border"
      >
        <h3>{post.subject}</h3>
        <p>{post.message}</p>
      </div>
    ));
  };

  componentDidMount = () => {
    this.getPost();
  };

  getPost = () => {
    axios
      .get("/backend/student/requests/" + this.state.id)
      .then((response) => {
        const data = response.data.oldRequests.requests;
        this.setState({ posts: data });
        console.log("data", this.state.posts);
        this.displayPost(this.state.posts);
      })
      .catch(() => {
        console.log("Error Retrieving data");
      });
  };

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    let val = this.state.posts;
    //val.push({rid:1,subject: this.state.subject,message: this.state.message});
    let subject = this.state.subject;
    let message = this.state.message;
    // let payload = {
    //   requests: val
    // };
    let payload = {
      subject: subject,
      message: message,
    };
    axios({
      url: "/backend/student/new-request/" + this.state.id,
      method: "post",
      data: payload,
    })
      .then(() => {
        console.log("data has been sent to server");
        this.resetUserInputs();
        this.getPost();
      })
      .catch(() => {
        console.log("data error");
      });
  };

  resetUserInputs = () => {
    this.setState({
      subject: "",
      message: "",
    });
  };

  render() {
    console.log("State:", this.state);
    return (
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> f55b5ccf627cf9ff3597d1f4d34734496763000e
=======

>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======

>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
=======

>>>>>>> 9d483f1142568c2a2289054928c59b804b028976
          </section>

          <div className="container p-3 border old-request">
            {this.displayPost(this.state.posts)}
          </div>
        </section>
      </div>
    );
  }
}
