import React, { Component } from 'react';
import { Modal, Button, } from "react-bootstrap";
import cogoToast from 'cogo-toast';
import Select from "react-select";
import { FaSearch } from "react-icons/fa";

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedAgency: '',
      modalVisible: false,
    };
  }
  componentDidMount() {
    const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'No Data';
    console.log('App useterminalCOde:', useterminalCOde)
    if (useterminalCOde === "No Data") {
      cogoToast.error("Please set Terminal", { position: 'top-center', heading: 'No Terminal' });
    } else {
      window.location.href = `/ScanningPage/3rd%20Level/A0011`
    }
  }
  SaveEmployeeInfo = () => {
    cogoToast.success('This is a success message!', { hideAfter: 5 });
  }



  handleChangeselectedAgency = (selectedAgency) => {
    console.log('selectedAgency', selectedAgency);
    this.setState({ selectedAgency })
  };



  render() {
    return (
      <div className="IndexBody" style={{ height: 640 }}>

        <img src={
          require("../Assets/bg.png")
        }
          className="img-fluid"
          alt="GABC logo"
          style={
            {
              position: 'absolute',
              right: 0,
              bottom: 0
            }
          } />
        <div className="text-center">
          <img src={require("../Assets/GABC.png")} className="img-fluid" alt="GABC logo" style={{ width: '30%' }} />

        </div>
        <div className="text-center">
          <p className="fs-1 fw-bold">Welcome To DC Time & Activity Monitoring</p>
        </div>
        <div className='d-grid gap-2 mx-auto'>

          <div className="text-center">
            <button className="btn-primary rounded-5  bg-opacity-10" type="button" onClick={() => { this.setState({ modalVisible: true }) }}>
              <img src={require("../Assets/userAdd.png")} className="img-fluid" alt="GABC logo" style={{ width: '30%' }} />
              <p>Register</p>
            </button>
          </div>
          <a onClick={() => { window.location.href = "/ButtonAreaSelections" }}>
            <div className="text-center">
              <button className="btn-primary rounded-5  bg-opacity-10" >

                <img src={require("../Assets/groupScan.png")} className="img-fluid" alt="GABC logo" style={{ width: '30%' }} />
                <p>Activity Monitoring</p>
              </button>
            </div>
          </a>

        </div>

        <Modal show={this.state.modalVisible}>
          <Modal.Header closeButton onClick={() => { this.setState({ modalVisible: false }) }}>
            <Modal.Title>Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="row g-3">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><FaSearch /></span>
                <input type="text" className="form-control" id="inputEmail4" placeholder='Search Employee by Name' />
              </div>

              <div className="col-12">
                <label for="inputAddress" className="form-label">Agency</label>
                <Select
                  value={this.state.selectedAgency}
                  placeholder={"Select Agency"}
                  onChange={this.handleChangeselectedAgency}
                  options={[
                    { label: "GABC", value: "GABC" },
                    { label: "Agency1", value: "Agency1" },
                    { label: "Agency2", value: "Agency2" },
                  ]}
                  style={{ width: "80%" }}
                />
              </div>
              <div className="col-md-4">
                <label for="inputEmail4" className="form-label">First Name</label>
                <input type="text" className="form-control" id="inputEmail4" />
              </div>
              <div className="col-md-4">
                <label for="inputPassword4" className="form-label">Middle Initial</label>
                <input type="text" className="form-control" id="inputPassword4" />
              </div>
              <div className="col-md-4">
                <label for="inputPassword4" className="form-label">Last Name</label>
                <input type="text" className="form-control" id="inputPassword4" />
              </div>

              <div className="col-md-6">
                <label for="inputAddress2" className="form-label">User ID</label>
                <input type="text" className="form-control" id="inputAddress2" placeholder="A000000" />
              </div>
              <div className="col-md-6">
                <label for="inputAddress2" className="form-label">Access Code</label>
                <input type="text" className="form-control" id="inputAddress2" placeholder="A000000" />
              </div>
              <div className="col-md-6">
                <label for="inputCity" className="form-label">Duration</label>
                <input type="text" className="form-control" id="inputCity" />
              </div>
              <div className="col-md-6">
                <label for="inputState" className="form-label">Gender</label>
                <select id="inputState" className="form-select">
                  <option selected>Choose...</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>


            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => { this.setState({ modalVisible: false }) }}>
              Close
            </Button>
            <Button variant="success" onClick={this.SaveEmployeeInfo}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


export default Index;
