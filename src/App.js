import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Index from "./Pages/Index";
import ScanningPage from "./Pages/ScanningPage";
import ButtonAreaSelections from "./Pages/ButtonAreaSelections";
import TimeIn from "./Pages/TimeIn"
import TimeOut from "./Pages/TimeOut";
import RegisterEmployee from "./Pages/RegisterEmployee";
import AdminIndex from "./Pages/Admin/AdminIndex";
import Dashboard from "./Pages/Admin/Dashboard";
import AllEmployee from "./Pages/Admin/AllEmployee";
import Registration from "./Pages/Registration";
import AllActivities from "./Pages/Admin/AllActivities";
import AllAreas from "./Pages/Admin/AllAreas";
import AllTerminalBasedActivities from "./Pages/Admin/AllTerminalBasedActivities";
import AddAccessID from "./Pages/FrontDesk/AddAccessID";
import SearchEmployee from "./Pages/FrontDesk/SearchEmployee";
import { useEffect } from "react";
import cogoToast from 'cogo-toast';



function App() {

 

  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/RegisterEmployee" component={RegisterEmployee} />
      <Route path="/Registration" component={Registration} />
      <Route path="/ScanningPage" component={ScanningPage} />

      <Route path="/SearchEmployee" component={SearchEmployee} />
      <Route path="/AddAccessID" component={AddAccessID} />

      <Route path="/ButtonAreaSelections" component={ButtonAreaSelections} />
      <Route path="/TimeIn/:FirstName/:MiddleName/:LastName/:Area/:Activity/:RegularOut/:RegularIn/:DateOut/:DateInMonth/:DateInDay/:DateInYear" component={TimeIn} />
      <Route path="/TimeOut/:FirstName/:MiddleName/:LastName/:Area/:Activity/:RegularOut/:RegularIn/:DateOutMonth/:DateOutDay/:DateOutYear/:DateIn" component={TimeOut} />
   
      <Route path="/AdminIndex" component={AdminIndex} />
      <Route path="/Dashboard" component={Dashboard} />
      <Route path="/AllEmployee" component={AllEmployee} />
      <Route path="/AllActivities" component={AllActivities} />
      <Route path="/AllAreas" component={AllAreas} />
      <Route path="/AllTerminalBasedActivities" component={AllTerminalBasedActivities} />
      
    </Router>
  );
}

export default App;
