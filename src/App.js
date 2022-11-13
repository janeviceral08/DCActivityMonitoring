import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Index from "./Pages/Index";
import ScanningPage from "./Pages/ScanningPage";
import ButtonAreaSelections from "./Pages/ButtonAreaSelections";
import TimeIn from "./Pages/TimeIn"
import TimeOut from "./Pages/TimeOut";
import RegisterEmployee from "./Pages/RegisterEmployee"
import { useEffect } from "react";
import cogoToast from 'cogo-toast';



function App() {

  useEffect(()=>{
  
  })

  return (
    <Router>
      <Route path="/" exact component={Index} />
      <Route path="/RegisterEmployee" component={RegisterEmployee} />
      <Route path="/ScanningPage" component={ScanningPage} />
      <Route path="/ButtonAreaSelections" component={ButtonAreaSelections} />
      <Route path="/TimeIn/:FirstName/:MiddleName/:LastName/:Area/:Activity/:RegularOut/:RegularIn/:DateOut/:DateInMonth/:DateInDay/:DateInYear" component={TimeIn} />
      <Route path="/TimeOut/:FirstName/:MiddleName/:LastName/:Area/:Activity/:RegularOut/:RegularIn/:DateOut/:DateIn" component={TimeOut} />
    </Router>
  );
}

export default App;
