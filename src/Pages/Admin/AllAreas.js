import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import cogoToast from 'cogo-toast';
import QRCode from "react-qr-code";
import { AiOutlineQrcode } from "react-icons/ai";
import html2canvas from "html2canvas";
import ReactPaginate from 'react-paginate';



const AdminId = localStorage.getItem('AdminUsername')

class AllAreas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AreaList: [],
            InAreaList: [],
            AllAreaList: [],
            AreaInfo: {},
            Terminal: '',
            selectedArea: '',
            selectedAreaInfo: {},
            AreaName: '',
            modalFor: '',
            AddModal: false,
            selectedStatus: '',
            LogoutModal: false,
            showSideNav: false,
            pageCount: 10,
            perPage: 10,
            offset: 0,
            currentPageActive: 0,
            currentPageInactive: 0,
            offsetInactive: 0,
            offsetActive: 0,
            currentPage: 0,
            orgAreaList: [],
            orgInAreaList: [],
            orgAllAreaList: [],
        };
        this.handlePageClickActive = this.handlePageClickActive.bind(this);
        this.handlePageClickInactive = this.handlePageClickInactive.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    handlePageClickActive = (e) => {
        const selectedPage = e.selected;
        const offsetActive = selectedPage * this.state.perPage;

        this.setState({
            currentPageActive: selectedPage,
            offsetActive: offsetActive
        }, () => {
            this.loadMoreDataActive()
        });

    };
    handlePageClickInactive = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPageInactive: selectedPage,
            offsetInactive: offset
        }, () => {
            this.loadMoreDataInactive()
        });

    };
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreDataAll()
        });

    };
    loadMoreDataActive() {
        const data = this.state.orgAreaList;
        const slice = data.slice(this.state.offsetActive, this.state.offsetActive + this.state.perPage)
        this.setState({
            pageCountActive: Math.ceil(data.length / this.state.perPage),
            AreaList: slice
        })
    }

    loadMoreDataInactive() {
        const data = this.state.orgInAreaList;

        const slice = data.slice(this.state.offsetInactive, this.state.offsetInactive + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            InAreaList: slice
        })

    }
    loadMoreDataAll() {
        const data = this.state.orgAllList;

        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            AllAreaList: slice
        })

    }

    componentDidMount() {
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
        this.getAreaList();
    }


    getAreaList() {
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
        const postDataInactive = {
            "QueryType": "Select",
            "IsActive": 0,
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
        const API = '/api/DC/TimeAttendance/AreaList'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                let slice = responseValue.slice(this.state.offsetActive, this.state.offsetActive + this.state.perPage)
                this.setState({ AreaList: slice, pageCountActive: Math.ceil(responseValue.length / this.state.perPage), orgAreaList: responseValue })
            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });

        axios.post(API, postDataInactive, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                let slice = responseValue.slice(this.state.offsetInactive, this.state.offsetInactive + this.state.perPage)
                this.setState({ InAreaList: slice, pageCountInactive: Math.ceil(responseValue.length / this.state.perPage), orgInAreaList: responseValue })
            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });
        axios.post(API, postDataAll, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                let slice = responseValue.slice(this.state.offset, this.state.offset + this.state.perPage)
                this.setState({ AllAreaList: slice, pageCount: Math.ceil(responseValue.length / this.state.perPage), orgAllAreaList: responseValue })
            }

        }).catch((error) => {
            console.log('Error AreaList: ', error);
        });

    }

    ChangeValueInput = (ItemValue) => {
        this.setState({ [ItemValue.target.name]: ItemValue.target.value })
    }

    handleChangeselectedArea = (selectedArea) => {
        this.setState({ selectedArea })
    };
    handleChangeselectedStatus = (selectedStatus) => {
        this.setState({ selectedStatus })
    };




    AddArea() {
        if (this.state.AreaName.trim().length === 0) {
            cogoToast.error("Please Enter Area", {
                position: 'top-center',
                heading: "Sorry, You can't proceed"
            });
            return;
        }

        const postData = {
            "QueryType": "Insert",
            "AreaName": this.state.AreaName,
            "sessionManagement": {
                "UserNo": AdminId,
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}
        }

        const API = '/api/DC/TimeAttendance/AreaList'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseStatus = response;

            if (responseStatus.data.Value.Table[0].Column1 === 'New Area has been added successfully.') {
                this.getAreaList()
                cogoToast.success(this.state.AreaName + " Area is Added ", {
                    position: 'top-center',
                    heading: "Sucessfully Added"
                })

                this.setState({ AreaName: '' })
            } else {
                cogoToast.error(" ", {
                    position: 'top-center',
                    heading: "Sorry, You can't save"
                });
            }

        }).catch((error) => {
            cogoToast.error(error, {
                position: 'top-center',
                heading: "Sorry, You can't save"
            });
            console.log('Error AddArea: ', error);
        });
    }


    submitUpdateArea() {

        const recordId = parseInt(this.state.AreaInfo.SeqNo.slice(3))

        console.log('selectedStatus: ', recordId)

        const postData = {
            "QueryType": "Update",
            "RecordID": recordId,
            "IsActive": this.state.selectedStatus.value,
            "sessionManagement": {
                "UserNo": AdminId,
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "dtr": {},
            "employee": {}
        }

        const API = '/api/DC/TimeAttendance/AreaList'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseStatus = response;

            if (responseStatus.status === 200) {
                this.getAreaList()
                cogoToast.success(this.state.AreaInfo.Description + " is set to " + this.state.selectedStatus.label, {
                    position: 'top-center',
                    heading: "Sucessfully Updated"
                })

                this.setState({ AreaName: '', AddModal: false, modalFor: '', selectedStatus: '', })
            } else {
                cogoToast.error(" ", {
                    position: 'top-center',
                    heading: "Sorry, You can't update"
                });
                this.setState({ AreaName: '', AddModal: false, modalFor: '', selectedStatus: '', })
            }

        }).catch((error) => {
            cogoToast.error(error, {
                position: 'top-center',
                heading: "Sorry, You can't update"
            });
            this.setState({ AreaName: '', AddModal: false, modalFor: '', selectedStatus: '', })
            console.log('Error Update Area: ', error);
        });
    }

    logoutAdmin() {
        localStorage.removeItem('AdminUsername')
        window.location.href = "/AdminIndex"
    }


    async handleImageDownload() {
        console.log('Pressed Download')
        cogoToast.loading('Downloading...').then(async () => {
            const element = document.getElementById('print'),
                canvas = await html2canvas(element, { backgroundColor: null }),
                data = canvas.toDataURL('image/png'),
                link = document.createElement('a');

            link.href = data;
            link.download = this.state.AreaInfo.Description + '.png';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            cogoToast.success('QR Successfully Downloaded');
        });

    }

    render() {
        const {
            AreaList,
            AddModal,
            selectedArea,
            selectedAreaInfo,
            AreaName,
            modalFor,
            selectedStatus,
            InAreaList,
            AllAreaList,
            LogoutModal,
            showSideNav
        } = this.state
        console.log('selectedAreaInfo: ', selectedAreaInfo)

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
                                <li data-username="Table bootstrap datatable footable" class="nav-item active">
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
                                <li data-username="Table bootstrap datatable footable" class="nav-item">
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
                    <div class="pcoded-wrapper">
                        <div class="pcoded-content">
                            <div class="main-body">
                                <div class="page-wrapper">
                                    <div class="row">
                                        <div class="col-sm-12">
                                            <h5>Areas</h5>
                                            <div class="input-group"
                                                style={
                                                    window.innerWidth < 411 ? {
                                                        marginTop: '1%'
                                                    } : {
                                                        width: '50%',
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: -20
                                                    }
                                                }>
                                                <input type="text" class="form-control" placeholder="Area" aria-label="Area" aria-describedby="basic-addon2"
                                                    style={
                                                        { backgroundColor: 'white' }
                                                    }
                                                    value={AreaName}
                                                    name="AreaName"
                                                    onChange={
                                                        ItemValue => this.ChangeValueInput(ItemValue)
                                                    } />
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary" type="button"
                                                        onClick={
                                                            () => this.AddArea()
                                                        }>Add Area</button>
                                                </div>
                                            </div>
                                            <hr />
                                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                                <li class="nav-item">
                                                    <a class="nav-link active text-uppercase" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Active</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link text-uppercase" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Inactive</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link text-uppercase" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">All</a>
                                                </li>
                                            </ul>
                                            <div class="tab-content" id="myTabContent">
                                                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                                    <div class="mb-0">
                                                        <div class="card">
                                                            <div class="card-header"
                                                                style={
                                                                    { flexDirection: 'row' }
                                                                }>
                                                                <h5>Active Areas</h5>
                                                            </div>
                                                            <div class="card-block table-border-style">
                                                                <div class="table-responsive">
                                                                    <table class="table table-hover">
                                                                        <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Area I.D</th>
                                                                                <th>Area</th>
                                                                                <th>Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody> {
                                                                            AreaList.map((info, i) => (
                                                                                <tr key={i}>
                                                                                    <th scope="row">
                                                                                        {this.state.currentPageActive === 0 ? i + 1
                                                                                            : (this.state.currentPageActive * this.state.perPage) + (i + 1)
                                                                                        }</th>
                                                                                    <td>{
                                                                                        info.SeqNo
                                                                                    }</td>
                                                                                    <td>{
                                                                                        info.Description
                                                                                    }</td>
                                                                                    <td><AiOutlineQrcode size={30}
                                                                                        onClick={
                                                                                            () => this.setState({ AreaInfo: info, AddModal: true, modalFor: 'Generate QR' })
                                                                                        } />

                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                            <tr>
                                                                                <td colspan="2">
                                                                                    <div className="col-12">
                                                                                        <p>Showing {this.state.currentPageActive === 0 ? '1' : this.state.currentPageActive * this.state.perPage + 1} to {this.state.currentPageActive + this.state.perPage > this.state.orgAreaList.length ? this.state.orgAreaList.length : (this.state.currentPageActive + 1) * this.state.perPage > this.state.orgAreaList.length ? this.state.orgAreaList.length : (this.state.currentPageActive + 1) * this.state.perPage} of {this.state.orgAreaList.length} entries</p></div>

                                                                                </td>
                                                                                <td colspan="2">
                                                                                    <div style={{ 'float': 'right' }}>
                                                                                        <ReactPaginate
                                                                                            previousLabel={"prev"}
                                                                                            nextLabel={"next"}
                                                                                            breakLabel={"..."}
                                                                                            pageCount={this.state.pageCount}
                                                                                            marginPagesDisplayed={2}
                                                                                            pageRangeDisplayed={5}
                                                                                            onPageChange={this.handlePageClickActive}
                                                                                            subContainerClassName={"pages pagination"}

                                                                                            breakClassName={'page-item'}
                                                                                            breakLinkClassName={'page-link'}
                                                                                            containerClassName={'pagination'}
                                                                                            pageClassName={'page-item'}
                                                                                            pageLinkClassName={'page-link'}
                                                                                            previousClassName={'page-item'}
                                                                                            previousLinkClassName={'page-link'}
                                                                                            nextClassName={'page-item'}
                                                                                            nextLinkClassName={'page-link'}
                                                                                            activeClassName={'active'}

                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                                    <div class="mb-0">
                                                        <div class="card">
                                                            <div class="card-header"
                                                                style={
                                                                    { flexDirection: 'row' }
                                                                }>
                                                                <h5>Inactive Areas</h5>
                                                            </div>
                                                            <div class="card-block table-border-style">
                                                                <div class="table-responsive">
                                                                    <table class="table table-hover">
                                                                        <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Area I.D</th>
                                                                                <th>Area</th>
                                                                                <th>Actions</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody> {
                                                                            InAreaList.map((info, i) => (
                                                                                <tr key={i}>
                                                                                    <th scope="row">
                                                                                        {
                                                                                            i + 1
                                                                                        }</th>
                                                                                    <td>{
                                                                                        info.SeqNo
                                                                                    }</td>
                                                                                    <td>{
                                                                                        info.Description
                                                                                    }</td>
                                                                                    <td>
                                                                                        <AiOutlineQrcode size={30}
                                                                                            onClick={
                                                                                                () => this.setState({ AreaInfo: info, AddModal: true, modalFor: 'Generate QR' })
                                                                                            } />
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                            <tr>
                                                                                <td colspan="2">
                                                                                    <div className="col-12">
                                                                                        <p>Showing {this.state.currentPageInactive === 0 ? '1' : this.state.currentPageInactive * this.state.perPage + 1} to {this.state.currentPageInactive + this.state.perPage > this.state.orgInAreaList.length ? this.state.orgInAreaList.length : (this.state.currentPageInactive + 1) * this.state.perPage > this.state.orgInAreaList.length ? this.state.orgInAreaList.length : (this.state.currentPageInactive + 1) * this.state.perPage} of {this.state.orgInAreaList.length} entries</p></div>

                                                                                </td>
                                                                                <td colspan="2">
                                                                                    <div style={{ 'float': 'right' }}>
                                                                                        <ReactPaginate
                                                                                            previousLabel={"prev"}
                                                                                            nextLabel={"next"}
                                                                                            breakLabel={"..."}
                                                                                            pageCount={this.state.pageCountInactive}
                                                                                            marginPagesDisplayed={2}
                                                                                            pageRangeDisplayed={5}
                                                                                            onPageChange={this.handlePageClickInactive}
                                                                                            subContainerClassName={"pages pagination"}

                                                                                            breakClassName={'page-item'}
                                                                                            breakLinkClassName={'page-link'}
                                                                                            containerClassName={'pagination'}
                                                                                            pageClassName={'page-item'}
                                                                                            pageLinkClassName={'page-link'}
                                                                                            previousClassName={'page-item'}
                                                                                            previousLinkClassName={'page-link'}
                                                                                            nextClassName={'page-item'}
                                                                                            nextLinkClassName={'page-link'}
                                                                                            activeClassName={'active'}

                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                                    <div class="mb-0">
                                                        <div class="card">
                                                            <div class="card-header"
                                                                style={
                                                                    { flexDirection: 'row' }
                                                                }>
                                                                <h5>All Areas</h5>
                                                            </div>
                                                            <div class="card-block table-border-style">
                                                                <div class="table-responsive">
                                                                    <table class="table table-hover">
                                                                        <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                            <tr>
                                                                                <th>#</th>
                                                                                <th>Area I.D</th>
                                                                                <th>Area</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody> {
                                                                            AllAreaList.map((info, i) => (
                                                                                <tr key={i}>
                                                                                    <th scope="row">
                                                                                        {
                                                                                            i + 1
                                                                                        }</th>
                                                                                    <td>{
                                                                                        info.SeqNo
                                                                                    }</td>
                                                                                    <td>{
                                                                                        info.Description
                                                                                    }</td>

                                                                                </tr>

                                                                            ))
                                                                        }
                                                                            <tr>
                                                                                <td colspan="2">
                                                                                    <div className="col-12">
                                                                                        <p>Showing {this.state.currentPage === 0 ? '1' : this.state.currentPage * this.state.perPage + 1} to {this.state.currentPage + this.state.perPage > this.state.orgAllAreaList.length ? this.state.orgAllAreaList.length : (this.state.currentPage + 1) * this.state.perPage > this.state.orgAllAreaList.length ? this.state.orgAllAreaList.length : (this.state.currentPage + 1) * this.state.perPage} of {this.state.orgAllAreaList.length} entries</p></div>

                                                                                </td>
                                                                                <td colspan="2">
                                                                                    <div style={{ 'float': 'right' }}>
                                                                                        <ReactPaginate
                                                                                            previousLabel={"prev"}
                                                                                            nextLabel={"next"}
                                                                                            breakLabel={"..."}
                                                                                            pageCount={this.state.pageCountAll}
                                                                                            marginPagesDisplayed={2}
                                                                                            pageRangeDisplayed={5}
                                                                                            onPageChange={this.handlePageClick}
                                                                                            subContainerClassName={"pages pagination"}

                                                                                            breakClassName={'page-item'}
                                                                                            breakLinkClassName={'page-link'}
                                                                                            containerClassName={'pagination'}
                                                                                            pageClassName={'page-item'}
                                                                                            pageLinkClassName={'page-link'}
                                                                                            previousClassName={'page-item'}
                                                                                            previousLinkClassName={'page-link'}
                                                                                            nextClassName={'page-item'}
                                                                                            nextLinkClassName={'page-link'}
                                                                                            activeClassName={'active'}

                                                                                        />
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
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
                        </div>
                        <div class="main-body">
                            <div class="col-xl-12"></div>
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
                        <Modal.Title>{
                            modalFor === 'Add to Terminal' ? 'Add Area to Terminal' : modalFor === 'Generate QR' ? this.state.AreaInfo.Description + ' QR Code' : 'Update Status'
                        }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> {modalFor === 'Generate QR' ?
                        <div class="card">

                            <div class="card-body text-center" id="print">
                                <div style={{ border: '3px solid black', borderRadius: 20, padding: 10 }} >

                                    <QRCode
                                        onClick={() => this.handleImageDownload()}
                                        size={256}
                                        style={{ height: "auto", width: "50%", alignItems: 'center', }}
                                        value={this.state.AreaInfo.SeqNo}
                                        viewBox={`0 0 256 256`}
                                    />

                                    <p style={{ marginTop: 20, fontSize: 30, color: 'black', fontWeight: 'bold' }}>{this.state.AreaInfo.Description}</p>
                                </div>




                            </div>
                        </div>
                        :
                        modalFor === 'Add to Terminal' ? <div class="card">
                            <div class="card-body">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">Area&nbsp;&nbsp;</span>
                                    </div>
                                    <input type="text" className="form-control"
                                        value={
                                            this.state.AreaInfo.Description
                                        }
                                        disabled
                                        aria-describedby="basic-addon1" />
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">Area&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </div>
                                    <Select value={selectedArea}
                                        className={"form-control"}
                                        placeholder={"Select Area"}
                                        onChange={
                                            this.handleChangeselectedArea
                                        }
                                        options={AreaList} />
                                </div>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">Terminal</span>
                                    </div>
                                    <input type="text" className="form-control" name="Terminal"
                                        value={
                                            this.state.Terminal
                                        }
                                        placeholder="Enter Terminal"
                                        aria-describedby="basic-addon1"
                                        onChange={
                                            (itemValue) => this.ChangeValueInput(itemValue)
                                        } />
                                </div>
                            </div>
                        </div> : <div class="card">
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
                    } </Modal.Body>

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


export default AllAreas;
