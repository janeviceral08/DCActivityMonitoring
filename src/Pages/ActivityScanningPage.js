import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import cogoToast from 'cogo-toast';
import { FcSettings } from "react-icons/fc";
import { Modal, Button, } from "react-bootstrap";


class ActivityScanningPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: "",
      ActivityArea: [],
      selectedActivitySequence: "",
      WAMASGEEKAccount: "",
      UserID: "000000001",
      AccessID: "AC0001",
      areaCode: this.props.match.params.SeqNo,
      area: '',
      areaSeq: '',
      setTerminalModal: '',
      NewTerminalCode: '',
      PasswordTerminal: '',
      TerminalCode: '',
    };
  }





  componentDidMount() {


    this.getActivitiesData()

  }

  getActivitiesData() {
    const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'T1';
    this.setState({ TerminalCode: useterminalCOde })
    const postData = {
      "sessionManagement": {
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
      },
      "dtr": {
        "terminalID": useterminalCOde
      },
      "employee": {}
    }
    const API = '/api/DC/TimeAttendance/AreaActivityList'

    axios.post(API, postData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {

        let responseValue = response.data.Value.Table;
        let responseStatus = response;

        console.log('responseStatus: ', responseStatus);
        console.log('ActivityArea: ', responseValue);

        if (responseStatus.status === 200) {
          this.setState({
            ActivityArea: responseValue.sort((a, b) => a.ActivityDescription.localeCompare(b.ActivityDescription)),

          })
        }

      })
      .catch((error) => {
        console.log('Error AreaList: ', error);
      });

  }


  handleChangeselectedActivity = (info) => {
    console.log('this is:', info);
    //localStorage.removeItem('terminalCode')
    this.setState({ selectedActivity: info.ActivityDescription, selectedActivitySequence: info.ActivityCode, area: info.AreaDesciption, areaSeq: info.AreaCode })
    let WAMASGEEKAccount = this.state.WAMASGEEKAccount;
    let UserID = this.state.UserID;
    if (WAMASGEEKAccount.trim().length < 1) {
      const nextSibling = document.querySelector(
        `input[name=WAMASGEEKAccount]`
      );
      nextSibling.focus();
    }
    else if (UserID.trim().length < 1) {
      const nextSibling = document.querySelector(
        `input[name=UserID]`
      );
      nextSibling.focus();
    }
  };

  submitEmployeeRecord = (itemValue) => {

    console.log('UserID: ', itemValue.target.value);
    const datenow = moment().unix();
    if (this.state.selectedActivity.trim().length === 0) {
      cogoToast.error("Please select activity", { position: 'top-center', heading: 'Select Activity' });
      return;
    }

    if (itemValue.target.value.trim().length === 0) {
      cogoToast.error("Access ID not detected", { position: 'top-center', heading: 'Please scan your Access ID' });
      return;
    }
    const employeeData = {
      "QueryType": "1",
      "ActiveEmployee": true,
      "sessionManagement": {
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
      },
      "dtr": {
        "userID": "000000001",
        "accessID": this.state.AccessID,
        "wamasGeekID": '',
        "terminalID": this.state.TerminalCode,
        "dateFrom": "",
        "dateTo": "",
        "areaCode": this.state.areaSeq,
        "activityCode": this.state.selectedActivitySequence,
      },
      "employee": {}
    }
    console.log('employeeData: ', employeeData)
    const API = '/api/DC/TimeAttendance/InOut'

    axios.post(API, employeeData)
      .then((response) => {

        let responseValue = response;
        let responseStatus = response;
        console.log('responseStatus submitEmployeeRecord: ', responseStatus);
        const resultValue = responseValue.data.Value;
        const { FirstName, MiddleName, LastName, Activity, RegularOut, RegularIn, DateOut, DateIn } = resultValue.Table[0]
        const { area, areaSeq } = this.state

        if (responseStatus.status === 200) {

          console.log('resultValue.Table[0].RecordID: ', resultValue.Table[0].RecordID)
          if (resultValue.Table[0].RecordID > 0) {
            if (resultValue.Table[0].RegularOut == "") {
              window.location.href = `/TimeIn/${FirstName}/${MiddleName}/${LastName}/${area}/${Activity}/${RegularOut == "" ? " " : RegularOut}/${RegularIn}/${DateOut == "" ? " " : DateOut}/${DateIn}`
            }
            else {
              window.location.href = `/TimeOut/${FirstName}/${MiddleName}/${LastName}/${area}/${Activity}/${RegularOut == "" ? " " : RegularOut}/${RegularIn}/${DateOut == "" ? " " : DateOut}/${DateIn}`
            }

          }
          else if (resultValue.Table[0].Column1 === "Kindly update your access id.") {
            cogoToast.error('', { position: 'top-center', heading: resultValue.Table[0].Column1, hideAfter: 5 });
            this.setState({ UserID: '' })
          }
          else if (resultValue.Table[0].Column1.slice(0, 22) === 'You still have pending') {
            cogoToast.error('', { position: 'top-center', heading: resultValue.Table[0].Column1, hideAfter: 5 });
            this.setState({ UserID: '' })
          }
          else if (resultValue.Table[0].Column1 !== undefined) {
            cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: resultValue.slice(4), hideAfter: 5 });
          }

        }

      })
      .catch((error) => {
        console.log('Error AreaList: ', error);
      });
    //  window.location.href=`/TimeIn/Jane%20Bag-ao/${datenow}/${this.state.selectedActivity}/${this.state.selectedActivitySequence}/${this.props.match.params.Area}/${this.props.match.params.SeqNo}`                       

  }



  SaveTerminal = () => {
    if (this.state.PasswordTerminal == '0729') {
      //localStorage.removeItem('terminalCode')
      localStorage.setItem('terminalCode', this.state.NewTerminalCode);
      this.setState({ setTerminalModal: false, NewTerminalCode: '', TerminalCode: this.state.NewTerminalCode })
      this.getActivitiesData()
      cogoToast.success('Updated Sucessfully!', { hideAfter: 5 });


    } else {
      cogoToast.error("Please enter valid password", { position: 'top-center', heading: 'Invalid Password' });
    }
  }






  render() {
    return (
      <div className="IndexBody"
        style={
          { height: window.innerHeight }
        }>
        {/*  <img src={
                            require("../Assets/bg.png")
                        }
                        className="img-fluid"
                        alt="GABC logo"
                        style={
                            {position: 'absolute',
                            right: 0,
                            bottom: 0}
                        }/> */}
        <div className="text-center">
          <img src={
            require("../Assets/GABC.png")
          }
            className="img-fluid"
            alt="GABC logo"
            style={
              { width: '30%' }
            } />
        </div>
        <div className="text-center">
          <p className="fs-1 fw-bold">
            {this.state.area} Activity Monitoring</p>
        </div>
        <div className='d-grid gap-3 mx-auto'>
          <div class="row align-items-center justify-content-center card-active" style={{ marginInline: 20 }}>
            {this.state.ActivityArea.map((info, i) => (

              <div class={this.state.ActivityArea.length === 1 ? "col-md-4 col-lg-3 ButtonAreaSelection" : this.state.ActivityArea.length === 2 ? "col-md-4 col-lg-3 ButtonAreaSelection" : "col-md-4 col-lg-3 ButtonAreaSelection"}>
                <div class="cardScanning" onClick={
                  () => this.handleChangeselectedActivity(info)}>

                  <div class="card-body" style={{ backgroundColor: this.state.ActivityArea.length === 1 ? '#0d6efd' : this.state.selectedActivity === info.ActivityDescription ? '#0d6efd' : 'rgba(52, 52, 52,0)' }}>
                    <h5 class="card-title text-center" style={{ color: this.state.ActivityArea.length === 1 ? 'white' : this.state.selectedActivity === info.ActivityDescription ? 'white' : 'black' }}>{info.ActivityDescription}</h5>

                  </div>
                </div>  </div>
            ))
            }
          </div>
          {/*       <div className="row" style={{width:this.state.ActivityArea.length=== 1?'20%':'100%'}}>
                      <div className={this.state.ActivityArea.length ===1?"row row-cols-sm-1 row-cols-md-1 row-cols-lg-1":this.state.ActivityArea.length ===2?"row row-cols-sm-2 row-cols-md-2 row-cols-lg-2":"col-4"}>
                            {this.state.ActivityArea.map((info, i) => (

                                <div className="col ButtonAreaSelection"
                                    key={i}>
                                    <div className="g-col-6">

                                    <div class="cardScanning" onClick={
                                                () => this.handleChangeselectedActivity(info)}>

                                    <div class="card-body" style={{backgroundColor:this.state.ActivityArea.length === 1?'#0d6efd':this.state.selectedActivity === info.ActivityDescription ?'#0d6efd':'rgba(52, 52, 52,0)',color:this.state.ActivityArea.length === 1?'white':this.state.selectedActivity === info.ActivityDescription ?'white':'black' }}>
                                        <h5 class="card-title text-center">{info.ActivityDescription}</h5>
                                    
                                    </div>
                                    </div>

                                   {/*  <button type="button" className={this.state.ActivityArea.length=== 1?"btn-info btn-lg btn3d w-100 p-2": this.state.selectedActivity === info.Description ? "btn-info btn-lg btn3d w-100 p-2":"btn-primary  bg-opacity-10  btn3d w-100 p-2"} onClick={
                                                () => this.handleChangeselectedActivity(info.Description,info.SeqNo)
                                        }>
                                      {info.Description}</button> //
                                       
                                    </div>
                                </div>
                            ))
                        } </div>
                    </div> */}
          {/*<div className='InputField'>
                                <Select
                                  value={''}
                                  placeholder={"Select Area"}
                                  onChange={this.handleChangeselectedActivity}
                                  options={Area}
                                />
        </div>
                              <div className='InputField'>
                              <div className="input-group mb-3">
  <span className="input-group-text" id="basic-addon1">Activity</span>
  <input type="text" className="form-control" placeholder="Activity" aria-label="Activity" aria-describedby="basic-addon1" disabled />
</div></div>*/}
          <div className='InputField'>
            <div class="card">
              <div class="card-body">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">WAMAS/GEEK Account</span>
                  </div>
                  <input type="text" className="form-control" name="WAMASGEEKAccount" value={this.state.WAMASGEEKAccount} placeholder="Scan WAMAS/GEEK Account" aria-describedby="basic-addon1" autoFocus onChange={(itemValue) => {
                    console.log('geek changed: ', itemValue.target.value);
                    this.setState({ WAMASGEEKAccount: itemValue.target.value })
                    const nextSibling = document.querySelector(
                      `input[name=UserID]`
                    );
                    nextSibling.focus();
                  }} />
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Access ID</span>
                  </div>
                  <input type="text" className="form-control" name="UserID" value={this.state.UserID} placeholder="Scan your Access ID" aria-describedby="basic-addon1" onChange={(itemValue) => this.submitEmployeeRecord(itemValue)} />
                </div>
              </div>
            </div>
            {/*   <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">WAMAS/GEEK Account</span>
                            <input type="text" className="form-control" name="WAMASGEEKAccount" value={this.state.WAMASGEEKAccount} placeholder="Scan WAMAS/GEEK Account" aria-describedby="basic-addon1" autoFocus  onChange={(itemValue) =>{
                                  console.log('geek changed: ',itemValue.target.value);
                                  this.setState({WAMASGEEKAccount:itemValue.target.value})
                                  const nextSibling = document.querySelector(
                                    `input[name=UserID]`
                                  );
                                  nextSibling.focus();                        
                                }} />
                        </div>
                    </div>
                    <div className='InputField'>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Access ID</span>
                            <input type="text" className="form-control" name="UserID" value={this.state.UserID} placeholder="Scan your Access ID" aria-describedby="basic-addon1" onChange={(itemValue)=>this.submitEmployeeRecord(itemValue)}/>
                        </div>
                    </div> */}
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


export default ActivityScanningPage;

