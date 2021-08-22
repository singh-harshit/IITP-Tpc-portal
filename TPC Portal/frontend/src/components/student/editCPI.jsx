import React from "react";
import axios from 'axios';
import Dropdown from "../../assets/dropDown";
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
export class StudentEditCPI extends React.Component
{
  constructor(props){
    super(props);
  this.state = {
    refreshToken:localStorage.getItem('refreshToken'),
    authToken:localStorage.getItem('authToken'),
    _id:localStorage.getItem('_id'),
      currentSemester:null,
      sem1: null,
      sem2: null,
      sem3: null,
      sem4: null,
      sem5: null,
      sem6: null,
      sem7: null,
      cpi:null,
    };
  }
  handleChange = (event) =>
  {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]:value
    })
  }
  getDetails = async() => {
    this.setState({
      loading:true
    })
    await axios
      .get("/backend/student/profile/" + this.state._id,{
          headers: {
            'x-auth-token': this.state.authToken,
            'x-refresh-token': this.state.refreshToken,
          }
        })
      .then((response) => {
        const data = response.data.studentInfo;
        this.setState({
          currentSemester:data.currentSemester,
          sem1:data.spi.sem1,
          sem2:data.spi.sem2,
          sem3:data.spi.sem3,
          sem4:data.spi.sem4,
          sem5:data.spi.sem5,
          sem6:data.spi.sem6,
          sem7:data.spi.sem7,
          cpi:data.cpi,
        });
      })
      .catch(() => {
        this.setState({
          redirect:"/error"
        })
      });
      this.setState({loading:false})
  };
  componentDidMount = () =>{
    this.getDetails();
  };

  handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading:true})
        let spi = {
          sem1:this.state.sem1,
          sem2:this.state.sem2,
          sem3:this.state.sem3,
          sem4:this.state.sem4,
          sem5:this.state.sem5,
          sem6:this.state.sem6,
          sem7:this.state.sem7
        };
        let payload=({
          currentSemester:this.state.currentSemester,
          spi:spi,
          cpi:this.state.cpi,
        });
        await axios.patch(`/backend/student/updateCpiOnly/${this.state._id}`,payload,{
          headers: {
  					'x-auth-token': this.state.authToken,
  					'x-refresh-token': this.state.refreshToken,
  				}
        })
        .then(() =>{
          this.setState({redirect:`/student`})
        })
        .catch((e)=>{
          alert("Edit Cpi failed");
        });
        this.setState({loading:false})
    };

  render()
  {
    if (this.state.redirect)
    {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="base-container border rounded border-success admin">
          {
            this.state.loading ?
            (
              <div className="d-flex justify-content-center">
              <div className="spinner-grow text-success"></div>
              <div className="spinner-grow text-success"></div>
              <div className="spinner-grow text-success"></div>
              </div>
            )
            :(
        <section className="container-fluid">
          <section className="m-1 p-3">
              <form className="form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="cpi">CPI:</label>
                  </div>
                  <div className="col-md-8 p-1">
                  <input
                    type="number" step="any"
                    name="cpi"
                    className="form-control"
                    placeholder="Enter CPI"
                    value={this.state.cpi}
                    required
                  />
                  </div>
                </div>


                <div className="form-group row">
                  <div className="col-md-4 p-1">
                    <label htmlFor="currentSemester">Current Semester:</label>
                  </div>
                  <div className="col-md-8 p-1">
                    <select
                      className="form-control"
                      name="currentSemester"
                      value={this.state.currentSemester}
                      required>
                      <option value="">Select</option>
                      <option value="1">I</option>
                      <option value="2">II</option>
                      <option value="3">III</option>
                      <option value="4">IV</option>
                      <option value="5">V</option>
                      <option value="6">VI</option>
                      <option value="7">VII</option>
                      <option value="8">VIII</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem1" className='text-nowrap'>Sem 1:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem1"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem1}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem2" className='text-nowrap'>Sem 2:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem2"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem2}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem3" className='text-nowrap'>Sem 3:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem3"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem3}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem4" className='text-nowrap'>Sem 4:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem4"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem4}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem5" className='text-nowrap'>Sem 5:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem5"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem5}
                      />
                  </div>
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem6" className='text-nowrap'>Sem 6:</label>
                  </div>
                  <div className="col-md-5 p-1" width = '10vw'>
                    <input
                      type="number" step="any"
                      name="sem6"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem6}
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-1 p-1">
                    <label htmlFor="sem7" className='text-nowrap'>Sem 7:</label>
                  </div>
                  <div className="col-md-5 p-1" width= '10vw'>
                    <input
                      type="number" step="any"
                      name="sem7"
                      className="form-control"
                      placeholder="Enter SPI"
                      value={this.state.sem7}
                      />
                  </div>
                </div>
              <hr/>
              <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </form>
            <div className="container-fluid row mt-2">
              <div className="col-md-3"></div>
              <div className="col-md-3"></div>
              <div className="col-md-3"></div>
              <div className="col-md-3">
                <Link style={{ textDecoration: 'none', color: 'white' }} to={"/student"}><button type="button" class="btn btn-outline-dark btn-block m-1 col-md-12">Back</button></Link>
              </div>
            </div>
          </section>
        </section>
      )}
      </div>
  );
  }
}
