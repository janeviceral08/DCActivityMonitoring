import React, { Component } from 'react';
import axios from 'axios';
import { FcSettings } from "react-icons/fc";
import { Modal, Button, } from "react-bootstrap";
import moment from 'moment';
import cogoToast from 'cogo-toast';




class ButtonAreaSelections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setTerminalModal: false,
      AreaList: [],
      NewTerminalCode: '',
      PasswordTerminal: '',
      TerminalCode: '',
    };
  }



  componentDidMount() {
    const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'No Data';
    console.log('useterminalCOde:', useterminalCOde)
    if (useterminalCOde === "No Data") {
      cogoToast.error("Please set Terminal", { position: 'top-center', heading: 'No Terminal' });
    } else {

      window.location.href = `/ScanningPage/3rd%20Level/A0011`
    }

    this.setState({ TerminalCode: useterminalCOde })
    const postData = {
      "sessionManagement": { "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR" },
      "dtr": {}
    }

    const API = 'http://210.5.69.249:29173/api/DC/TimeAttendance/AreaList'
    //http://210.5.69.249:29173/api/DC/TimeAttendance/AreaList
    /*      const requestOptions = {
           method: 'POST', // *GET, POST, PUT, DELETE, etc.
           body: postData,
            headers: { 'Content-Type': 'application/json',},
           
       };
       fetch(API, requestOptions)
           .then((data) => console.log('AreaList: ',data))
           .catch((error)=> {
             console.log('Error AreaList: ',error);
           }); */
    axios.post(API, postData, { withCredentials: false })
      .then((response) => {

        let responseValue = response.data.Value.Table;
        let responseStatus = response;

        console.log('responseStatus: ', responseStatus);
        console.log('AreaList: ', responseValue);

        if (responseStatus.status === 200) {
          this.setState({ AreaList: responseValue.sort((a, b) => a.Description.localeCompare(b.Description)) })
        }

      })
      .catch((error) => {
        console.log('Error AreaList: ', error);
      });

  }


  SaveTerminal = () => {
    if (this.state.PasswordTerminal == '0729') {
      //localStorage.removeItem('terminalCode')
      localStorage.setItem('terminalCode', this.state.NewTerminalCode);
      this.setState({ setTerminalModal: false, NewTerminalCode: '', TerminalCode: this.state.NewTerminalCode })
      cogoToast.success('Updated Sucessfully!', { hideAfter: 5 });
    } else {
      cogoToast.error("Please enter valid password", { position: 'top-center', heading: 'Invalid Password' });
    }
  }


  render() {
    return (
      <div className="IndexBody" style={{ height: window.innerHeight }}>
        <div className="text-center">
          <img src={require("../Assets/GABC.png")} className="img-fluid" alt="GABC logo" style={{ width: '30%' }} />
        </div>
        <div className="text-center">
          <p className="fs-1 fw-bold">Welcome To DC Time & Activity Monitoring</p>
        </div>
        <div className="container text-center" style={{ marginTop: '5%' }}>
          <div className="row row-cols-4">
            {this.state.AreaList.map((info, i) => (
              <div className="col ButtonAreaSelection" key={i}>
                <a onClick={() => { window.location.href = `/ScanningPage/${info.Description}/${info.SeqNo}` }}>
                  <div className="text-center g-col-6">

                    <button className="btn-primary rounded-5  bg-opacity-10" type="button">
                      <img src={`https://res.cloudinary.com/dzajikpkf/image/upload/v1667465731/Box_o5qa3u.png`} className="img-fluid" alt="GABC logo" style={{ width: '30%' }} />
                      <p>{info.Description}</p>
                    </button>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
        <Modal show={this.state.setTerminalModal}>
          <Modal.Header closeButton onClick={() => { this.setState({ setTerminalModal: false }) }}>
            <Modal.Title>Set Terminal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="row g-3">
              <div className="col-12">
                <label for="inputAddress" className="form-label">Password</label>
                <input type="password" className="form-control" id="inputAddress" placeholder="Password" onChange={(itemValue) => {
                  console.log('PasswordTerminal: ', itemValue.target.value);
                  this.setState({ PasswordTerminal: itemValue.target.value })
                }} />

              </div>
              <div className="col-12">
                <label for="inputAddress2" className="form-label">Assigned Terminal</label>
                <input type="text" className="form-control" id="inputAddress2" placeholder={this.state.TerminalCode} onChange={(itemValue) => {
                  console.log('NewTerminalCode: ', itemValue.target.value);
                  this.setState({ NewTerminalCode: itemValue.target.value })
                }} />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { this.setState({ setTerminalModal: false }) }}>
              Close
            </Button>
            <Button variant="success" onClick={this.SaveTerminal}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <FcSettings style={
          {
            position: 'absolute',
            left: 10,
            bottom: 10,
          }} size="50" onClick={() => { this.setState({ setTerminalModal: true }) }} />
      </div>
    );
  }
}


export default ButtonAreaSelections;
