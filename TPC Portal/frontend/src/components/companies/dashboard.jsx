import React from "react";
import axios from 'axios';

export class CompanyProfile extends React.Component
{
  constructor(props){
    super(props);

  this.state = {
      refreshToken:localStorage.getItem('refreshToken'),
      authToken:localStorage.getItem('authToken'),
      _id:localStorage.getItem('_id'),
      companyName:"",
      userName: "",
      password: "",
      companyAddress: "",
      contact1:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },
      contact2:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },
      contact3:{
        name:'',
        designation: '',
        mailId: '',
        mobileNumber: ''
      },
    }
  }

  componentDidMount = () =>{
    this.getCompany();
  };
  getCompany = () =>{
      axios.get('/backend/company/profile/'+this.state._id,{
        headers: {
          'x-auth-token': this.state.authToken,
          'x-refresh-token': this.state.refreshToken,
        }
      })
        .then((response) => {
          const data = response.data.companyInfo;
          console.log('data',data);
          this.setState(data)
        })
        .catch((e)=>{
          this.setState({
            redirect:"/error"
          })
        });
    };

    render()
    {
      return(
        <div className="col-md-12 border p-3 m-3 rounded admin border-success">
  <h4 className="m-3">
    <div className="row">
      <div className="col-md-4 text-nowrap">
        Company Name
      </div>
      <div className="col-md-8">
        :{this.state.companyName}
      </div>
    </div>
  </h4>
  <p className="m-3">
    <div className="row">
      <div className="col-md-4 text-nowrap">
        Company UserName
      </div>
      <div className="col-md-8">
        :{this.state.userName}
      </div>
    </div>
  </p>
  <p className="m-3 p-2">
    Contact 1
    <div className="row">
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            Name
          </div>
          <div className="col-md-8">
            :{this.state.contact1.name}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Designation
          </div>
          <div className="col-md-8">
            :{this.state.contact1.designation}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            MailId
          </div>
          <div className="col-md-8">
            :{this.state.contact1.mailId}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Mobile
          </div>
          <div className="col-md-8">
            :{this.state.contact1.mobileNumber}
          </div>
        </div>
      </div>
    </div>
  </p>
  <p className="m-3 p-2">
    Contact 2
    <div className="row">
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            Name
          </div>
          <div className="col-md-8">
            :{this.state.contact2.name}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Designation
          </div>
          <div className="col-md-8">
            :{this.state.contact2.designation}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            MailId
          </div>
          <div className="col-md-8">
            :{this.state.contact2.mailId}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Mobile
          </div>
          <div className="col-md-8">
            :{this.state.contact2.mobileNumber}
          </div>
        </div>
      </div>
    </div>
  </p>
  <p className="m-3 p-2">
    Contact 3
    <div className="row">
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            Name
          </div>
          <div className="col-md-8">
            :{this.state.contact3.name}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Designation
          </div>
          <div className="col-md-8">
            :{this.state.contact3.designation}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-4">
            MailId
          </div>
          <div className="col-md-8">
            :{this.state.contact3.mailId}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            Mobile
          </div>
          <div className="col-md-8">
            :{this.state.contact3.mobileNumber}
          </div>
        </div>
      </div>
    </div>
  </p>
  <p className="m-3 p-2">
    <div className="row">
      <div className="col-md-4">
        Company Address
      </div>
      <div className="col-md-8">
        :{this.state.companyAddress}
      </div>
    </div>
  </p>
</div>
      )
    }
  }
