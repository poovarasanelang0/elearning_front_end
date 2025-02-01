import React from 'react';
import { clearStorage } from "../../src/utils/Storage";
import { toast } from "react-toastify";
function  Header () {
   const logout = () => {
      clearStorage();
      toast.success("You have logged out successfully.");
    };
  return (
  <>
  
      <div class="header">


         
         <div class="header-content">
            <nav class="navbar navbar-expand">
               <div class="collapse navbar-collapse justify-content-between">
                  <div class="header-left">
                     <div className="top-nav-search">
                        <form>
                           <input type="text" className="form-control" placeholder="Search here"/>
                           <button className="btn" type="submit"><img src="../assets/images/search.svg" alt="img"/></button>
                        </form>
                     </div>
                  </div>
                  <div class="header-right d-flex align-items-center">
                  <ul className="nav nav-tabs user-menu">
                        <li className="nav-item dropdown  flag-nav dropdown-heads">
                           <a className="nav-link" data-bs-toggle="dropdown" href="#" role="button">
                           <i className="fe fe-bell"></i> <span className="badge rounded-pill"></span>
                           </a>
                           <div className="dropdown-menu notifications">
                              <div className="topnav-dropdown-header">
                                 <span className="notification-title">Notifications</span>
                                 <a href="javascript:void(0)" className="clear-noti"> Clear All</a>
                              </div>
                              <div className="noti-content">
                                 <ul className="notification-list">
                                    <li className="notification-message">
                                       <a href="#">
                                          <div className="media d-flex">
                                             <span className="avatar avatar-sm-1">
                                             <img className="avatar-img rounded-circle" alt src="../assets/images/users/avatar-2.jpg"/>
                                             </span>
                                             <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Brian Johnson</span> Following <span className="noti-title">#DF65485</span></p>
                                                <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                                             </div>
                                          </div>
                                       </a>
                                    </li>
                                    <li className="notification-message">
                                       <a href="#">
                                          <div className="media d-flex">
                                             <span className="avatar avatar-sm-1">
                                             <img className="avatar-img rounded-circle" alt src="../assets/images/users/avatar-2.jpg"/>
                                             </span>
                                             <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Marie Canales</span> has accepted friend request <span className="noti-title">#GTR458789</span></p>
                                                <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                                             </div>
                                          </div>
                                       </a>
                                    </li>
                                    <li className="notification-message">
                                       <a href="#">
                                          <div className="media d-flex">
                                             <div className="avatar avatar-sm-1">
                                                <span className="avatar-title rounded-circle bg-primary-light"><i className="far fa-user"></i></span>
                                             </div>
                                             <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">New user registered</span></p>
                                                <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                                             </div>
                                          </div>
                                       </a>
                                    </li>
                                    <li className="notification-message">
                                       <a href="#">
                                          <div className="media d-flex">
                                             <span className="avatar avatar-sm-1">
                                             <img className="avatar-img rounded-circle" alt src="../assets/images/users/avatar-2.jpg"/>
                                             </span>
                                             <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Barbara Moore</span> follow <span className="noti-title">#RDW026896</span></p>
                                                <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                                             </div>
                                          </div>
                                       </a>
                                    </li>
                                    <li className="notification-message">
                                       <a href="#">
                                          <div className="media d-flex">
                                             <div className="avatar avatar-sm-1">
                                                <span className="avatar-title rounded-circle bg-info-light"><i className="far fa-comment"></i></span>
                                             </div>
                                             <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">You have received a new message</span></p>
                                                <p className="noti-time"><span className="notification-time">2 days ago</span></p>
                                             </div>
                                          </div>
                                       </a>
                                    </li>
                                 </ul>
                              </div>
                              <div className="topnav-dropdown-footer">
                                 <a href="#">View all Notifications</a>
                              </div>
                           </div>
                        </li>
                        <li className="nav-item dropdown">
                           <a href="javascript:void(0)" className="user-link  nav-link" data-bs-toggle="dropdown">
                           <span className="user-img">
                           <img src="../assets/images/users/avatar-2.jpg" alt="img" className="profilesidebar"/>
                           <span className="animate-circle"></span>
                           </span>
                           <span className="user-content">
                           <span className="user-details">Admin</span>
                           <span className="user-name">Super Admin</span>
                           </span>
                           </a>
                           <div className="dropdown-menu menu-drop-user">
                              <div className="profilemenu">
                                 <div className="subscription-menu">
                                    <ul>
                                       <li>
                                          <a className="dropdown-item" href="#">Profile</a>
                                       </li>
                                       <li>
                                          <a className="dropdown-item" href="#">Settings</a>
                                       </li>
                                    </ul>
                                 </div>
                                 <div className="subscription-logout">
                                    <ul>
                                       <li className="pb-0" >
                                          <a className="dropdown-item" href="/" onClick={logout}>Log Out</a>
                                       </li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </li>
                     </ul>
               
                  </div>
               </div>
				</nav>
			</div>
		</div>
   
  </>
);
}

export default Header;