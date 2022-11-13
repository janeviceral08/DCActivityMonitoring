import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import cogoToast from 'cogo-toast';


const Activities = [
    {
        "Area": "Inbound",
        "Activity": "Receiving - Admin"
    },
    {
        "Area": "Inbound",
        "Activity": "Receiving - Xdock"
    },
    {
        "Area": "Inbound",
        "Activity": "Receiving - Local Buffer"
    },
    {
        "Area": "Inbound",
        "Activity": "Receiving - Foreign"
    }, {
        "Area": "Inbound",
        "Activity": "Receiving - Nonmerch"
    }, {
        "Area": "Inbound",
        "Activity": "Dock Controller"
    }, {
        "Area": "Inbound",
        "Activity": "Tramming"
    }, {
        "Area": "Returns",
        "Activity": "Admin"
    }, {
        "Area": "Returns",
        "Activity": "Operator"
    }, {
        "Area": "Sortation",
        "Activity": "Admin"
    }, {
        "Area": "Sortation",
        "Activity": "AMR Sorting"
    }, {
        "Area": "Sortation",
        "Activity": "Fragile Sorting"
    }, {
        "Area": "Sortation",
        "Activity": "Chute Management"
    }, {
        "Area": "VNA Pick and Pack",
        "Activity": "Admin"
    }, {
        "Area": "VNA Pick and Pack",
        "Activity": "Picking"
    }, {
        "Area": "VNA Pick and Pack",
        "Activity": "Packing"
    }, {
        "Area": "VNA Pick and Pack",
        "Activity": "Manual Label"
    }, {
        "Area": "VNA Pick and Pack",
        "Activity": "Tagging"
    }, {
        "Area": "VNA MHE",
        "Activity": "Replen picking"
    }, {
        "Area": "VNA MHE",
        "Activity": "Putaway"
    }, {
        "Area": "VNA MHE",
        "Activity": "Housekeeping"
    }, {
        "Area": "VNA MHE",
        "Activity": "Tramming"
    }, {
        "Area": "SITE",
        "Activity": "Admin"
    }, {
        "Area": "SITE",
        "Activity": "Site Personnel"
    }, {
        "Area": "SITE",
        "Activity": "LU Management"
    }, {
        "Area": "AMR1",
        "Activity": "Picking"
    }, {
        "Area": "AMR2",
        "Activity": "Putaway"
    }, {
        "Area": "AMR3",
        "Activity": "Housekeeping"
    }, {
        "Area": "AMR2",
        "Activity": "Admin - picking"
    }, {
        "Area": "AMR3",
        "Activity": "Admin - putaway"
    }, {
        "Area": "AMR4",
        "Activity": "Picking"
    }, {
        "Area": "AMR5",
        "Activity": "Putaway"
    }, {
        "Area": "AMR6",
        "Activity": "Housekeeping"
    }, {
        "Area": "Packing",
        "Activity": "Admin"
    }, {
        "Area": "Packing",
        "Activity": "MUE Divide"
    }, {
        "Area": "Packing",
        "Activity": "MUE packing"
    }, {
        "Area": "Packing",
        "Activity": "SUE Packing"
    }, {
        "Area": "VAS",
        "Activity": "Tagging"
    }, {
        "Area": "VAS",
        "Activity": "Packing"
    }, {
        "Area": "3rd Level",
        "Activity": "Admin - NM"
    }, {
        "Area": "3rd Level",
        "Activity": "Admin - SP"
    }, {
        "Area": "3rd Level",
        "Activity": "Picking - TEC"
    }, {
        "Area": "3rd Level",
        "Activity": "Picking - NM"
    }, {
        "Area": "3rd Level",
        "Activity": "Packing - NM"
    }, {
        "Area": "3rd Level",
        "Activity": "Sorting"
    }, {
        "Area": "3rd Level",
        "Activity": "Special Process"
    }, {
        "Area": "3rd Level",
        "Activity": "Housekeeping"
    }, {
        "Area": "3rd Level",
        "Activity": "Putaway"
    }

];


class ScanningPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedActivity: "",
            ActivityArea:[],
            selectedActivitySequence:"",
            WAMASGEEKAccount:"",
            UserID:"000000001",
            AccessID:"AC0001",
            terminalID:'',
            areaCode:this.props.match.params.SeqNo,
        };
    }


   


    componentDidMount(){
        const postData = {
                            "sessionManagement":{ "ApiKey":"d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"},
                            "dtr":{},"employee":{}
                          }
                          const useterminalCOde = localStorage.getItem('terminalCode') ? localStorage.getItem('terminalCode') : 'No Data';
                          this.setState({terminalID:useterminalCOde})
                            const API='http://150.200.3.16:29173/api/DC/TimeAttendance/ActivityList'
                  
             axios.post(API,postData)
            .then((response)=> {
        
              let responseValue =response.data.Value.Table;
              let responseStatus = response;
        
              console.log('responseStatus: ',responseStatus);
              console.log('ActivityArea: ',responseValue);
        
              if(responseStatus.status === 200){
                this.setState({ActivityArea: responseValue.sort((a, b) => a.Description.localeCompare(b.Description))})
              }
        
            })
            .catch((error)=> {
              console.log('Error AreaList: ',error);    
            });  
        
          }

          handleChangeselectedActivity = (Act,SeqNo) => {
            console.log('this is:', Act+' & '+SeqNo);
            //localStorage.removeItem('terminalCode')
            this.setState({selectedActivity: Act,selectedActivitySequence:SeqNo})
            let WAMASGEEKAccount = this.state.WAMASGEEKAccount;
            let UserID = this.state.UserID;
             if(WAMASGEEKAccount.trim().length < 1){
                const nextSibling = document.querySelector(
                    `input[name=WAMASGEEKAccount]`
                  );
                  nextSibling.focus();   
            }
            else if(UserID.trim().length < 1){
                const nextSibling = document.querySelector(
                    `input[name=UserID]`
                  );
                  nextSibling.focus(); 
            } 
        };

          submitEmployeeRecord = (itemValue)=>{
            
                console.log('UserID: ',itemValue.target.value);
                const datenow=moment().unix();
                if(this.state.selectedActivity.trim().length ===0){
                    cogoToast.error("Please select activity", { position: 'top-center', heading: 'Select Activity' });
                    return;
                }

                if(itemValue.target.value.trim().length ===0 ){
                    cogoToast.error("Access ID not detected", { position: 'top-center', heading: 'Please scan your Access ID' });
                    return;
                }
                const employeeData={
                    "QueryType": "1",
                    "ActiveEmployee": true,
                    "sessionManagement": {
                        "ApiKey": "d2qrB3n4KGd1z9pAc1xkB5wiC5olGbqEyiAgoR"
                    },
                    "dtr": {
                        "userID": "000000001",
                        "accessID": this.state.AccessID,
                        "wamasGeekID": '',
                        "terminalID": this.state.terminalID,
                        "dateFrom": "",
                        "dateTo": "",
                        "areaCode": this.props.match.params.SeqNo,
                        "activityCode": this.state.selectedActivitySequence,
                    }
                }

                const API='http://150.200.3.16:29173/api/DC/TimeAttendance/InOut'
                  
                axios.post(API,employeeData)
               .then((response)=> {
           
                 let responseValue =response;
                 let responseStatus = response;
                 console.log('responseStatus submitEmployeeRecord: ',responseStatus);
                 const resultValue=responseValue.data.Value;
                 const {FirstName,MiddleName,LastName,Area,Activity,RegularOut,RegularIn,DateOut,DateIn}=resultValue.Table[0]
            
           
                 if(responseStatus.status === 200){
                   
                    console.log('resultValue.Table[0].Column1: ', resultValue.Table[0].Column1 )
                    if(resultValue.Table[0].RecordID >0){
                        window.location.href=`/TimeIn/${FirstName}/${MiddleName}/${LastName}/${Area}/${Activity}/${RegularOut ==""?" ":RegularOut}/${RegularIn}/${DateOut ==""?" ":DateOut}/${DateIn}`                       
                    }
                   else if(resultValue.Table[0].Column1 != undefined){
                        cogoToast.error("Sorry, You can't proceed", { position: 'top-center', heading: resultValue.slice(4) });
                    }
                   
                }
           
               })
               .catch((error)=> {
                 console.log('Error AreaList: ',error);
               });  
              //  window.location.href=`/TimeIn/Jane%20Bag-ao/${datenow}/${this.state.selectedActivity}/${this.state.selectedActivitySequence}/${this.props.match.params.Area}/${this.props.match.params.SeqNo}`                       
              
          }



    render() {
        console.log('Params: ', this.props.match.params.Area)
        console.log('this.state.ActivityArea: ', this.state.ActivityArea)
        return (
            <div className="IndexBody"
                style={
                    {height: 640}
            }>
                {/*  <img src={
                            require("../Assets/bg.png")
                        }
                        className="img-fluid"
                        alt="GABC logo"
                        style={
                            {position: 'absolute',
                            right: 0,
                            bottom: 0}
                        }/> */}
                <div className="text-center">
                    <img src={
                            require("../Assets/GABC.png")
                        }
                        className="img-fluid"
                        alt="GABC logo"
                        style={
                            {width: '30%'}
                        }/>

                </div>
                <div className="text-center">
                    <p className="fs-1 fw-bold">
                        { this.props.match.params.Area} Activity Monitoring</p>
                </div>

                <div className='d-grid gap-4 mx-auto'>
                  
                    <div className="container" style={{width:this.state.ActivityArea.length=== 1?'20%':'100%'}}>
                      <div className={this.state.ActivityArea.length ===1?"row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-1":this.state.ActivityArea.length ===2?"row row-cols-2 row-cols-sm-2 row-cols-md-2 row-cols-lg-2":"row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-3"}>
                            {this.state.ActivityArea.map((info, i) => (

                                <div className="col ButtonAreaSelection"
                                    key={i}>
                                    <div className="g-col-6">

                            

                                    <button type="button" className={this.state.ActivityArea.length=== 1?"btn-info btn-lg btn3d w-100 p-2": this.state.selectedActivity === info.Description ? "btn-info btn-lg btn3d w-100 p-2":"btn-primary  bg-opacity-10  btn3d w-100 p-2"} onClick={
                                                () => this.handleChangeselectedActivity(info.Description,info.SeqNo)
                                        }>
                                      {info.Description}</button>
                                       
                                    </div>
                                </div>
                            ))
                        } </div>
                    </div>
                    {/*<div className='InputField'>
                                <Select
                                  value={''}
                                  placeholder={"Select Area"}
                                  onChange={this.handleChangeselectedActivity}
                                  options={Area}
                                />
        </div>
                              <div className='InputField'>
                              <div className="input-group mb-3">
  <span className="input-group-text" id="basic-addon1">Activity</span>
  <input type="text" className="form-control" placeholder="Activity" aria-label="Activity" aria-describedby="basic-addon1" disabled />
</div></div>*/}
            <div className='InputField'>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">WAMAS/GEEK Account</span>
                            <input type="text" className="form-control" name="WAMASGEEKAccount" placeholder="Scan WAMAS/GEEK Account" aria-describedby="basic-addon1" autoFocus  onChange={(itemValue) =>{
                                  console.log('geek changed: ',itemValue.target.value);
                                  this.setState({WAMASGEEKAccount:itemValue.target.value})
                                  const nextSibling = document.querySelector(
                                    `input[name=UserID]`
                                  );
                                  nextSibling.focus();                        
                                }} />
                        </div>
                    </div>
                    <div className='InputField'>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Access ID</span>
                            <input type="text" className="form-control" name="UserID" placeholder="Scan your Access ID" aria-describedby="basic-addon1" onChange={(itemValue)=>this.submitEmployeeRecord(itemValue)}/>
                        </div>
                    </div>
                   

                </div>
            </div>
        );
    }
}


export default ScanningPage;

