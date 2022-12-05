import React, { Component } from 'react';
import axios from 'axios';
import cogoToast from 'cogo-toast';


const AdminId = localStorage.getItem('AdminUsername')

class AdminIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: ''

        };
    }


    componentDidMount() {
        if (AdminId !== null) {
            window.location.href = "/Dashboard"
        }
    }


    ChangeValueInput = (ItemValue) => {
        this.setState({ [ItemValue.target.name]: ItemValue.target.value })
    }
    loginAdmin() {
        if (this.state.userName.trim().length === 0) {
            cogoToast.error("Please Enter User Name", {
                position: 'top-center',
                heading: "Sorry, You can't proceed"
            });
            return;
        }
        if (this.state.password.trim().length === 0) {
            cogoToast.error("Please Enter Password", {
                position: 'top-center',
                heading: "Sorry, You can't proceed"
            });
            return;
        }

        const postData = {
            "sessionManagement": {
                "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
            },
            "account": {
                "LoginUserName": this.state.userName,
                "LoginPassword": this.state.password
            },
            "dtr": {},
            "employee": {}
        }

        const API = '/api/DC/TimeAttendance/Login'


        axios.post(API, postData, { withCredentials: false }).then((response) => {

            let responseStatus = response;
            console.log('responseStatus: ', responseStatus)
            if (responseStatus.data.Message === 'Log-in Failed.') {
                cogoToast.error("Incorrect Password or User Name", {
                    position: 'top-center',
                    heading: "Sorry, You can't Login"
                });
            } else {
                localStorage.setItem('AdminUsername', this.state.userName)
                window.location.href = "/Dashboard"

            }

        }).catch((error) => {
            cogoToast.error(error, {
                position: 'top-center',
                heading: "Sorry, You can't Login"
            });
            console.log('Error Login: ', error);
        });

    }


    render() {

        return (
            <div class="auth-wrapper font-face-arial">
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
                            zIndex: 1
                        }
                    } />
                <div class="auth-content">
                    {/*       <div class="auth-bg">
                <span class="r"></span>
                <span class="r s"></span>
                <span class="r s"></span>
                <span class="r"></span>
            </div> */}
                    <div class="card">
                        <div class="card-body text-center">
                            <div class="mb-4">
                                <i class="feather icon-unlock auth-icon"></i>
                            </div>
                            <h3 class="mb-4">Login</h3>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="User Name" name="userName"
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } />
                            </div>
                            <div class="input-group mb-4">
                                <input type="password" class="form-control" placeholder="password" name="password"
                                    onChange={
                                        ItemValue => this.ChangeValueInput(ItemValue)
                                    } />
                            </div>

                            <button class="btn btn-primary shadow-2 mb-4"
                                onClick={
                                    () => this.loginAdmin()
                                }>Login</button>
                            <p class="mb-2 text-muted">Forgot password?
                                <a href="auth-reset-password.html">Reset</a>
                            </p>

                        </div>
                    </div>
                </div>
            </div>


        );
    }
}


export default AdminIndex;
