import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import cogoToast from 'cogo-toast';
import Select from "react-select";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import moment from 'moment';


const AdminId = localStorage.getItem('AdminUsername')



class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAgency: {
                label: 'GABC',
                value: 'GABC'
            },
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
            isLoggedin: 'false',
            isForUpdate: false,
            username: '',
            password: '',
            LogoutAlert: false,
            isfirstName: false,
            islastName: false,
            isgender: false,
            isbirthday: false,
            isselectedGovtID: false,
            isgovtIdNo: false,
            isselectedAgency: false,
        };
    }


    componentDidMount() {
        //const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'No Data';
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
        this.getUserDetails()
        const postData = {
            "sessionManagement": {
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}
        }

        const API = '/api/DC/TimeAttendance/AgencyList'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                this.setState({
                    agencyList: responseValue.map((info) => ({ label: info.Description, value: info.SeqNo }))
                })
            }

        }).catch((error) => {
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

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {

                this.setState({ usersList: responseValue })

            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });

    }

    logoutCredential = () => {
        console.log('signout clicked')
        this.setState({ LogoutAlert: true })

    }
    LogoutAccount = () => {
        console.log('signout clicked')
        localStorage.setItem('isLoggedin', 'false')
        window.location.href = `/`
        //this.setState({LogoutAlert: false,isLoggedin:'false'})

    }
    loginCredentials = () => {
        if (this.state.username === '12345' && this.state.password === '12345') {
            cogoToast.success("  ", {
                position: 'top-center',
                heading: "Sucessfully Logged in"
            })
            localStorage.setItem('isLoggedin', 'true')
            this.setState({ isLoggedin: 'true' });
        } else {
            cogoToast.error("Sorry, You can't proceed", {
                position: 'top-center',
                heading: "Invalid Username or Password"
            });
        }



    }

    SaveEmployeeInfo = () => {
        const {
            selectedAgency,
            firstName,
            lastName,
            gender,
            birthday,
            selectedGovtID,
            govtIdNo,
            isDirect,
            searchText,
        } = this.state;
        this.setState({
            isfirstName: firstName.trim().length === 0 ? true : false,
            islastName: lastName.trim().length === 0 ? true : false,
            isgender: gender.trim().length === 0 ? true : false,
            isbirthday: birthday.trim().length === 0 ? true : false,
            isselectedGovtID: selectedGovtID.trim().length === 0 ? true : false,
            isgovtIdNo: govtIdNo.trim().length === 0 ? true : false,
            isselectedAgency: selectedAgency === "" ? true : false,
        })
        if (isDirect === false && selectedAgency === "") {

            cogoToast.error('Please select agency', { hideAfter: 5 })
            return;
        } else if (firstName.trim().length === 0) {

            cogoToast.error('Please enter first name', { hideAfter: 5 })
            return;
        } else if (lastName.trim().length === 0) {

            cogoToast.error('Please enter first name', { hideAfter: 5 })
            return;
        } else if (selectedAgency.value !== 'GABC' && selectedGovtID.trim().length === 0) {

            cogoToast.error('Please select govt ID', { hideAfter: 5 })
            return;
        } else if (selectedAgency.value !== 'GABC' && govtIdNo.trim().length === 0) {

            cogoToast.error('Please enter ' + selectedGovtID + ' no.', { hideAfter: 5 })
            return;
        } /* else if (accessCode.trim().length == 0) {
            cogoToast.error('Please enter Access ID', {hideAfter: 5})
            return;
        }  */
        else if (gender.trim().length === 0) {

            cogoToast.error('Please enter gender', { hideAfter: 5 })
            return;
        }
        else if (birthday.trim().length === 0) {

            cogoToast.error('Please enter birthday', { hideAfter: 5 })
            return;
        }
        console.log('searchText.trim().length: ', searchText.trim().length)
        if (searchText.trim().length === 0) {
            this.saveNewRecord()
            return;
        } else {
            this.updateExistingRecord()
            return;
        }

    }


    updateExistingRecord() {
        const {
            selectedAgency,
            firstName,
            lastName,
            middleIn,
            accessCode,
            gender,
            birthday,
            selectedGovtID,
            govtIdNo,
            selectedUserInfo
        } = this.state;
        const employeeData = {
            "QueryType": "Update",
            "RecordID": selectedUserInfo.RecordID,
            "sessionManagement": {
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR",
                "UserNo": "020866"
            },
            "dtr": { "accessID": accessCode },
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

        axios.post(API, employeeData).then((response) => {


            let responseStatus = response;
            let responseMessage = responseStatus;

            console.log('responseMessage: ', responseMessage)
            if (responseStatus.status === 200) {

                if (responseStatus.data.Value.Table[0].Column1 === 'Record has been updated successfully.') {
                    cogoToast.success(responseStatus.data.Value.Table[0].Column1, { hideAfter: 5 });
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
                        searchText: '',
                        isDirect: true,
                        isForUpdate: false,
                    })
                    this.getUserDetails()
                    return;
                } else {
                    cogoToast.error("Sorry, You can't proceed", {
                        position: 'top-center',
                        heading: responseStatus.data.Value.Table[0].Column1.slice(4)
                    });
                }

            }

        }).catch((error) => {
            console.log('Error UpdateRecord: ', error);
        });

    }

    saveNewRecord() {
        const {
            selectedAgency,
            firstName,
            lastName,
            middleIn,
            accessCode,
            gender,
            birthday,
            selectedGovtID,
            govtIdNo,
        } = this.state;
        const employeeData = {
            "QueryType": "Insert",
            "sessionManagement": {
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR",
                "UserNo": "020866"
            },
            "dtr": { "accessID": accessCode },
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

        axios.post(API, employeeData).then((response) => {

            let responseStatus = response;
            console.log('responseStatus: ', responseStatus)


            if (responseStatus.status === 200) {

                if (responseStatus.data.Value.Table[0].Column1 === 'Record has been saved successfully.') {
                    cogoToast.success(responseStatus.data.Value.Table[0].Column1, { hideAfter: 5 });
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
                        searchText: '',
                        isDirect: true,
                        isForUpdate: false,
                    })
                    this.getUserDetails()
                    return;
                } else {
                    cogoToast.error("Sorry, You can't proceed", {
                        position: 'top-center',
                        heading: responseStatus.data.Value.Table[0].Column1.slice(4)
                    });
                }

            }

        }).catch((error) => {
            console.log('Error saveNewRecord: ', error);
        });

    }


    ChangeValueInputsearchText = (ItemValue,) => {
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
        if (ItemValue.target.name === 'govtIdNo') {
            this.setState({ [ItemValue.target.name]: ItemValue.target.value.split('-').join('') })
        } else {
            this.setState({ [ItemValue.target.name]: ItemValue.target.value })
        }
    }

    GetEmployeeDetail(info) {
        this.setState({
            selectedUserInfo: info,
            selectedAgency: {
                label: info.AgencyDescription,
                value: info.AgencyCode
            },
            isDirect: info.AgencyCode === 'GABC' ? true : false,
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
            isForUpdate: true
        })
    }

    render() {
        const {
            selectedAgency,
            firstName,
            lastName,
            middleIn,
            accessCode,
            gender,
            birthday,
            agencyList,
            searchText,
            searchResult,
            isDirect,
            selectedGovtID,
            govtIdNo,
            hideSearchResult,
            isForUpdate,
            isfirstName,
            islastName,
            isgender,
            isselectedGovtID,
            isgovtIdNo,
            isselectedAgency,
        } = this.state;
       
        return (
            <div class="auth-wrapper font-face-arial">
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
                            width: '15%'
                        }
                    } />
                <div class="card" style={{ width: window.innerWidth / 2 }}>
                    <div class="col-12"
                        style={
                            {
                                backgroundColor: 'white',
                                paddingInline: 50,
                                paddingTop: 10,
                                height: window.innerHeight,
                                overflow: 'auto'
                            }
                        }>
                        <div className="text-center">
                            <p className="fs-3 fw-bold">Employee Details</p>
                        </div>
                        <div className="text-center mb-1">
                            <button type="button"
                                className={
                                    isDirect ? "btn btn-primary" : "btn btn-outline-primary"
                                }
                                style={
                                    { marginInline: 5 }
                                }
                                onClick={
                                    () => this.setState({
                                        isDirect: true,
                                        selectedAgency: {
                                            label: 'GABC',
                                            value: 'GABC'
                                        }
                                    })
                                }>Direct</button>
                            <button type="button"
                                className={
                                    !isDirect ? "btn btn-primary" : "btn btn-outline-primary"
                                }
                                style={
                                    { marginInline: 5 }
                                }
                                onClick={
                                    () => { isForUpdate === true && selectedAgency.value === 'GABC' ? cogoToast.error('Employee is under GABC') : this.setState({ isDirect: false, selectedAgency: {} }) }
                                }>Agency</button>
                        </div>
                        <form className="row g-2">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1"><FaSearch /></span>
                                <input type="text" className="form-control" id="inputEmail4" placeholder='Search Employee by Name or User ID' name="searchText"
                                    value={searchText}
                                    onChange={
                                        ItemValue => this.ChangeValueInputsearchText(ItemValue)
                                    } />
                            </div>
                            {searchText.trim().length === 0 ? null :
                                searchResult.length < 1 ? null : hideSearchResult === true ? null : <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">User ID</th>
                                        </tr>
                                    </thead>
                                    <tbody> {
                                        searchResult.map((info) => (
                                            <tr onClick={
                                                () => this.GetEmployeeDetail(info)
                                            }>
                                                <td>{info.FirstName} {info.MiddleName} {info.LastName}</td>
                                                <td>{
                                                    info.UserID
                                                }</td>
                                            </tr>
                                        ))
                                    } </tbody>
                                </table>
                            }
                            {
                                isDirect ? null : <div className="col-12">
                                    <label for="inputAddress" className="form-label">Agency*</label>
                                    <Select value={selectedAgency}
                                        className={
                                            isselectedAgency === true ? "is-invalid" : null
                                        }
                                        placeholder={"Select Agency"}
                                        onChange={
                                            this.handleChangeselectedAgency
                                        }
                                        options={agencyList}
                                        height="50"
                                        style={
                                            { width: "80%" }
                                        } /> {
                                        isselectedAgency === true ? <div id="validationServer04Feedback" class="invalid-feedback">
                                            Please select a agency.
                                        </div> : null
                                    } </div>
                            }
                            <div className="col-md-4">
                                <label for="inputEmail4" className="form-label">First Name*</label>
                                <input type="text" required
                                    className={
                                        isfirstName === true ? "form-control is-invalid" : "form-control"
                                    }
                                    id="validationServerUsername"
                                    name="firstName"
                                    value={firstName}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } /> {
                                    isfirstName === true ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                        Please Enter First Name.
                                    </div> : null
                                } </div>
                            <div className="col-md-4">
                                <label for="inputPassword4" className="form-label">Middle Name</label>
                                <input type="text" className="form-control" id="inputPassword4" name="middleIn"
                                    value={middleIn}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } />
                            </div>
                            <div className="col-md-4">
                                <label for="inputPassword4" className="form-label">Last Name*</label>
                                <input type="text" required
                                    className={
                                        islastName === true ? "form-control is-invalid" : "form-control"
                                    }
                                    id="validationServerUsername"
                                    name="lastName"
                                    value={lastName}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } /> {
                                    islastName ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                        Please Enter Last Name.
                                    </div> : null
                                } </div>

                            {/*   <div className="col-md-6">
                                <label for="inputAddress2" className="form-label">User ID</label>
                                <input type="text" required className={userID.trim().length == 0?"form-control is-invalid":"form-control"}  id="validationServerUsername" name="userID" onChange={ItemValue=>this.ChangeValueInput(ItemValue)}/>
                               {userID.trim().length == 0? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                Please Enter User ID.
                              </div>:null}
                             </div> */}
                            {/*   <div className="col-6">
                                <label for="inputCity" className="form-label">Duration</label>
                                <input type="text" className="form-control" id="inputCity" name="duration"
                                    value={duration}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    }
                                />
                            </div> */}
                            <div className="col-6">
                                <label for="inputState" className="form-label">Gender*</label>
                                <select id="inputState" required
                                    className={
                                        isgender === true ? "form-select is-invalid" : "form-select"
                                    }
                                    name="gender"
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    }>
                                    <option selected>Choose...</option>
                                    <option value="M"
                                        selected={
                                            gender === 'M' ? true : false
                                        }>Male</option>
                                    <option value="F"
                                        selected={
                                            gender === 'F' ? true : false
                                        }>Female</option>
                                </select>
                                {
                                    isgender === true ? <div class="invalid-feedback">Please Select Gender</div> : null
                                } </div>
                            <div className="col-6">
                                <label for="inputAddress2" className="form-label">Birthdate*</label>
                                <input type="date" className="form-control" id="inputAddress2" name="birthday"
                                    value={birthday}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } />
                            </div>
                            {
                                isDirect ? null : <div class="input-group mb-3"
                                    style={
                                        { zIndex: 0 }
                                    }>
                                    <button type="button" class="btn btn-outline-secondary">
                                        {
                                            selectedGovtID === "" ? 'Govt. ID' : selectedGovtID
                                        }</button>
                                    <button type="button"
                                        class={
                                            isselectedGovtID === true ? "btn btn-outline-danger dropdown-toggle dropdown-toggle-split" : "btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                                        }
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <span class="visually-hidden">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'BIR' })
                                        }>
                                            <a class="dropdown-item">BIR</a>
                                        </li>
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'Drivers License' })
                                        }>
                                            <a class="dropdown-item">Drivers License</a>
                                        </li>
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'PhilID' })
                                        }>
                                            <a class="dropdown-item">PhilID</a>
                                        </li>
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'PhilHealth' })
                                        }>
                                            <a class="dropdown-item">PhilHealth</a>
                                        </li>
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'Postal ID' })
                                        }>
                                            <a class="dropdown-item">Postal ID</a>
                                        </li>
                                        <li onClick={
                                            () => this.setState({ selectedGovtID: 'SSS' })
                                        }>
                                            <a class="dropdown-item">SSS</a>
                                        </li>
                                    </ul>
                                    <input type="text"
                                        class={
                                            isselectedGovtID === true ? "form-control  is-invalid" : "form-control"
                                        }
                                        aria-label="Govt Id No."
                                        placeholder={
                                            selectedGovtID === "" ? "Select Govt ID*" : govtIdNo === "" ? "0000-0000-0000" : govtIdNo.match(/.{1,4}/g).join('-')
                                        }
                                        value={
                                            govtIdNo === '' ? "" : govtIdNo.match(/.{1,4}/g).join('-')
                                        }
                                        name="govtIdNo"
                                        onChange={
                                            ItemValue => this.ChangeValueInput(ItemValue)
                                        } />
                                    {
                                        isselectedGovtID === true ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                            Please Select Govt ID.
                                        </div> :
                                            isgovtIdNo === true ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                                Please Enter {selectedGovtID === '' ? 'Govt Id' : selectedGovtID} No.
                                            </div> : null

                                    }
                                </div>
                            }
                            <div className="col-md-12">
                                <label for="inputAddress2" className="form-label">Access ID</label>
                                <input type="text" required
                                    className={"form-control"
                                        /* accessCode.trim().length == 0 ? "form-control is-invalid" : "form-control" */
                                    }
                                    id="validationServerUsername"
                                    name="accessCode"
                                    value={accessCode}
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } /> {/* {
                                accessCode.trim().length == 0 ? <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                    Please Enter Access ID.
                                </div> : null
                            } */} </div>
                            <Button variant="success" className='mb-5'
                                onClick={
                                    this.SaveEmployeeInfo
                                }
                                style={
                                    { marginTop: 30 }
                                }>
                                Save
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Registration;

