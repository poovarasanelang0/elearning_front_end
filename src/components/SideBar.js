import React, { useState } from "react";
import { clearStorage } from "../../src/utils/Storage";
import { toast } from "react-toastify";

function SideBar() {
  const [isSopOpen, setIsSopOpen] = useState(false); // State to toggle SOP dropdown

  const logout = () => {
    clearStorage();
    toast.success("You have logged out successfully.");
  };

  const toggleSopDropdown = () => {
    setIsSopOpen(!isSopOpen); // Toggle SOP dropdown
  };

  return (
    <>
      <div className="nav-header">
        <a href="/Dashboard" className="brand-logo">
          <div className="brand-title">
            <img
              src="../assets/images/Logo.png"
              className="img-fluid logo"
              alt="Logo"
            />
          </div>
        </a>
        <div className="nav-control">
          <div className="hamburger">
            <span className="bar-icons"></span>
            <span className="bar-icons"></span>
            <span className="bar-icons"></span>
            <span className="bar-icons"></span>
          </div>
        </div>
      </div>
      <div className="deznav">
        <div className="deznav-scroll">
          <ul className="metismenu" id="menu">
            <li>
              <a href="/CourseList" aria-expanded="false">
                <i className="fe fe-bar-chart"></i>{" "}
                <span className="nav-text">Course</span>
              </a>
            </li>
            <li>
              <a href="/UserList" aria-expanded="false">
                <i className="fe fe-grid"></i>{" "}
                <span className="nav-text">Users</span>
              </a>
            </li>
            <li>
              <a href="/QustionList" aria-expanded="false">
              <i class="bi bi-patch-question-fill"></i>
                              <span className="nav-text">Questions</span>
              </a>
            </li>

            <li>
              <a href="/ResultSummary" aria-expanded="false">
              <i class="bi bi-person-lines-fill"></i>
                              <span className="nav-text">Result Summary</span>
              </a>
            </li>
             {/* SOP Dropdown */}
            <li>
              <a href="#" onClick={toggleSopDropdown} aria-expanded={isSopOpen}>
                <i className="fe fe-file"></i>{" "}
                <span className="nav-text">SOP</span>
              </a>
              {isSopOpen && (
                <ul className="dropdown-toggle">
                  <li>
                    <a href="/Fireemergency">FIRE EMERGENCY</a>
                  </li>
                  <li>
                    <a href="/AfterActions">After-Action Review</a>
                  </li>
                  <li>
                    <a href="/Bombthreats">BOMB THREATS</a>
                  </li>
                  <li>
                    <a href="/Suspicious">SUSPICIOUS</a>
                  </li>
                  <li>
                    <a href="/GuardandPatrol">Guard and Patrol</a>
                  </li>
                  <li>
                    <a href="/IncidentResponse">Incident Response</a>
                  </li>
                  <li>
                    <a href="/ThreatObservation">Threat Observation</a>
                  </li>
                </ul>
              )}
            </li>
            
            <li className="menu-title" aria-expanded="false">
              <span className="nav-text">Settings</span>
            </li>
            <li>
              <a href="/" onClick={logout}>
                <i className="fe fe-power"></i> <span className="nav-text">Logout</span>
              </a>
            </li>
           
          </ul>
        </div>
      </div>
    </>
  );

  
}

export default SideBar;
