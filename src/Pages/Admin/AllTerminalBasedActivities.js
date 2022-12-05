import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const AdminId = localStorage.getItem('AdminUsername')

const AreaList = [
    {
        "SeqNo": "A0001",
        "Description": "Inbound",
        "personnel": 10
    },
    {
        "SeqNo": "A0002",
        "Description": "Returns",
        "personnel": 3
    },
    {
        "SeqNo": "A0003",
        "Description": "Sortation",
        "personnel": 15
    },
    {
        "SeqNo": "A0004",
        "Description": "VNA Pick and Pack",
        "personnel": 8
    }, {
        "SeqNo": "A0005",
        "Description": "VNA MHE",
        "personnel": 21
    }, {
        "SeqNo": "A0006",
        "Description": "SITE",
        "personnel": 31
    }, {
        "SeqNo": "A0007",
        "Description": "AMR1",
        "personnel": 21
    }, {
        "SeqNo": "A0008",
        "Description": "AMR2",
        "personnel": 32
    }, {
        "SeqNo": "A0009",
        "Description": "Packing",
        "personnel": 11
    }, {
        "SeqNo": "A0010",
        "Description": "VAS",
        "personnel": 21
    }, {
        "SeqNo": "A0011",
        "Description": "3rd Level",
        "personnel": 16
    }
]
const ListofTerminal = [
    {
        label: 'Terminal 1'
    },
    {
        label: 'Terminal 2'
    },
    {
        label: 'Terminal 3'
    },
    {
        label: 'Terminal 4'
    }, {
        label: 'Terminal 5'
    }, {
        label: 'Terminal 6'
    }, {
        label: 'Terminal 7'
    }, {
        label: 'Terminal 8'
    }, {
        label: 'Terminal 9'
    }, {
        label: 'Terminal 10'
    }
]


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
            selectedTerminal: '',
            AreaList: [],
            AllActivityList: [],
        };
    }


    componentDidMount() {
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
        this.getActivityList();
    }


    getActivityList() {
        const postData = {
            "QueryType": "Select",
            "IsActive": 1,
            "sessionManagement": {
                "UserNo": AdminId,
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}

        }

        const postDataAll = {
            "QueryType": "Select",
            "IsActive": null,
            "sessionManagement": {
                "UserNo": AdminId,
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}
        }
        const API = '/api/DC/TimeAttendance/ActivityList'
        const APIGetArea = '/api/DC/TimeAttendance/AreaList'



        axios.post(API, postDataAll, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                this.setState({ AllActivityList: responseValue })
            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });
        axios.post(APIGetArea, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                this.setState({
                    AreaList: responseValue.map((info) => ({ label: info.Description, value: info.SeqNo }))
                })
            }

        }).catch((error) => {
            console.log('Error Activity: ', error);
        });
    }


    ChangeValueInput = (ItemValue) => {
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
        const { LogoutModal, AddModal, Select, selectedStatus, modalFor, showSideNav, AllActivityList } = this.state

        return (
            <div className='font-face-arial'>
                <nav class="pcoded-navbar" style={window.innerWidth > 990 ? null : showSideNav === true ? null : { marginLeft: '-264px' }}>
                    <div class="navbar-wrapper">
                        <div class="navbar-brand header-logo">
                            <a class="b-brand">
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
                                        <span class="pcoded-mtext">List of Employees</span>
                                    </Link>
                                </li>
                                <li data-username="Table bootstrap datatable footable" class="nav-item">
                                    <Link to="/AllAreas" class="nav-link ">
                                        <span class="pcoded-micon">
                                            <i class="feather icon-server"></i>
                                        </span>
                                        <span class="pcoded-mtext">List of Areas</span>
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
                                <div class="row">
                                    <div class="col-md-3 col-sm-6">
                                        <ul class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            {ListofTerminal.map((info) => (
                                                <li onClick={() => this.setState({ selectedTerminal: info.label })}><a class={this.state.selectedTerminal === info.label ? "nav-link text-left active" : "nav-link text-left"} id="v-pills-home-tab" data-toggle="pill" role="tab" aria-selected="true">{info.label}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div class="col-md-9 col-sm-6" style={{ marginTop: 20 }}>
                                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                                            <li class="nav-item">
                                                <a class="nav-link active text-uppercase" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Area</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link text-uppercase" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Activities</a>
                                            </li>
                                        </ul>
                                        <div class="tab-content" id="myTabContent">
                                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                                <div class="mb-0">
                                                    <div class="table-responsive" >
                                                        <table class="table table-hover">
                                                            <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                <tr>
                                                                    <th class="text-center">Area Code</th>
                                                                    <th class="text-center">Area</th>
                                                                    <th class="text-center">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {AreaList.length > 0 ? AreaList.map((info) => (
                                                                    <tr class="unread">
                                                                        <td class="text-center"><h6 class="mb-1">{info.SeqNo}</h6></td>
                                                                        <td class="text-center">

                                                                            <p class="m-0">{info.Description}</p>
                                                                        </td>
                                                                        <td class="text-center">
                                                                            <h6 class="text-muted"><i class="fas fa-circle text-c-green f-10 m-r-15"></i>Active</h6>
                                                                        </td>
                                                                    </tr>
                                                                )) : null} </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                                <div class="mb-0">
                                                    <div class="table-responsive" >
                                                        <table class="table table-hover">
                                                            <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                <tr>
                                                                    <th class="text-center">#</th>
                                                                    <th class="text-center">Activity I.D</th>
                                                                    <th class="text-center">Activity</th>
                                                                    <th class="text-center">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody> {
                                                                AllActivityList.map((info, i) => (
                                                                    <tr key={i}>
                                                                        <th class="text-center" scope="row">
                                                                            {
                                                                                i + 1
                                                                            }</th>
                                                                        <td class="text-center">{
                                                                            info.SeqNo
                                                                        }</td>
                                                                        <td class="text-center">{
                                                                            info.Description
                                                                        }</td>
                                                                        <td class="text-center"><div class="form-check form-switch">
                                                                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked />
                                                                        </div></td>
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
                                    modalFor === 'Add to Terminal' ? this.submitNewArea() : this.submitUpdateActivity()
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
