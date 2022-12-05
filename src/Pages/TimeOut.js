import React, { Component } from 'react';


class TimeOut extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            timeToRedirect: false,
        };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => this.setState({ timeToRedirect: true }), 4000);
    }

    componentWillUnmount() {
        // clear the timer just in case
        clearTimeout(this.timeout);
    }
    render() {
        if (this.state.timeToRedirect === true) {
            window.location.href = `/ScanningPage`
        }
    
        return (
            <div className="IndexBody font-face-arial" style={{ height: window.innerHeight }}>
                <div className="text-center" >
                    <p className="fw-bold" style={{ color: '#888888', marginBottom: 40, marginTop: 40, fontSize: 50 }}>DC Time & Attendance</p>
                </div>
                <div className='d-grid gap-2 mx-auto'>
                    <div className="container">
                        <div className="row row-cols-1" style={{ justifyContent: 'center' }}>
                            <div className="col ButtonAreaSelection">
                                <div className="g-col-6" >

                                    <button className="shadow bg-white rounded border-0 w-100" type="button">

                                        <p className="fs-1 fw-bold text-capitalize" style={{ color: '#888888' }}>Hi! {this.props.match.params.FirstName} {this.props.match.params.LastName}</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2">
                            <div className="col ButtonAreaSelection">
                                <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center' }}>

                                    <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                        <p className='mx-auto ActivityAreaText fs-2' >
                                            <p className='fw-bold' style={{ color: '#888888' }}>Date Out:</p>{
                                                this.props.match.params.DateOutMonth + '/' + this.props.match.params.DateOutDay + '/' + this.props.match.params.DateOutYear
                                            }</p>
                                    </button>
                                </div>
                            </div>
                            <div className="col ButtonAreaSelection">
                                <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center' }}>

                                    <button className="shadow bg-white rounded border-0 w-100 text-start" onClick={() => { window.location.href = `/ScanningPage` }} type="button">
                                        <p className='mx-auto ActivityAreaText fs-2 blinkTime' style={{ color: '#dc3545' }}>
                                            <p className='fw-bold' style={{ color: '#888888' }}>Time Out:</p>{
                                                this.props.match.params.RegularOut
                                            }</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2">
                            <div className="col ButtonAreaSelection">
                                <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center' }}>

                                    <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                        <p className='mx-auto ActivityAreaText fs-2' >
                                            <p className='fw-bold' style={{ color: '#888888' }}>Area:</p>{
                                                this.props.match.params.Area
                                            }</p>
                                    </button>
                                </div>
                            </div>
                            <div className="col ButtonAreaSelection">
                                <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center' }}>

                                    <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                        <p className='mx-auto ActivityAreaText fs-2' >
                                            <p className='fw-bold' style={{ color: '#888888' }}>Activity:</p>{
                                                '(' + this.props.match.params.Activity + ')'
                                            }</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default TimeOut;
