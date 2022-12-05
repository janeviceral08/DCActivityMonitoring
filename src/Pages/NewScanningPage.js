import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import cogoToast from 'cogo-toast';
import { FcSettings } from "react-icons/fc";
import { Modal, Button, } from "react-bootstrap";



class ScanningPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedActivity: "",
      ActivityArea: [],
      selectedActivitySequence: "",
      WAMASGEEKAccount: "",
      UserID: "",
      AccessID: "AC0001",
      areaCode: this.props.match.params.SeqNo,
      area: '',
      areaSeq: '',
      setTerminalModal: '',
      NewTerminalCode: '',
      PasswordTerminal: '',
      TerminalCode: '',
      ActivityID: '',
      whatToScan: 'Activity ID',
      scanningValue:''
    };
  }





  componentDidMount() {
    this.getActivitiesData()
  }

  getActivitiesData() {
    const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'T1';
    this.setState({ TerminalCode: useterminalCOde })
    const postData = {

      "QueryType": "2",
      "TerminalID": useterminalCOde,
      "sessionManagement": {
        "UserNo": "020866",
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
      },
      "dtr": {},
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
    this.setState({ UserID: itemValue.target.value })
    console.log('UserID: ', itemValue.target.value);
    if (this.state.ActivityID.trim().length === 0) {
      cogoToast.error("Please scan activity", { position: 'top-center', heading: 'Scan Activity' });
      return;
    }

    if (itemValue.target.value.trim().length === 0) {
      cogoToast.error("Access ID not detected", { position: 'top-center', heading: 'Please scan your Access ID' });
      return;
    }
    if (itemValue.target.value.trim().length < 9) {
      return;
    }
     // this.setTimeInOut(itemValue.target.value)
   
    //  window.location.href=`/TimeIn/Jane%20Bag-ao/${datenow}/${this.state.selectedActivity}/${this.state.selectedActivitySequence}/${this.props.match.params.Area}/${this.props.match.params.SeqNo}`                       

  }


  submitActivityID = (itemValue) => {
    console.log('submitActivityID: ',this.state.ActivityID)
    if (itemValue.target.value.trim().length === 0) {
      cogoToast.error("Activity ID not detected", { position: 'top-center', heading: 'Please scan your Activity ID' });
      return;
    }

      const newData = this.state.ActivityArea.filter(item => {
        const itemData = item.ActivityCode;
        const textData = itemValue.target.value;
        return itemData.indexOf(textData) > -1
      });
      console.log('newData: ', newData)
      if(newData.length == 0){
        cogoToast.error("Incompatible Terminal", { position: 'top-center', heading: "Activity doesn't belong in this terminal" });
      return;
      }
      this.setState({
        AccessID: newData[0].ActivityCode,
        accessID: newData[0].ActivityCode,
        TerminalCode: newData[0].TerminalID,
        areaSeq: newData[0].AreaCode,
        selectedActivitySequence: newData[0].ActivityCode,
        whatToScan: 'WAMAS/GEEK Account'
      })
    
  


  }



  submitWAMASAccount = (itemValue) => {
    this.setState({ accessID: itemValue.target.value, })
    if (itemValue.target.value.trim().length === 0) {
      cogoToast.error("WAMAS/GEEK ID not detected", { position: 'top-center', heading: 'Please scan your WAMAS/GEEK ID' });
      return;
    }
    else {
      console.log('geek changed: ', itemValue.target.value);
      this.setState({ WAMASGEEKAccount: itemValue.target.value, whatToScan: 'Access ID' })
    }
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



setTimeInOut (){
  const employeeData = {
    "QueryType": "1",
    "ActiveEmployee": true,
    "sessionManagement": {
      "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
    },
    "dtr": {
      "userID": this.state.UserID,
      "accessID": '',
      "wamasGeekID": '',
      "terminalID": /* this.state.TerminalCode */ 'T0001',
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
      const { FirstName, MiddleName, LastName, Activity, Area, RegularOut, RegularIn, DateOut, DateIn } = resultValue.Table[0]
      const { area, areaSeq } = this.state

      if (responseStatus.status === 200) {

        console.log('ERR: ', resultValue.Table[0].Column1.slice(0,4) )
        if (resultValue.Table[0].RecordID > 0) {
          if (resultValue.Table[0].RegularOut == "") {
            window.location.href = `/TimeIn/${FirstName}/${MiddleName}/${LastName}/${Area}/${Activity}/${RegularOut == "" ? " " : RegularOut}/${RegularIn}/${DateOut == "" ? " " : DateOut}/${DateIn}`
          }
          else {
            window.location.href = `/TimeOut/${FirstName}/${MiddleName}/${LastName}/${Area}/${Activity}/${RegularOut == "" ? " " : RegularOut}/${RegularIn}/${DateOut == "" ? " " : DateOut}/${DateIn}`
          }
        }
         else if (resultValue.Table[0].Column1 === "Kindly update your access id.") {
          cogoToast.error('', { position: 'top-center', heading: resultValue.Table[0].Column1, hideAfter: 5 });
          this.setState({ UserID: '' })
        }
        
        else if (resultValue.Table[0].Column1.slice(0,4)  === "Err~") {
          cogoToast.error('', { position: 'top-center', heading: resultValue.Table[0].Column1.slice(4), hideAfter: 5 });
          this.setState({ UserID: '' })
        }
        else if (resultValue.Table[0].Column1.slice(0, 22) === 'You still have pending') {
          cogoToast.error('', { position: 'top-center', heading: resultValue.Table[0].Column1, hideAfter: 5 });
          this.setState({ UserID: '' })
        }
        else if (resultValue.Table[0].Column1 !== undefined) {
          cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: resultValue.slice(4), hideAfter: 5 });
        }
        else{
          cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: resultValue.Table[0].Column1, hideAfter: 5 });
        }
      }
    })
    .catch((error) => {
      console.log('Error AreaList: ', error);
    });
}

onScanning =(scannedValue)=>{
this.setState({scanningValue: scannedValue.target.value})
  console.log('onScanning: ', scannedValue.target.value)
  console.log('keyCode: ', scannedValue)
/*   if (scannedValue.target.value.trim().length > 1) {
    return;
  } */

  if(scannedValue.target.value.trim().length <9 && scannedValue.target.value.trim().length >6){
    if (scannedValue.target.value.slice(0, 3) === 'ACT' && this.state.UserID.trim().length <9) {
      this.setState({ActivityID:scannedValue.target.value.toUpperCase(),scanningValue:''})
      this.submitActivityID(scannedValue)
     
      return;
    }
    if (scannedValue.target.value.slice(0, 3) === 'ACT' && this.state.UserID.trim().length >8) {
      this.setTimeInOut(scannedValue)
      this.setState({scanningValue:''})
      return;
    }
    if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length <8 && this.state.UserID.trim().length <9) {
      this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
      this.setState({scanningValue:''})
      return;
    }
    if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length >7 && this.state.UserID.trim().length >8) {
      this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
      this.setTimeInOut(scannedValue)
      this.setState({scanningValue:''})
      return;
    }
    if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length <8 && this.state.UserID.trim().length >8) {
      this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
      this.setState({scanningValue:''})
      return;
    }
    if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length >7 && this.state.UserID.trim().length <9) {
      this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
      this.setState({scanningValue:''})
      return;
    }
  }
  if(scannedValue.target.value.trim().length < 10 && scannedValue.target.value.trim().length >6){
  if (parseFloat(scannedValue.target.value ) >= 0 && this.state.ActivityID.trim().length >7) {
    this.setState({UserID:scannedValue.target.value.toUpperCase()})
    this.setTimeInOut(scannedValue)
    this.setState({scanningValue:''})
    return;
  }
  if (parseFloat(scannedValue.target.value ) >= 0 && this.state.ActivityID.trim().length <8) {
    this.setState({UserID:scannedValue.target.value.toUpperCase()})
    this.submitEmployeeRecord(scannedValue)
    this.setState({scanningValue:''})
    return;
  }
  if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length <8 && this.state.UserID.trim().length <9) {
    this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
    this.setState({scanningValue:''})
    return;
  }
  if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length >7 && this.state.UserID.trim().length >8) {
    this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
    this.setTimeInOut(scannedValue)
    this.setState({scanningValue:''})
    return;
  }
  if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length <8 && this.state.UserID.trim().length >8) {
    this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
    this.setState({scanningValue:''})
    return;
  }
  if (scannedValue.target.value.slice(0, 3) !== 'ACT' && parseFloat(scannedValue.target.value ) == NaN && this.state.ActivityID.trim().length >7 && this.state.UserID.trim().length <9) {
    this.setState({WAMASGEEKAccount:scannedValue.target.value.toUpperCase()})
    this.setState({scanningValue:''})
    return;
  }
 }
}


  render() {

    return (
      <div className="IndexBody font-face-arial"
        style={
          { height: window.innerHeight }
        }>
        <img src={
          require("../Assets/bg.png")
        }
          className="img-fluid"
          alt="GABC small icon"
          style={
            {
              position: 'fixed',
              right: '0',
              bottom: '0',
              width: '15%',
              zIndex: 1,
            }
          } />
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
        <div className="text-center">
          <p className="fw-bold" style={{ fontSize: 70, color: '#dc3545' }}>
            Scan your {this.state.whatToScan}</p>
        </div>
        <div className='d-grid gap-3 mx-auto'>
          <div className='InputField'>
            <div class="card">
              <div class="card-body">
              <div class="input-group mb-3">
    
                  <input type="text" className="form-control" name="scanningValue" value={this.state.scanningValue} onKeyPress={()=>console.log('types')} placeholder="Scan Here" aria-describedby="basic-addon1" autoFocus onChange={(itemValue) => this.onScanning(itemValue)} />
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Activity ID</span>
                  </div>
    
                  <input type="text" className="form-control" name="ActivityID" value={this.state.ActivityID} placeholder="Scan Activity ID" aria-describedby="basic-addon1"  disabled />
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">WAMAS/GEEK Account</span>
                  </div>
                  <input type="text" className="form-control" name="WAMASGEEKAccount" onFocus={()=>this.setState({whatToScan: 'WAMAS/GEEK Account'})}  value={this.state.WAMASGEEKAccount} placeholder="Scan WAMAS/GEEK Account" aria-describedby="basic-addon1" disabled/>
                </div>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Access ID</span>
                  </div>
                  <input type="text" className="form-control" name="UserID" onFocus={()=>this.setState({whatToScan: 'Access ID'})}  value={this.state.UserID} placeholder="Scan your Access ID" aria-describedby="basic-addon1" disabled/>
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


export default ScanningPage;

