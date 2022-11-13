import React, {Component} from 'react';
import moment from 'moment';


class TimeOut extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      timeToRedirect:false,
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ timeToRedirect: true }), 5000);


  }

  componentWillUnmount() {
    // clear the timeer just in case
    clearTimeout(this.timeout);
}
    render() {
        if( this.state.timeToRedirect === true){
            this.props.history.goBack();
        }
        console.log('timeToRedirect: ', this.state.timeToRedirect)
        return (
            <div className="IndexBody" style={{height:640}}>
                
                <img src={
                            require("../Assets/bg.png")
                        }
                        className="img-fluid"
                        alt="GABC logo"
                        style={
                            {position: 'absolute',
                            right: 0,
                            bottom: 0}
                        }/>
              <div className="text-center">
              <img src={require("../Assets/GABC.png")} className="img-fluid" alt="GABC logo" style={{width:'30%'}}/>
             
              </div>
              <div className="text-center">
                <p className="fs-1 fw-bold text-capitalize">Hi! {this.props.match.params.Employee}</p>
              </div>
              <div className='d-grid gap-2 mx-auto'>
           
              <div className="container">
                      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2">
                           
                                <div className="col ButtonAreaSelection">
                                    <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center'}}>

                                        <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                            <p className='mx-auto ActivityAreaText' style={{flexDirection: 'row'}}>
                                                <p className='fw-bold'>Date Out:</p>{
                                                moment(parseInt(this.props.match.params.FetchedTime)*1000).format('MMMM DD, YYYY')
                                            }</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="col ButtonAreaSelection">
                                    <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center'}}>

                                        <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                            <p className='mx-auto ActivityAreaText'>
                                                <p className='fw-bold'>Time Out:</p>{
                                                moment(parseInt(this.props.match.params.FetchedTime)*1000).format('hh:mm:ss a')
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
