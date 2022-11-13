import React, {Component} from 'react';
import moment from 'moment';


class TimeIn extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      timeToRedirect:false,
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ timeToRedirect: true }), 4000);


  }

  componentWillUnmount() {
    // clear the timeer just in case
    clearTimeout(this.timeout);
}
    render() {
        if( this.state.timeToRedirect === true){
           window.location.href=`/ScanningPage`
        }
        const {FirstName,MiddleName,LastName,Area,Activity,RegularOut,RegularIn,DateOut,DateInMonth,DateInDay,DateInYear} =this.props.match.params;
        console.log('FirstName: ', FirstName);
        console.log('MiddleName: ', MiddleName);
        console.log('LastName: ', LastName);
        console.log('Area: ', Area);
        console.log('Activity: ', Activity);
        console.log('RegularOut: ', RegularOut);
        console.log('RegularIn: ', RegularIn);
        console.log('DateOut: ', DateOut);
        console.log('DateInMonth: ', DateInMonth);
        console.log('DateInDay: ', DateInDay);
        console.log('DateInYear: ', DateInYear);
        return (
            <div className="IndexBody" style={{height:window.innerHeight}}>
                
               {/*  <img src={
                            require("../Assets/bg.png")
                        }
                        className="img-fluid"
                        alt="GABC logo"
                        style={
                            {position: 'absolute',
                            right: 0,
                            bottom: 0,width:'20%'}
                        }/> */}
              <div className="text-center">
              <img src={require("../Assets/GABC.png")} className="img-fluid" alt="GABC logo" style={{width:'30%'}}/>
             
              </div>
              <div className="text-center">
                <p className="fs-1 fw-bold text-capitalize">Hi! {this.props.match.params.FirstName} {this.props.match.params.LastName}</p>
              </div>
              <div className='d-grid gap-2 mx-auto'>
           
              <div className="container">

              <div className="row row-cols-1" style={{justifyContent: 'center'}}>   
                           <div className="col ButtonAreaSelection">
                               <div className="g-col-6" >

                                   <button className="shadow bg-white rounded border-0 w-100" type="button">
                                       <p className='mx-auto'>
                                           <p className='fw-bold'>Area & Activity</p>{this.props.match.params.Area+' '+'('+this.props.match.params.Activity+')'}</p>
                                   </button>
                               </div>
                           </div>
                      </div>

                      <div className="row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2">
                           
                                <div className="col ButtonAreaSelection">
                                    <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center'}}>

                                        <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                            <p className='mx-auto ActivityAreaText fs-2' >
                                                <p className='fw-bold'>Date In:</p>{
                                                this.props.match.params.DateInMonth+'/'+this.props.match.params.DateInDay+'/'+this.props.match.params.DateInYear
                                            }</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="col ButtonAreaSelection">
                                    <div className="g-col-6" style={{ justifyContent: 'center', alignItems: 'center'}}>

                                        <button className="shadow bg-white rounded border-0 w-100 text-start" type="button">
                                            <p className='mx-auto ActivityAreaText fs-2 blinkTime' style={{color: '#dc3545'}}>
                                                <p className='fw-bold'>Time In:</p>{
                                               this.props.match.params.RegularIn.slice(0,-2)+' '+this.props.match.params.RegularIn.slice(5)
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


export default TimeIn;
