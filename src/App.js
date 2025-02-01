
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/signup";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";



import CourseList from "./pages/Course/ListCourse";
import CourseEdit from "./pages/Course/EditCourse";
import CourseView from "./pages/Course/CourseView";
import CourseAdd from "./pages/Course/AddCourse";

import UserList from "./pages/Users/ListUser";
import UserEdit from "./pages/Users/EditUser";
import UsereView from "./pages/Users/ViewUser";
import UsereAdd from "./pages/Users/Adduser";

import QustionList from "./pages/Qustions/ListQustions";
import QustionEdit from "./pages/Qustions/EditQuestions";
// import QustionView from "./pages/Qustions/ViewQustions";
import QustionAdd from "./pages/Qustions/AddQustions";

import ThreatObservation from "../src/pages/Sop/ThreatObservation";







// user
import UserWeb from "./userPanel/user";
import CourseUser from "./userPanel/Component/CourseUser/CourseUser";
import Assement from "./userPanel/Component/Assement/Assement";
import ListQuestions from "./userPanel/Component/ListQuestions/ListQuestions";
import UserDashboard from "./userPanel/UserDashborad/UserDashborad";
import AfterActions from "./pages/Sop/AfterActions";
import Bombthreats from "./pages/Sop/Bombthreats";
import Fireemergency from "./pages/Sop/Fireemergency";
import GuardandPatrol from "./pages/Sop/GuardandPatrol";
import Suspicious from "./pages/Sop/Suspicious";
import IncidentResponse from "./pages/Sop/IncidentResponse";
import AfterActionsUser from "./userPanel/SopUser/AfterActionsUser";
import BombthreatsUser from "./userPanel/SopUser/BombthreatsUser";
import FireemergencyUser from "./userPanel/SopUser/FireemergencyUser";
import GuardandPatrolUser from "./userPanel/SopUser/GuardandPatrolUser";
import IncidentResponseUser from "./userPanel/SopUser/IncidentResponseUser";
import SuspiciousUser from "./userPanel/SopUser/SuspiciousUser";
import ThreatObservationUser from "./userPanel/SopUser/ThreatObservationUser";
import CourseDetailsUser from "./userPanel/Component/CourseDetailsUser/CourseDetailsUser";
import ResultSummary from "./pages/ResultSummary/ResultSummary";



const routes = (
  <Router>    
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/ForgotPassword' element={<ForgotPassword/>} />  
      <Route path='/ResetPassword' element={<ResetPassword/>} />  
      <Route path='/Dashboard' element={<Dashboard/>} />  
      <Route path='/CourseList' element={<CourseList/>} />  
      <Route path='/CourseEdit' element={<CourseEdit/>} />  
      <Route path='/CourseView' element={<CourseView/>} />  
      <Route path='/CourseAdd' element={<CourseAdd/>} /> 

      <Route path='/UserList' element={<UserList/>} />  
      <Route path='/UserEdit' element={<UserEdit/>} />  
      <Route path='/Userview' element={<UsereView/>} />  
      <Route path='/UserAdd' element={<UsereAdd/>} />

      <Route path='/QustionList' element={<QustionList/>} />  
      <Route path='/QustionEdit' element={<QustionEdit/>} />  
      {/* <Route path='/Qustionview' element={<QustionView/>} />   */}
      <Route path='/QustionAdd' element={<QustionAdd/>} />
      <Route path='/ThreatObservation' element={<ThreatObservation/>} />
      <Route path='/AfterActions' element={<AfterActions/>} />
      <Route path='/Bombthreats' element={<Bombthreats/>} />
      <Route path='/Fireemergency' element={<Fireemergency/>} />
      <Route path='/GuardandPatrol' element={<GuardandPatrol/>} />
      <Route path='/Suspicious' element={<Suspicious/>} />
      <Route path='/IncidentResponse' element={<IncidentResponse/>} />
      <Route path='/ResultSummary' element={<ResultSummary/>} />











   {/* userWeb */}
   <Route path='/userWeb' element={<UserWeb/>} />
   <Route path='/CourseUser' element={<CourseUser/>} />
   <Route path='/Assement' element={<Assement/>} />
   <Route path='/ListQuestions' element={<ListQuestions/>} />
   <Route path='/UserDashboard' element={<UserDashboard/>} />
   <Route path='/AfterActionsUser' element={<AfterActionsUser/>} />
   <Route path='/BombthreatsUser' element={<BombthreatsUser/>} />

   <Route path='/FireemergencyUser' element={<FireemergencyUser/>} />

   <Route path='/GuardandPatrolUser' element={<GuardandPatrolUser/>} />

   <Route path='/IncidentResponseUser' element={<IncidentResponseUser/>} />

   <Route path='/SuspiciousUser' element={<SuspiciousUser/>} />
   <Route path='/ThreatObservationUser' element={<ThreatObservationUser/>} />
   <Route path='/CourseDetailsUser' element={<CourseDetailsUser/>} />












      
    </Routes>
 </Router> )

function App() {
  return (
    <div className="main-wrapper">
        {routes}  
    </div>
  );
}

export default App;