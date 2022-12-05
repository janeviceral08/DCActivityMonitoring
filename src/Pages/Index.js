import React, { Component } from 'react';
import cogoToast from 'cogo-toast';


class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            LogoutAlert: false,
        };
    }

    componentDidMount() {
        const isLoggedin = localStorage.getItem('isLoggedin') ? localStorage.getItem('isLoggedin') : 'false';
        this.setState({ isLoggedin: isLoggedin })


    }


    loginCredentials = () => {
        if (this.state.username === '12345' && this.state.password === '12345') {
            cogoToast.success("  ", {
                position: 'top-center',
                heading: "Sucessfully Logged in"
            })
            localStorage.setItem('isLoggedin', 'true')
            window.location.href = `/Registration`
        } else {
            cogoToast.error("Sorry, You can't proceed", {
                position: 'top-center',
                heading: "Invalid Username or Password"
            });
        }

    }
    ChangeValueInput = (ItemValue) => {
        console.log('name: ', ItemValue.target.name)
        console.log('value: ', ItemValue.target.value)
        if (ItemValue.target.name === 'govtIdNo') {
            this.setState({ [ItemValue.target.name]: ItemValue.target.value.split('-').join('') })
        } else {
            this.setState({ [ItemValue.target.name]: ItemValue.target.value })
        }
    }

    render() {
        const {
            username,
            password,
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
                <div class="auth-content">
                    {/*       <div class="auth-bg">
                <span class="r"></span>
                <span class="r s"></span>
                <span class="r s"></span>
                <span class="r"></span>
            </div> */}
                    <div className="text-center" >
                        <p className="fs-1 fw-bold" style={{ width: 450, marginLeft: -30 }}>DC Time & Attendance</p>
                    </div>
                    <div class="card">
                        <div class="card-body text-center">
                            <div class="mb-4">
                                <i class="feather icon-unlock auth-icon"></i>
                            </div>
                            <h3 class="mb-4">Login</h3>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Email" name="username" value={username} onChange={
                                    ItemValue => this.ChangeValueInput(ItemValue)
                                } />
                            </div>
                            <div class="input-group mb-4">
                                <input type="password" class="form-control" placeholder="password" name="password" value={password} onChange={
                                    ItemValue => this.ChangeValueInput(ItemValue)
                                } />
                            </div>

                            <button class="btn btn-primary shadow-2 mb-4" onClick={
                                this.loginCredentials
                            }>Login</button>
                            <p class="mb-2 text-muted">Forgot password? <a href="auth-reset-password.html">Reset</a></p>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default Index;

