import React, { Component } from 'react';


class SearchEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedActivity: "",
            ActivityArea: [],
            selectedActivitySequence: "",
            WAMASGEEKAccount: "",
            UserID: "000000003",
            AccessID: "AC0001",
            areaCode: this.props.match.params.SeqNo,
            area: '',
            areaSeq: '',
            setTerminalModal: '',
            NewTerminalCode: '',
            PasswordTerminal: '',
            TerminalCode: '',
            ActivityID: 'ACT0001',
            whatToScan: 'Activity ID',
        };
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


    render() {

        return (
            <div className="IndexBody font-face-arial"
                style={
                    { height: window.innerHeight }
                }>
                <img src={
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
                            zIndex: 1,
                        }
                    } />
                <div className="text-center">
                    <img src={
                        require("../../Assets/GABC.png")
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
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">Employee ID</span>
                                    </div>
                                    <input type="text" className="form-control" name="ActivityID" value={this.state.ActivityID} placeholder="Scan Activity ID" aria-describedby="basic-addon1" autoFocus onChange={(itemValue) => this.submitActivityID(itemValue)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default SearchEmployee;

