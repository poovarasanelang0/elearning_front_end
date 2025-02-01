import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { clearStorage, getuserId } from "../../../utils/Storage";
import { toast } from "react-toastify";
import { getSingleUser } from "../../../api/user";
const Header = () => {

  const [student, setStudent] = useState(null);
  useEffect(() => {
    getStudentDetails();
    // Check if privileges are properly fetched
  }, []);
  

  const getStudentDetails = () => {
    const id = getuserId();
    getSingleUser(id)
      .then((res) => {
        console.log("yuvrtyu", res);
        console.log("yuvi", res);
        setStudent(res?.data?.result); // Assuming the staff data is inside res.data.result
      })
      .catch((err) => {
        console.log(err);
      });
  };
   const logout = () => {
        clearStorage();
        toast.success("You have logged out successfully.");
      };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-lg fixed-top mb-5 ">
        <div className="container ">
          <a className="navbar-brand" href="/UserDashboard">
            <img
              src="../assets/images/Logo.png"
              alt="Logo"
              style={{ height: "40px" }}
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            {/* Centered Navigation Links */}
            <ul className="navbar-nav mx-auto">
              <li className="nav-item fw-bold">
                <a className="nav-link px-2 " style={{color:"#00008B"}} href="/UserDashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item px-2 fw-bold">
                <a className="nav-link"  style={{color:"#00008B"}} href="/CourseUser">
                  Course
                </a>
              </li>
              <li className="nav-item dropdown fw-bold px-2">
                <a 
                  className="nav-link dropdown-toggle" 
                  style={{color:"#00008B"}} 
                  href="#sop" 
                  id="sopDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  SOP
                </a>
                <ul 
                  className="dropdown-menu" 
                  aria-labelledby="sopDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="/AfterActionsUser">
                      After Actions 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/BombthreatsUser">
                      Bomb Threats 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/FireemergencyUser">
                      Fire Emergency 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/GuardandPatrolUser">
                      Guard and Patrol 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/IncidentResponseUser">
                      Incident Response 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/SuspiciousUser">
                      Suspicious 
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/ThreatObservationUser">
                      Threat Observation 
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Profile Dropdown */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAACUCAMAAAANv/M2AAAANlBMVEX///+ZmZmWlpbd3d2RkZH39/f7+/urq6vX19fKysrS0tKgoKDv7++ysrLo6OjCwsKLi4u4uLi7xffsAAAFy0lEQVR4nO1c2ZarIBCURVDc//9nr5pkbhaUomk0Ocd6H6whTW8UXRQXLly4cOHChQwwba9cXQ8r6tqpvjVnc9pFWw1d0wgh5B+EaJqmG6r2bG4+lK3r9KgXlp+QWo+yc215NstnlKq2Wnv5vjC3tfoW3n1tRYjxg7ewdX823xmqE36b2OAtRafmPzvxcJZVM0YwvkM31XlWYpzV0YzX7dbWnURbTZgle2nL1UiORjkJMuWVtpiO3mzjCLb8Tnt0hx7HvqMZ8xtr3R3o/1yTvM132o07ivMQ45hDtIcDCJuibzhM4w+6OcBEFJdpPCCb7M5PpTk6L2uRmXXFzfhGu8rJuWY15//QdT7OjtFtHMXa5aK8sM5kISoj51ynMYPfyM66j/HPcz24lOIbde7G37BHGVPgnOdKsKtdpVTlhg6sHm+smUkXA+rs5Gir8pEpm7KsLExbM+chsOOQ00dbpp1QK5GsOR9q0NJ+eq450a/AWpLVrE0Hch42ul/tBLKe+GoZh31yHLb7GfUILaHZDKTEPih3Q3GN/Viaq9rFfttQDTJgnbOJh7OCtkh2gT0qwYPBEhjRjwUPfs/zz0PAXDSSW2LZOEdFUFrMFpG1sJVs+lZX0PZgSTy21QypNRYLJXSn0mJrJSdOCvLRYCQzE8R6TA3mmOtAAxkWWqVN49wiHxGwc0UrtrStBoMvmp2B2eJ+QhAC6u8seLfZouuleD0sgrOTTovlaEcJ3Rnwl0uyD/QbgnunU+yjRatZdvPQdAEAWLHEeA9wwYQKBkxKBbufTokvcGMXbXqCbn9p+FA5t1htKODMHT7Yc/5BNWosK12hIaPuIxak5qdwKwztaEUsSL6qw8/hzBrITU3E5YfsaJwN6p/WjwClP9hmuqGh9ZraGNKA1wMTmQdp2knESv4HgklThOtYQcup43YmaCBYqfUftETPxX1E6F3WUQa9gBbI4fD1n/VmiCkjvN0dtOw0mvTspzYMsY0XtRBTaqzN+fqlzx918Vw1QblAjC4E0ot8412ZWSqSQORI0nN+1tT9Qwpr2r7Gb7fOI70qM2031DOGCVWhnk5a3PXTQqaIFo4nzQAi6XiXt16K+0BZ6Rg/PRNuZlt21Sucq4eukbHEiaTjwrjW1vVl6U0ojSlbZ3Wc56OF8QiR1ewvqmD+ayobIxmh1Vtwk0KKCW0hREiBaakpWgRoq8AqwxRGoTpxYhGAlVtSD1F9tznfgzabWG5Bha200T8j1FmnFrZIxa8p96vIHTC5hRBu1sg40/hjHQ625GZNsC2mqZoSE2RNbouFroX3i8J9hEpGcgMycBLTrvv2Gwqaeg4DTfVEldS+D0loqu9eX6RKHKpd0vTri72mUPoLhJ33EEkXiTtXcsQw+4R220CS5NTbnTEOlfbOlqRcfm7bB90lPWGLdKK4Zqt64RH9bW512s+4lVOnW/SCciu7TlSp+OOLHlg0ocafkpEzvAf8ciCuZwf+lGxM1hP6/BIslQjBe1fOoFj3bQabYtirxGL4GX1ej+89nidFZRATGu9Ws6mcPb0VGW5GhOEpjvhU8J83aDwCWU8s5/HSCzxtCqY3Oh9VBrW8/8RHm4JL9P0pr2d8RfNOemR7TP5ewSTKKp9hX1fme8jw/mQkVQv6jFfSsmN8/v6aN2Ujzfzm7CVFzUea+en7cz6WizT/w/fnxKlRbHhalnMv7njpU0g2ZDPoG54CY467ukyPbHe7K1/KOUqnF41cT7DzPdDP+0S/po/WOY3zcreYgbUk3hnC+MVRGb85lKT4yfEvBeugHcn9wH0bvzjSiGt4lDh0eNQypmvx2Gn7fRvTdeikrh8ciLZAdfQDedLouWKZS0gVCmp74mxC0jhFeeo4xRV99OBKe5JhvGAZEYrx/poRoQvuw1j3ieuvGsa6ouxdJ8f5XPqYS6lH/W1jbx/wDhgWy4Bh9ZUDhv/wPsq5+vZRzhcuXLhw4cLP4h9vMkOBzoNqyQAAAABJRU5ErkJggg=="
                    alt="Avatar"
                    className="rounded-circle me-2"
                    style={{ width: "35px", height: "35px" }}
                  />
                {student?.name}
                
                </a>
               
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#account">
                      Account Management
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="/" onClick={logout}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
