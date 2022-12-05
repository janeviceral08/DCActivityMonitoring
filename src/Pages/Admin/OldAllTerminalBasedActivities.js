import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

const AdminId = localStorage.getItem('AdminUsername')


class AllTerminalBasedActivities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ActivityList: [],
            terminalID: '',
            LogoutModal: false,
            AddModal: false,
            selectedInfo: {},
            selectedStatus: '',
            modalFor: '',
            showSideNav: false,
        };
    }


    componentDidMount() {
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
    }


    ChangeValueInput = (ItemValue) => {
        console.log('name: ', ItemValue.target.name)
        console.log('value: ', ItemValue.target.value)

        this.setState({ [ItemValue.target.name]: ItemValue.target.value })

    }


    SearchAcivities() {


        const postData = {

            "QueryType": "2",
            "TerminalID": this.state.terminalID.toUpperCase(),
            "sessionManagement": {
                "UserNo": AdminId,
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}

        }

        const API = '/api/DC/TimeAttendance/AreaActivityList'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                this.setState({ ActivityList: responseValue })
            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });


    }

    logoutAdmin() {
        localStorage.removeItem('AdminUsername')
        window.location.href = "/AdminIndex"
    }
    render() {
        const { LogoutModal, AddModal, Select, selectedStatus, modalFor, showSideNav } = this.state

        return (
            <div className='font-face-arial'>


                <nav class="pcoded-navbar" style={window.innerWidth > 990 ? null : showSideNav == true ? null : { marginLeft: '-264px' }}>
                    <div class="navbar-wrapper">
                        <div class="navbar-brand header-logo">
                            <a id="mobile-collapse" class="b-brand">
                                <img src="assets/images/logo-thumb.png" />

                                <span class="b-title">DC AMS</span>
                            </a>
                            <a class="mobile-menu" id="mobile-collapse">
                                <span></span>
                            </a>
                        </div>
                        <div class="navbar-content scroll-div">
                            <ul class="nav pcoded-inner-navbar">
                                <li data-username="DCAMS" class="nav-item">
                                    <Link to="/Dashboard" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-home"></i>
                                        </span>
                                        <span class="pcoded-mtext">Dashboard</span>
                                    </Link>
                                </li>

                                <li class="nav-item pcoded-menu-caption">
                                    <label>Datas</label>
                                </li>
                                <li data-username="form elements advance componant validation masking wizard picker select" class="nav-item">
                                    <Link to="/AllEmployee" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-file-text"></i>
                                        </span>
                                        <span class="pcoded-mtext">All Employee</span>
                                    </Link>
                                </li>
                                <li data-username="Table bootstrap datatable footable" class="nav-item">
                                    <Link to="/AllEmployee" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-server"></i>
                                        </span>
                                        <span class="pcoded-mtext">GABC</span>
                                    </Link>
                                </li>
                                <li data-username="Table bootstrap datatable footable" class="nav-item">
                                    <Link to="/AllEmployee" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-server"></i>
                                        </span>
                                        <span class="pcoded-mtext">Other Agencies</span>
                                    </Link>
                                </li>
                                <li data-username="Table bootstrap datatable footable" class="nav-item">
                                    <Link to="/AllActivities" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-server"></i>
                                        </span>
                                        <span class="pcoded-mtext">List of Activities</span>
                                    </Link>
                                </li>
                                <li data-username="Table bootstrap datatable footable" class="nav-item active">
                                    <Link to="/AllTerminalBasedActivities" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-server"></i>
                                        </span>
                                        <span class="pcoded-mtext">List of Terminals</span>
                                    </Link>
                                </li>
                                <li class="nav-item pcoded-menu-caption">
                                    <label>Reports</label>
                                </li>
                                <li data-username="Charts Morris" class="nav-item">
                                    <a href="chart-morris.html" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-pie-chart"></i>
                                        </span>
                                        <span class="pcoded-mtext">Report 1</span>
                                    </a>
                                </li>
                                <li data-username="Maps Google" class="nav-item">
                                    <a href="map-google.html" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-map"></i>
                                        </span>
                                        <span class="pcoded-mtext">Report 2</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <header class="navbar pcoded-header navbar-expand-lg navbar-light">
                    <div class="m-header">
                        <a class="mobile-menu" id="mobile-collapse1" onClick={() => this.setState({ showSideNav: !this.state.showSideNav })}>
                            <span></span>
                        </a>
                        <a class="b-brand">
                            <img src="assets/images/logo-thumb.png" />
                            <span class="b-title">DC AMS</span>
                        </a>
                    </div>
                    <a class="mobile-menu" id="mobile-header" href="javascript:">
                        <i class="feather icon-more-horizontal"></i>
                    </a>
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav ml-auto">
                            <li>
                                <div class="dropdown drp-user">
                                    <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="icon feather icon-settings"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right profile-notification">
                                        <div class="pro-head">
                                            <img src="assets/images/user/avatar-1.jpg" class="img-radius" alt="User-Profile-Image" />
                                            <span>{AdminId}</span>
                                            <a onClick={() => this.setState({ LogoutModal: true })} class="dud-logout" title="Logout">
                                                <i class="feather icon-log-out"></i>
                                            </a>
                                        </div>
                                        <ul class="pro-body">
                                            <li>
                                                <a href="javascript:" class="dropdown-item">
                                                    <i class="feather icon-settings"></i>
                                                    Settings</a>
                                            </li>
                                            <li>
                                                <a href="javascript:" class="dropdown-item">
                                                    <i class="feather icon-user"></i>
                                                    Profile</a>
                                            </li>
                                            {/*  <li>
                                                <a href="message.html" class="dropdown-item">
                                                    <i class="feather icon-mail"></i>
                                                    My Messages</a>
                                            </li>
                                            <li>
                                                <a href="auth-signin.html" class="dropdown-item">
                                                    <i class="feather icon-lock"></i>
                                                    Lock Screen</a>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </header>


                <div class="pcoded-main-container">
                    <div class="pcoded-wrapper">
                        {/* <img src={
                                require("../../Assets/bg.png")
                            }
                            className="img-fluid"
                            alt="GABC small icon"
                            style={
                                {
                                    position: 'fixed',
                                    right: '0',
                                    bottom: '0',
                                    width: '15%',
                                    zIndex: 1
                                }
                            }/> */}
                        <div class="pcoded-content">
                            <div class="main-body">
                                <div class="col-xl-12">
                                    <div class="card">
                                        <div class="card-header"
                                            style={
                                                { flexDirection: 'row' }
                                            }>
                                            <h5>All Activities</h5>
                                            <div class="input-group"
                                                style={
                                                    window.innerWidth < 411 ? {
                                                        marginTop: '1%'
                                                    } : {
                                                        width: '50%',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: 10
                                                    }
                                                }>
                                                <input type="text" class="form-control" placeholder="Terminal" aria-label="Terminal" aria-describedby="basic-addon2"
                                                    value={
                                                        this.state.terminalID
                                                    }
                                                    name="terminalID"
                                                    onChange={
                                                        ItemValue => this.ChangeValueInput(ItemValue)
                                                    } />
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary" type="button"
                                                        onClick={
                                                            () => this.SearchAcivities()
                                                        }>Search</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-block table-border-style">
                                            <div class="table-responsive">
                                                <table class="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Activity</th>
                                                            <th>Area</th>
                                                            <th>Terminal</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody> {
                                                        this.state.ActivityList.map((info, i) => (
                                                            <tr key={i}>
                                                                <td>{
                                                                    info.ActivityDescription
                                                                }</td>
                                                                <td>{
                                                                    info.AreaDesciption
                                                                }</td>
                                                                <td>{
                                                                    info.TerminalID
                                                                }</td>
                                                                <td><BiEdit size={30} /></td>
                                                            </tr>
                                                        ))
                                                    } </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <Modal show={AddModal}>
                    <Modal.Header closeButton
                        onClick={
                            () => {
                                this.setState({ AddModal: false })
                            }
                        }>
                        <Modal.Title>{'Update Status'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> <div class="card">
                        <div class="card-body">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Status</span>
                                </div>
                                <Select value={selectedStatus}
                                    className={"form-control"}
                                    placeholder={"Select Status"}
                                    onChange={
                                        this.handleChangeselectedStatus
                                    }
                                    options={
                                        [
                                            {
                                                label: 'Active',
                                                value: 1
                                            }, {
                                                label: 'Inctive',
                                                value: 0
                                            }
                                        ]
                                    } />
                            </div>

                        </div>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger"
                            onClick={
                                () => {
                                    this.setState({ AddModal: false, modalFor: '' })
                                }
                            }>
                            Cancel
                        </Button>
                        <Button variant="success"
                            onClick={
                                () => {
                                    modalFor == 'Add to Terminal' ? this.submitNewArea() : this.submitUpdateActivity()
                                }
                            }>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={LogoutModal}>
                    <Modal.Header closeButton onClick={() => { this.setState({ LogoutModal: false }) }}>
                        <Modal.Title>Are you sure to Log-out?</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button variant="danger" onClick={() => { this.setState({ LogoutModal: false }) }}>
                            No
                        </Button>
                        <Button variant="success" onClick={this.logoutAdmin}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


export default AllTerminalBasedActivities;
