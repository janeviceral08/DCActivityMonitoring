import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { SiMicrosoftexcel } from "react-icons/si";
import { AiOutlineFileSearch } from "react-icons/ai";



const workSheetName = 'Worksheet-1';


ChartJS.register(ArcElement, Tooltip, Legend);

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


const AdminId = localStorage.getItem('AdminUsername')

const TotalPersonnel = AreaList.reduce((n, { personnel }) => n + personnel, 0)

const AreaLabel = AreaList.sort((a, b) => parseFloat(b.personnel) - parseFloat(a.personnel)).map((info) => { return info.Description })
console.log('AreaLabel: ', AreaLabel)

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalFor: '',
            LogoutModal: false,
            showSideNav: false,
            datefrom: '',

        };
    }

    componentDidMount() {
        if (AdminId === null) {
            window.location.href = "/AdminIndex"
        }
    }

    logoutAdmin() {
        localStorage.removeItem('AdminUsername')
        window.location.href = "/AdminIndex"
    }


    async ExportDataToExcel() {
        const workbook = new Excel.Workbook();
        try {
            const myInput = 'Gerated Report.xlsx';
            const fileName = 'Gerated Report';

            // creating one worksheet in workbook
            const worksheet = workbook.addWorksheet(workSheetName);

            // add worksheet columns
            // each columns contains header and its mapping key from data
            worksheet.columns = [
                { header: 'SeqNo', key: 'SeqNo' },
                { header: 'Description', key: 'Description' },
                { header: 'Personnel', key: 'personnel' },
            ];

            // updated the font for first row.
            worksheet.getRow(1).font = { bold: true };

            // loop through all of the columns and set the alignment with width.
            worksheet.columns.forEach(column => {
                column.width = column.header.length + 5;
                column.alignment = { horizontal: 'center' };
            });

            // loop through data and add each one to worksheet
            AreaList.forEach(singleData => {
                worksheet.addRow(singleData);
            });

            // loop through all of the rows and set the outline style.
            worksheet.eachRow({ includeEmpty: false }, row => {
                // store each cell to currentCell
                const currentCell = row._cells;

                // loop through currentCell to apply border only for the non-empty cell of excel
                currentCell.forEach(singleCell => {
                    // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
                    const cellAddress = singleCell._address;

                    // apply border
                    worksheet.getCell(cellAddress).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // write the content using writeBuffer
            const buf = await workbook.xlsx.writeBuffer();

            // download the processed file
            saveAs(new Blob([buf]), `${fileName}.xlsx`);
        } catch (error) {
            console.error('<<<ERRROR>>>', error);
            console.error('Something Went Wrong', error.message);
        } finally {
            // removing worksheet's instance to create new one
            workbook.removeWorksheet(workSheetName);
        }
    }

    render() {

        const { LogoutModal, showSideNav, datefrom } = this.state;
        return (
            <div className='font-face-arial'>
                <nav class="pcoded-navbar" style={window.innerWidth > 990 ? null : showSideNav === true ? null : { marginLeft: '-264px' }}>
                    <div class="navbar-wrapper">
                        <div class="navbar-brand header-logo">
                            <a class="b-brand">
                                <img src="assets/images/logo-thumb.png" />
                                <span class="b-title">DC AMS</span>
                            </a>
                            <a class="mobile-menu" id="mobile-collapse" >
                                <span></span>
                            </a>
                        </div>
                        <div class="navbar-content scroll-div">
                            <ul class="nav pcoded-inner-navbar">
                                <li data-username="DCAMS" class="nav-item active">
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
                        <a class="mobile-menu" id="mobile-collapse1" onClick={() => this.setState({ showSideNav: !this.state.showSideNav })} >
                            <span></span>
                        </a>
                        <a class="b-brand">
                            <img src="assets/images/logo-thumb.png" />
                            <span class="b-title">DC AMS</span>
                        </a>
                    </div>
                    <a class="mobile-menu" id="mobile-header" >
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
                            <div className='container'>
                                <div class="main-body">
                                    <div class="page-wrapper">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <ul class="nav nav-tabs" id="myTab" role="tablist">
                                                    <li class="nav-item">
                                                        <a class="nav-link active text-uppercase" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">General</a>
                                                    </li>
                                                    <li class="nav-item">
                                                        <a class="nav-link text-uppercase" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Detailed</a>
                                                    </li>
                                                </ul>
                                                <div class="tab-content" id="myTabContent">
                                                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                                        <div class="mb-0">
                                                            <div class="page-wrapper">
                                                                <div class="row">
                                                                    <div class="col-md-4 col-xl-4">
                                                                        <div class="card daily-sales">
                                                                            <div class="card-block">
                                                                                <h6 class="mb-4">Active Employee</h6>
                                                                                <div class="row d-flex align-items-center">
                                                                                    <div class="col-9">
                                                                                        <h3 class="f-w-300 d-flex align-items-center m-b-0">
                                                                                            <i class="feather icon-arrow-up text-c-green f-30 m-r-10"></i>200</h3>
                                                                                    </div>

                                                                                    <div class="col-3 text-right">
                                                                                        <p class="m-b-0">67%</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="progress m-t-30"
                                                                                    style={
                                                                                        { height: '7px' }
                                                                                    }>
                                                                                    <div class="progress-bar progress-c-theme" role="progressbar"
                                                                                        style={
                                                                                            { width: '50%' }
                                                                                        }
                                                                                        aria-valuenow="50"
                                                                                        aria-valuemin="0"
                                                                                        aria-valuemax="100"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-4 col-xl-4">
                                                                        <div class="card Monthly-sales">
                                                                            <div class="card-block">
                                                                                <h6 class="mb-4">GABC Employee</h6>
                                                                                <div class="row d-flex align-items-center">
                                                                                    <div class="col-9">
                                                                                        <h3 class="f-w-300 d-flex align-items-center m-b-0">
                                                                                            <i class="feather icon-arrow-up text-c-green f-30 m-r-10"></i>120</h3>
                                                                                    </div>
                                                                                    <div class="col-3 text-right">
                                                                                        <p class="m-b-0">60%</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="progress m-t-30"
                                                                                    style={
                                                                                        { height: '7px' }
                                                                                    }>
                                                                                    <div class="progress-bar progress-c-theme2" role="progressbar"
                                                                                        style={
                                                                                            { width: '63%' }
                                                                                        }
                                                                                        aria-valuenow="63"
                                                                                        aria-valuemin="0"
                                                                                        aria-valuemax="100"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-4 col-xl-4">
                                                                        <div class="card Monthly-sales">
                                                                            <div class="card-block">
                                                                                <h6 class="mb-4">Other Agencies Employee</h6>
                                                                                <div class="row d-flex align-items-center">
                                                                                    <div class="col-9">
                                                                                        <h3 class="f-w-300 d-flex align-items-center  m-b-0">
                                                                                            <i class="feather icon-arrow-down text-c-red f-30 m-r-10"></i>80</h3>
                                                                                    </div>
                                                                                    <div class="col-3 text-right">
                                                                                        <p class="m-b-0">40%</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="progress m-t-30"
                                                                                    style={
                                                                                        { height: '7px' }
                                                                                    }>
                                                                                    <div class="progress-bar progress-c-theme2" role="progressbar"
                                                                                        style={
                                                                                            { width: '40%' }
                                                                                        }
                                                                                        aria-valuenow="40"
                                                                                        aria-valuemin="0"
                                                                                        aria-valuemax="100"></div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xl-6 col-md-6">
                                                                        <div class="card user-list">
                                                                            <div class="card-header">
                                                                                <h5>Area</h5>
                                                                            </div>
                                                                            <div class="card-block">
                                                                                <div class="row align-items-center justify-content-center m-b-20">
                                                                                    <div class="col-3">
                                                                                        <h2 class="f-w-300 d-flex align-items-center float-left m-0">
                                                                                            {TotalPersonnel}</h2>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="row">
                                                                                    {
                                                                                        AreaList.sort((a, b) => parseFloat(b.personnel) - parseFloat(a.personnel)).map((info, i) => (
                                                                                            <div class="col-xl-6 col-md-6 col-sm-6">
                                                                                                <h6 class="align-items-center float-left">
                                                                                                    {
                                                                                                        info.Description
                                                                                                    }</h6>
                                                                                                <h6 class="align-items-center float-right">
                                                                                                    {
                                                                                                        info.personnel
                                                                                                    } </h6>
                                                                                                <div class="progress m-t-30 m-b-20"
                                                                                                    style={
                                                                                                        { height: '6px' }
                                                                                                    }>
                                                                                                    <div class="progress-bar progress-c-theme" role="progressbar"
                                                                                                        style={
                                                                                                            {
                                                                                                                width: (info.personnel / TotalPersonnel) * 100 + '%'
                                                                                                            }
                                                                                                        }
                                                                                                        aria-valuenow={
                                                                                                            (info.personnel / TotalPersonnel) * 100
                                                                                                        }
                                                                                                        aria-valuemin="0"
                                                                                                        aria-valuemax="100"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))
                                                                                    } </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-xl-6 col-md-6 col-sm-12">
                                                                        <div class="card">
                                                                            <div class="card-header">
                                                                                <h5>Today's Employee</h5>
                                                                            </div>
                                                                            <div class="card-block">
                                                                                <Doughnut data={{
                                                                                    labels: ['Male', 'Female'],
                                                                                    datasets: [
                                                                                        {
                                                                                            label: 'Personnel per Area',
                                                                                            data: ['122', '78'],
                                                                                            backgroundColor: [
                                                                                                'rgba(54, 162, 235, 0.2)',
                                                                                                'rgba(255, 99, 132, 0.2)',
                                                                                                'rgba(255, 206, 86, 0.2)',
                                                                                                'rgba(75, 192, 192, 0.2)',
                                                                                                'rgba(153, 102, 255, 0.2)',
                                                                                                'rgba(255, 159, 64, 0.2)',
                                                                                            ],
                                                                                            borderColor: [
                                                                                                'rgba(54, 162, 235, 1)',
                                                                                                'rgba(255, 99, 132, 1)',
                                                                                                'rgba(255, 206, 86, 1)',
                                                                                                'rgba(75, 192, 192, 1)',
                                                                                                'rgba(153, 102, 255, 1)',
                                                                                                'rgba(255, 159, 64, 1)',
                                                                                            ],
                                                                                            borderWidth: 1,
                                                                                        },
                                                                                    ],
                                                                                }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                                        <div class="mb-0">
                                                            <div class="col-xl-12 col-md-12">
                                                                <div class="input-group" style={{ marginBottom: 10 }}>
                                                                    <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Filter <span class="sr-only">Toggle Dropdown</span></button>
                                                                    <div class="dropdown-menu">
                                                                        <a class="dropdown-item"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />   Employee</a>
                                                                        <div role="separator" class="dropdown-divider"></div>
                                                                        <a class="dropdown-item"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />   Area</a>
                                                                    </div>
                                                                    <input type="date" className="form-control" id="inputAddress2" name="datefrom"
                                                                        value={datefrom}
                                                                        onChange={
                                                                            ItemValue => this.ChangeValueInput(ItemValue)
                                                                        } />
                                                                    <input type="date" className="form-control" id="inputAddress2" name="datefrom"
                                                                        value={datefrom}
                                                                        onChange={
                                                                            ItemValue => this.ChangeValueInput(ItemValue)
                                                                        } />
                                                                    <input type="time" className="form-control" id="inputAddress2" name="datefrom"
                                                                        value={datefrom}
                                                                        onChange={
                                                                            ItemValue => this.ChangeValueInput(ItemValue)
                                                                        } />
                                                                    <input type="time" className="form-control" id="inputAddress2" name="datefrom"
                                                                        value={datefrom}
                                                                        onChange={
                                                                            ItemValue => this.ChangeValueInput(ItemValue)
                                                                        } />
                                                                </div>
                                                                <div class="input-group">
                                                                    <input type="text" class="form-control" placeholder="Employee" aria-label="Employee" aria-describedby="basic-addon2" />
                                                                    <div class="input-group-append">
                                                                        <button class="btn btn-success" type="button"><AiOutlineFileSearch size={20} style={{ marginRight: 10 }} />Search</button>
                                                                        <button class="btn btn-info" type="button" onClick={() => this.ExportDataToExcel()}><SiMicrosoftexcel size={20} style={{ marginRight: 10 }} />Export to Excel</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="card-block px-0 py-3">
                                                                <div class="table-responsive">
                                                                    <table class="table table-hover">
                                                                        <thead style={{ backgroundColor: '#3f8755', color: 'white' }}>
                                                                            <tr>
                                                                                <th>Gender</th>
                                                                                <th>Name</th>
                                                                                <th>Time</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {AreaList.map((info) => (
                                                                                <tr class="unread">
                                                                                    <td><img class="rounded-circle" style={{ width: '40px' }} src="assets/images/user/avatar-1.jpg" alt="activity-user" /></td>
                                                                                    <td>
                                                                                        <h6 class="mb-1">{info.Description}</h6>
                                                                                        <p class="m-0">{info.SeqNo}</p>
                                                                                    </td>
                                                                                    <td>
                                                                                        <h6 class="text-muted"><i class="fas fa-circle text-c-green f-10 m-r-15"></i>{info.personnel}</h6>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
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


export default Dashboard;
