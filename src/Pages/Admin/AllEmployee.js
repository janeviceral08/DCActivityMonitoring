import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import XLSX from 'xlsx';
import { SheetJSFT } from './types';
import { MdOutlineUploadFile } from "react-icons/md";
import cogoToast from 'cogo-toast';
import ReactPaginate from 'react-paginate';


const AdminId = localStorage.getItem('AdminUsername')

class AllEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmployeeInfoList: [],
            LogoutModal: false,
            showSideNav: false,
            file: {},
            data: [],
            cols: [],
            pageCount: 10,
            perPage: 10,
            offset: 0,
            currentPage: 0,
            orgEmployeeInfoList: [],
        };
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });

    };

    loadMoreData() {
        const data = this.state.orgEmployeeInfoList;

        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            EmployeeInfoList: slice
        })

    }


    handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
    };

    handleFile() {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            console.log('data: ', data)


            data.map(async (info, i) => {

                const employeeData = {
                    "QueryType": "Insert",
                    "sessionManagement": {
                        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR",
                        "UserNo": AdminId
                    },
                    "dtr":
                    {
                        "accessID": info.AccessCode
                    },
                    "employee": {
                        "FirstName": info.FirstName,
                        "MiddleName": info.MiddleName,
                        "LastName": info.LastName,
                        "Birthdate": moment(info.Birthdate).format('YYYY-MM-DD'),
                        "Gender": info.IdentificationIDType,
                        "IdentificationIDType": info.IdentificationIDType,
                        "IdentificationIDNo": info.IdentificationIDNo,
                        "Agency": info.Agency,
                        "IsActive": info.IsActive,
                        "AccessCode": info.AccessCode

                    }
                }
                console.log('employeeData: ', employeeData)
                const API = '/api/DC/EmployeeDetails'
                await axios.post(API, employeeData).then((response) => {
                    let responseStatus = response;
                    console.log('responseStatus: ', responseStatus)
                    cogoToast.success('Data Successfully Loaded')
                    this.getEmployeeList()
                }).catch((error) => {
                    cogoToast.error(error, {
                        position: 'top-center',
                        heading: "Sorry, You can't Insert"
                    });
                    console.log('Error Update Area: ', error);
                });
                console.log('Imported Data: ', info.FirstName)



            });

         

        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        };
    }

    componentDidMount() {
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
        this.getEmployeeList()
    }


    getEmployeeList() {
        const postData = {

            "QueryType": "Select",
            "sessionManagement": {
                "UserNo": AdminId,
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

        const API = '/api/DC/EmployeeDetails'

        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseValue = response.data.Value.Table;
            let responseStatus = response;

            if (responseStatus.status === 200) {
                let slice = responseValue.slice(this.state.offset, this.state.offset + this.state.perPage)
                this.setState({ EmployeeInfoList: slice, pageCount: Math.ceil(responseValue.length / this.state.perPage), orgEmployeeInfoList: responseValue })

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
        const { LogoutModal, showSideNav } = this.state

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
                                <li data-username="form elements advance componant validation masking wizard picker select" class="nav-item active">
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
                                        <div class="card-header">
                                            <h5>All Employee</h5>
                                            <div class="input-group-append" style={
                                                window.innerWidth < 411 ? {
                                                    marginTop: '1%'
                                                } : {
                                                    width: '50%',
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: 5
                                                }
                                            }>
                                                <input
                                                    class="btn btn-primary"
                                                    id="file" accept={SheetJSFT} onChange={this.handleChange} type="file" />
                                                <button class="btn btn-primary" type="button"
                                                    onClick={this.handleFile}><MdOutlineUploadFile size={20} style={{ marginRight: 5 }} />Import Employee</button>
                                            </div>
                                        </div>
                                        <div class="card-block table-border-style">
                                            <div class="table-responsive">
                                                <table class="table table-hover">
                                                    <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Employee ID</th>
                                                            <th>Agency</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody> {
                                                        this.state.EmployeeInfoList.map((info, i) => (
                                                            <tr key={i}>
                                                                <th scope="row">
                                                                    {this.state.currentPage === 0 ? i + 1
                                                                        : (this.state.currentPage * this.state.perPage) + (i + 1)
                                                                    }
                                                                </th>
                                                                <td>{
                                                                    info.FirstName + ' ' + info.MiddleName + ' ' + info.LastName
                                                                }</td>
                                                                <td>{
                                                                    info.EmployeeID
                                                                }</td>
                                                                <td>{
                                                                    info.AgencyDescription === null ? 'GABC' : info.AgencyDescription
                                                                }</td>
                                                            </tr>
                                                        ))
                                                    }
                                                        <tr>
                                                            <td colspan="2">
                                                                <div className="col-12">
                                                                    <p>Showing {this.state.currentPage === 0 ? '1' : this.state.currentPage * this.state.perPage + 1} to {this.state.currentPage + this.state.perPage > this.state.orgEmployeeInfoList.length ? this.state.orgEmployeeInfoList.length : (this.state.currentPage + 1) * this.state.perPage > this.state.orgEmployeeInfoList.length ? this.state.orgEmployeeInfoList.length : (this.state.currentPage + 1) * this.state.perPage} of {this.state.orgEmployeeInfoList.length} entries</p></div>

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


export default AllEmployee;
