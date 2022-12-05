import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";
import cogoToast from 'cogo-toast';
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import moment from 'moment';

class RegisterEmployee extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAgency: { label: 'GABC', value: 'GABC' },
      modalVisible: false,
      firstName: '',
      lastName: '',
      middleIn: '',
      userID: '',
      accessCode: '',
      duration: '',
      gender: '',
      birthday: '',
      agencyList: [],
      usersList: [],
      searchResult: [],
      searchText: '',
      isDirect: true,
      selectedGovtID: '',
      govtIdNo: '',
      selectedUserInfo: null,
      hideSearchResult: false,

    };
  }



  componentDidMount() {
    const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'No Data';

    if (useterminalCOde === "No Data") {
      cogoToast.error("Please set Terminal", {
        position: 'top-center',
        heading: 'No Terminal'
      });
    } else {
      //  window.location.href = `/ScanningPage`
    }

    this.getUserDetails()
    const postData = {
      "sessionManagement": { "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR" },
      "dtr": {}, "employee": {}
    }

    const API = '/api/DC/TimeAttendance/AgencyList'

    axios.post(API, postData, { withCredentials: false })
      .then((response) => {

        let responseValue = response.data.Value.Table;
        let responseStatus = response;

        if (responseStatus.status === 200) {
          this.setState({ agencyList: responseValue.map((info) => ({ label: info.Description, value: info.SeqNo })) })
        }

      })
      .catch((error) => {
        console.log('Error AreaList: ', error);
      });

  }



  getUserDetails() {
    const postData = {
      "QueryType": "6",
      "sessionManagement": {
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
      },
      "dtr": {},
      "employee": {
        "FirstName": "",
        "MiddleName": "",
        "LastName": "",
        "Birthdate": "",
        "Gender": "",
        "IdentificationIDType": "",
        "IdentificationIDNo": "",
        "IsActive": "1"
      }
    }

    const API = '/api/DC/TimeAttendance/UserDetails'

    axios.post(API, postData, { withCredentials: false })
      .then((response) => {

        let responseValue = response.data.Value.Table;
        let responseStatus = response;

        if (responseStatus.status === 200) {

          this.setState({ usersList: responseValue })

        }

      })
      .catch((error) => {
        console.log('Error AreaList: ', error);
      });

  }





  SaveEmployeeInfo = () => {

    console.log('Pressed')
    const { selectedAgency, firstName, lastName, middleIn, userID, accessCode, duration, gender, birthday, agencyList, selectedGovtID, govtIdNo, isDirect, searchText } = this.state;
    if (isDirect == false && selectedAgency == "") {
      cogoToast.error('Please select agency', { hideAfter: 5 })
      return;
    }
    else if (firstName.trim().length == 0) {
      cogoToast.error('Please enter first name', { hideAfter: 5 })
      return;
    }
    else if (lastName.trim().length == 0) {
      cogoToast.error('Please enter first name', { hideAfter: 5 })
      return;
    }
    else if (selectedGovtID.trim().length == 0 && isDirect == false ) {
      cogoToast.error('Please select govt ID', { hideAfter: 5 })
      return;
    }
    else if (govtIdNo.trim().length == 0&& isDirect == false ) {
      cogoToast.error('Please enter ' + selectedGovtID + ' no.', { hideAfter: 5 })
      return;
    }
    else if (gender.trim().length == 0) {
      cogoToast.error('Please enter gender', { hideAfter: 5 })
      return;
    }

    if (searchText.trim().length == 0) {
      this.saveNewRecord();
    } else {
      this.updateExistingRecord();
    }

  }


  updateExistingRecord() {
    const { selectedAgency, firstName, lastName, middleIn, userID, accessCode, duration, gender, birthday, agencyList, selectedGovtID, govtIdNo, isDirect, searchText, selectedUserInfo } = this.state;
    const employeeData = {
      "QueryType": "8",
      "RecordID": selectedUserInfo.RecordID,
      "sessionManagement": {
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR",
        "UserNo": "020866"
      },
      "dtr": {},
      "employee": {
        "FirstName": firstName,
        "MiddleName": middleIn,
        "LastName": lastName,
        "Birthdate": moment(birthday).format('YYYY-MM-DD'),
        "Gender": gender,
        "IdentificationIDType": selectedGovtID,
        "IdentificationIDNo": govtIdNo,
        "Agency": selectedAgency.value,
        "IsActive": "1"
      }
    }
    console.log('employeeData: ', employeeData)
    const API = '/api/DC/EmployeeDetails'

    axios.post(API, employeeData)
      .then((response) => {

        let responseValue = response;
        let responseStatus = response;
        let responseMessage = responseStatus.data.Value.Table[0].Column1;

        const resultValue = responseValue.data.Value;


        if (responseStatus.status === 200) {

          if (responseMessage == 'Record has been updated successfully.') {
            cogoToast.success(responseMessage, { hideAfter: 5 });
            this.setState({
              selectedAgency: '',
              firstName: '',
              lastName: '',
              middleIn: '',
              userID: '',
              accessCode: '',
              duration: '',
              gender: '',
              birthday: '',
              searchResult: [],
              selectedGovtID: '',
              govtIdNo: '',
            })
            this.getUserDetails()
            return;
          }
          else {
            cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: responseMessage.slice(4) });
          }

        }

      })
      .catch((error) => {
        console.log('Error saveNewRecord: ', error);
      });

  }

  saveNewRecord() {
    const { selectedAgency, firstName, lastName, middleIn, userID, accessCode, duration, gender, birthday, agencyList, selectedGovtID, govtIdNo, isDirect, searchText } = this.state;
    const employeeData = {
      "QueryType": "Insert",
      "sessionManagement": {
        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR",
        "UserNo": "020866"
      },
      "dtr": {"accessID":accessCode},
      "employee": {
        "FirstName": firstName,
        "MiddleName": middleIn,
        "LastName": lastName,
        "Birthdate": moment(birthday).format('YYYY-MM-DD'),
        "Gender": gender,
        "IdentificationIDType": selectedGovtID,
        "IdentificationIDNo": govtIdNo,
        "Agency": selectedAgency.value,
        "IsActive": "1"
      }
    }
    console.log('employeeData: ', employeeData)
    const API = '/api/DC/EmployeeDetails'

    axios.post(API, employeeData)
      .then((response) => {

        let responseValue = response;
        let responseStatus = response;
        let responseMessage = responseStatus.data.Value.Table[0].Column1;

        const resultValue = responseValue.data.Value;


        if (responseStatus.status === 200) {

          if (responseMessage == 'Record has been saved successfully.') {
            cogoToast.success(responseMessage, { hideAfter: 5 });
            this.setState({
              selectedAgency: '',
              firstName: '',
              lastName: '',
              middleIn: '',
              userID: '',
              accessCode: '',
              duration: '',
              gender: '',
              birthday: '',
              searchResult: [],
              selectedGovtID: '',
              govtIdNo: '',
            })
            this.getUserDetails()
            return;
          }
          else {
            cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: responseMessage.slice(4) });
          }

        }

      })
      .catch((error) => {
        console.log('Error saveNewRecord: ', error);
      });

  }



  ChangeValueInputsearchText = (ItemValue,) => {
    console.log('name: ', ItemValue.target.name)
    console.log('value: ', ItemValue.target.value)
    console.log('this.state.usersList: ', this.state.usersList)
    this.setState({ searchText: ItemValue.target.value, hideSearchResult: false })
    const newData = this.state.usersList.filter(item => {
      const itemData = item.FirstName.toUpperCase() + item.MiddleName.toUpperCase() + item.LastName.toUpperCase() + item.UserID.toUpperCase();
      const textData = ItemValue.target.value.toUpperCase();

      return itemData.indexOf(textData) > -1
    });
    this.setState({ searchResult: newData })
    console.log('newData: ', newData)

  }


  handleChangeselectedAgency = (selectedAgency) => {
    this.setState({ selectedAgency })
  };
  ChangeValueInput = (ItemValue) => {
    console.log('name: ', ItemValue.target.name)
    console.log('value: ', ItemValue.target.value)
    if (ItemValue.target.name === 'govtIdNo') {
      this.setState({ [ItemValue.target.name]: ItemValue.target.value.split('-').join('') })
    }
    else {
      this.setState({ [ItemValue.target.name]: ItemValue.target.value })
    }
  }

  GetEmployeeDetail(info) {
    this.setState({
      selectedUserInfo: info,
      selectedAgency: { label: info.AgencyDescription, value: info.AgencyCode },
      isDirect: info.AgencyCode == 'GABC' ? true : false,
      firstName: info.FirstName,
      lastName: info.LastName,
      middleIn: info.MiddleName,
      accessCode: '',
      duration: '',
      gender: info.Gender,
      birthday: info.Birthdate,
      hideSearchResult: true,
      selectedGovtID: info.IDType,
      govtIdNo: info.IDNo,
    })
  }

  render() {
    const { selectedAgency, firstName, lastName, middleIn, userID, accessCode, duration, gender, birthday, agencyList, searchText, searchResult, usersList, isDirect, selectedGovtID, govtIdNo, hideSearchResult } = this.state;
    let SearchDateValue = birthday == "" ? "" : birthday.split('-');
    return (
      <div
        style={
          {
            backgroundColor: '#558b2f',
            height: window.innerHeight,
          }
        }>
        <div className="row font-face-arial">
          <div className="col-md-6" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', position: 'relative',
          }}>
            <div class="col">
              <div className="text-center">
                <img src={
                  require("../Assets/gabclogo.png")
                }
                  className="img-fluid"
                  alt="GABC logo"
                  style={
                    { width: '100%', }
                  } />
              </div>
              <div className="text-center" style={{ padding: 20 }}>
                <p className="fs-1 fw-bold">Welcome To DC Time & Activity Monitoring</p>
              </div>
            </div>
            {window.innerWidth > 767 ? <img src={
              require("../Assets/bg.png")
            }
              className="img-fluid"
              alt="GABC small icon"
              style={
                {
                  position: 'fixed',
                  right: '0',
                  bottom: '0', width: '30%',
                }
              } /> : null}
          </div>
          <div class="col-sm-12 col-md-6" style={{ backgroundColor: 'white', paddingInline: 50, paddingTop: 10, maxheight: window.innerHeight }}>
            <div className="text-center">
              <p className="fs-3 fw-bold">Employee Details</p>
            </div>
            <div className="text-center mb-1">
              <button type="button" className={isDirect ? "btn btn-primary" : "btn btn-outline-primary"} style={{ marginInline: 5 }} onClick={() => this.setState({ isDirect: true, selectedAgency: { label: 'GABC', value: 'GABC' } })}>Direct</button>
              <button type="button" className={!isDirect ? "btn btn-primary" : "btn btn-outline-primary"} style={{ marginInline: 5 }} onClick={() => this.setState({ isDirect: false })}>Agency</button>
            </div>
            <form className="row g-2">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1"><FaSearch /></span>
                <input type="text" className="form-control col-sm-12 col-md-6" id="inputEmail4" placeholder='Search Employee by Name or User ID' name="searchText" value={searchText} onChange={ItemValue => this.ChangeValueInputsearchText(ItemValue)} />
              </div>
              {searchResult.length < 1 ? null : hideSearchResult == true ? null : <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((info) => (
                    <tr onClick={() => this.GetEmployeeDetail(info)}>
                      <td>{info.FirstName} {info.MiddleName} {info.LastName}</td>
                      <td>{info.UserID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>}
              {isDirect ? null : <div className="col-12">
                <label for="inputAddress" className="form-label">Agency</label>
                <Select value={selectedAgency}
                  className={selectedAgency == "" ? "is-invalid" : null}
                  placeholder={"Select Agency"}
                  onChange={
                    this.handleChangeselectedAgency
                  }
                  options={agencyList}
                  height="50"
                  style={
                    { width: "80%" }
                  } />
                {selectedAgency == "" ? <div id="validationServer04Feedback" class="invalid-feedback">
                  Please select a agency.
                </div> : null}
              </div>}
              <div className="col-md-4">
                <label for="inputEmail4" className="form-label">First Name</label>
                <input type="text" required className={firstName.trim().length == 0 ? "form-control is-invalid" : "form-control"} id="validationServerUsername" name="firstName" value={firstName} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
                {firstName.trim().length == 0 ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Please Enter First Name.
                </div> : null}
              </div>
              <div className="col-md-4">
                <label for="inputPassword4" className="form-label">Middle Name</label>
                <input type="text" className="form-control" id="inputPassword4" name="middleIn" value={middleIn} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
              </div>
              <div className="col-md-4">
                <label for="inputPassword4" className="form-label">Last Name</label>
                <input type="text" required className={lastName.trim().length == 0 ? "form-control is-invalid" : "form-control"} id="validationServerUsername" name="lastName" value={lastName} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
                {lastName.trim().length == 0 ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Please Enter Last Name.
                </div> : null}
              </div>

              {/*   <div className="col-md-6">
                                <label for="inputAddress2" className="form-label">User ID</label>
                                <input type="text" required className={userID.trim().length == 0?"form-control is-invalid":"form-control"}  id="validationServerUsername" name="userID" onChange={ItemValue=>this.ChangeValueInput(ItemValue)}/>
                               {userID.trim().length == 0? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                Please Enter User ID.
                              </div>:null}
                             </div> */}
              <div className="col-md-12">
                <label for="inputAddress2" className="form-label">Access Code</label>
                <input type="text" className={"form-control"} id="validationServerUsername" name="accessCode" value={accessCode} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
               
              </div>
              {isDirect ? null : <div class="input-group mb-3" style={{ zIndex: 0 }}>
                <button type="button" class="btn btn-outline-secondary">{selectedGovtID == '' ? 'Govt. ID' : selectedGovtID}</button>
                <button type="button" class={selectedGovtID == '' ? "btn btn-outline-danger dropdown-toggle dropdown-toggle-split" : "btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"} data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu">
                  <li onClick={() => this.setState({ selectedGovtID: 'BIR' })}><a class="dropdown-item" >BIR</a></li>
                  <li onClick={() => this.setState({ selectedGovtID: 'Drivers License' })}><a class="dropdown-item" >Drivers License</a></li>
                  <li onClick={() => this.setState({ selectedGovtID: 'PhilID' })}><a class="dropdown-item" >PhilID</a></li>
                  <li onClick={() => this.setState({ selectedGovtID: 'PhilHealth' })}><a class="dropdown-item" >PhilHealth</a></li>
                  <li onClick={() => this.setState({ selectedGovtID: 'Postal ID' })}><a class="dropdown-item" >Postal ID</a></li>
                  <li onClick={() => this.setState({ selectedGovtID: 'SSS' })}><a class="dropdown-item" >SSS</a></li>
                </ul>
                <input type="text" class={govtIdNo == "" ? "form-control  is-invalid" : "form-control"} aria-label="Govt Id No." placeholder={selectedGovtID == "" ? "Select Govt ID" : govtIdNo == "" ? "0000-0000-0000" : govtIdNo.match(/.{1,4}/g).join('-')} value={govtIdNo == '' ? "" : govtIdNo.match(/.{1,4}/g).join('-')} name="govtIdNo" onChange={ItemValue => this.ChangeValueInput(ItemValue)} />

                {selectedGovtID.trim().length == 0 ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Please Select Govt ID.
                </div> : null}
                {govtIdNo.trim().length == 0 ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                  Please Enter {selectedGovtID == '' ? 'Govt Id' : selectedGovtID} No.
                </div> : null}
              </div>}
              <div className="col-6">
                <label for="inputCity" className="form-label">Duration</label>
                <input type="text" className="form-control" id="inputCity" name="duration" value={duration} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
              </div>
              <div className="col-6">
                <label for="inputState" className="form-label">Gender</label>
                <select id="inputState" required className={gender.trim().length == 0 ? "form-select is-invalid" : "form-select"} name="gender" onChange={ItemValue => this.ChangeValueInput(ItemValue)} >
                  <option selected>Choose...</option>
                  <option value="M" selected={gender == 'M' ? true : false}>Male</option>
                  <option value="F" selected={gender == 'F' ? true : false}>Female</option>
                </select>
                {gender.trim().length == 0 ? <div class="invalid-feedback">Please Select Gender</div> : null}
              </div>
              <div className="col-12">
                <label for="inputAddress2" className="form-label">Bithdate</label>
                <input type="date" className="form-control" id="inputAddress2" name="birthday" value={birthday} onChange={ItemValue => this.ChangeValueInput(ItemValue)} />
              </div>
              <Button variant="success" onClick={this.SaveEmployeeInfo} style={{ marginTop: 30 }} >
                Save
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


export default RegisterEmployee;

