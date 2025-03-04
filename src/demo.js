















import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Header/Header";
import { getFilterCourse } from "../../../api/course";
import { Link } from "react-router-dom";
import { getResultUser } from "../../../api/result";
import { getuserId } from "../../../utils/Storage";
import { getSingleUser } from "../../../api/user";
import { toast } from "react-toastify";

function CourseList() {
  const [job, setJob] = useState([]);
  const [userResults, setUserResults] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [videoProgress, setVideoProgress] = useState({}); // Track video progress for each course

  useEffect(() => {
    getAllJobList();
  }, []);

  useEffect(() => {
    const userId = getuserId();
    if (userId) {
      getUserDetails(userId);
    } else {
      toast.error("User is not logged in. Redirecting to login page.");
    }
  }, []);

  const getUserDetails = async (id) => {
    try {
      const res = await getSingleUser(id);
      setUserDetails(res?.data?.result);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const getAllJobList = () => {
    const data = { limit: 10 };
    getFilterCourse(data)
      .then((res) => {
        const userList = res?.data?.result?.userList || [];
        setJob(userList);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (userDetails) {
      const userId = userDetails?._id;
      if (userId) {
        getAllUserResults(userId);
      } else {
        console.error("User ID is missing.");
      }
    }
  }, [userDetails]);

  const getAllUserResults = (userId) => {
    getResultUser(userId)
      .then((res) => {
        const userResults = res?.result || {};
        const resultMap = userResults.reduce((acc, result) => {
          acc[result.courseId] = result;
          return acc;
        }, {});
        setUserResults(resultMap);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
      });
  };

  const handleVideoCompletion = (courseId) => {
    setVideoProgress((prevProgress) => {
      const updatedProgress = { ...prevProgress };
      const currentProgress = updatedProgress[courseId] || { currentIndex: 0, isComplete: false };

      if (currentProgress.currentIndex < 1) {
        // Move to the next video (from 0 to 1)
        updatedProgress[courseId] = { ...currentProgress, currentIndex: currentProgress.currentIndex + 1 };
      } else {
        // Mark as complete after the second video
        updatedProgress[courseId] = { ...currentProgress, isComplete: true };
      }

      return updatedProgress;
    });
  };

  const isCourseCompleted = (courseId) => {
    const result = userResults[courseId];
    return result && result.testStatus === "complete" && parseInt(result.percentage, 10) >= 80;
  };

  const canStartTest = (courseId) => {
    return videoProgress[courseId]?.isComplete;
  };

  return (
    <>
      <Header />
      <div className="container mt-5 pt-1">
        <div className="row mt-5 g-3">
          <h2 className="text-center mb-4 mt-3">Available Courses</h2>

          {Array.isArray(job) && job.length > 0 ? (
            job.map((data, index) => {
              const courseProgress = videoProgress[data?._id] || { currentIndex: 0, isComplete: false };

              return (
                <div className="col-md-12 col-lg-4" key={index}>
                  <div className="card shadow-lg rounded border-0 overflow-hidden">
                    <video
                      src={
                        courseProgress.currentIndex === 0
                          ? data?.mainVideo
                          : data?.optionalVideo1
                      }
                      controls
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                      onEnded={() => handleVideoCompletion(data?._id)}
                    ></video>

                    <div className="card-body p-3">
                      <h5 className="card-title text-truncate" style={{ maxWidth: "80%" }}>
                        {data.courseName || "Unnamed Course"}
                      </h5>

                      {isCourseCompleted(data?._id) && (
                        <span className="btn btn-outline-success btn-sm disabled mb-3">
                          You have completed the test already. Done.
                        </span>
                      )}

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        {!isCourseCompleted(data?._id) && (
                          <>
                            {!canStartTest(data?._id) ? (
                              <span className="btn btn-secondary btn-sm disabled">
                                Watch Videos First
                              </span>
                            ) : (
                              <Link
                                className="btn btn-outline-primary btn-sm"
                                to={{
                                  pathname: "/ListQuestions",
                                  search: `?id=${data?._id}`,
                                }}
                              >
                                <i className="fas fa-play-circle fw-bold me-2"></i>Start Test
                              </Link>
                            )}
                          </>
                        )}
                      </div>

                      {!isCourseCompleted(data?._id) && !canStartTest(data?._id) && (
                        <p className="text-danger" style={{ fontSize: "0.9rem" }}>
                          Please watch all videos completely to start the test.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center mt-4">No courses available at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseList;








import React, { useEffect, useState, useRef } from "react";
import Sidebar from '../../compoents/StaffSidebar';
import { useNavigate, useLocation } from "react-router-dom";
import { updateApplication, getSingleApplication } from "../../api/applicatin";
import { getSingleStaff } from "../../api/staff";
import { getStaffId } from "../../Utils/storage";
import { getFilterStatus } from "../../api/status";
import { getFilterApplicationStatus } from "../../api/universityModule/ApplicationStatus";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { RichTextEditor } from "@mantine/rte";
import { duration } from "@mui/material";
import { formatDate } from "../../Utils/DateFormat";
import BackButton from "../../compoents/backButton";

export const ViewApplication = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const modalRef = useRef(null);

  const initialState = {
    newStatus: "",
    commentBox: "",
    document: "",
    duration: "",
    progress: "",
  };

  const initialStateErrors = {
    newStatus: { required: false },
    commentBox: { required: false },
    document: { required: false },
    duration: { required: false },
    progress: { required: false },
  };

  const [track, setTrack] = useState(initialState);
  const [tracks, setTracks] = useState([]);
  const [application, setApplication] = useState([]);
  const [staff, setStaff] = useState([]);
  const [trackErrors, setTrackErrors] = useState(initialStateErrors);
  const [status, setStatus] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: 10,
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getStaffDetails();
      getAllModuleDetails();
      getApplicationDetails();
      getAllApplicationsModuleDetails();
      getAgentList();
    }
  }, [id]);

  const getAgentList = () => {
    getSingleApplication(id)
      .then((res) => {
        console.log("yuvi", res);
        setTracks(res?.data?.result || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStaffDetails = () => {
    const id = getStaffId();
    getSingleStaff(id)
      .then((res) => {
        setStaff(res?.data?.result); // Assuming the staff data is inside res.data.result
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const getApplicationDetails = () => {
    getSingleApplication(id)
      .then((res) => {
        if (res.data.result?.status) {
          setTrack({
            newStatus: res.data.result || "",
            commentBox: res.data.result || "",
            document: res.data.result || "",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllApplicationsModuleDetails = () => {
    const data = {
      limit: 10,
      page: pagination.from,
    };
    getFilterApplicationStatus(data)
      .then((res) => {
        setStatus(res?.data?.result?.statusList || []);
        setPagination({
          ...pagination,
          count: res?.data?.result?.statusCount || 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllModuleDetails = () => {
    const data = {
      limit: 10,
      page: pagination.from,
    };
    getFilterStatus(data)
      .then((res) => {
        setApplication(res?.data?.result?.statusList || []);
        setPagination({
          ...pagination,
          count: res?.data?.result?.statusCount || 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRichTextChange = (value) => {
    setTrack((prevUniversity) => ({
      ...prevUniversity,

      commentBox: value,
    }));
  };

  const handleValidation = (data) => {
    let error = { ...initialStateErrors };
    if (!data.newStatus) {
      error.newStatus.required = true;
    }
    if (!data.commentBox) {
      error.commentBox.required = true;
    }


    return error;
  };
  const convertToBase64 = (e, name) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTrack((prevUniversity) => ({
        ...prevUniversity,
        [name]: reader.result,
      }));
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };
  const handleTrack = (event) => {
    const { name, value, files } = event.target;
    if (files && files[0]) {
      convertToBase64(event, name);
    } else {
      setTrack((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (submitted) {
      const newError = handleValidation({
        ...track,
        [event.target.name]: event.target.value,
      });
      setTrackErrors(newError);
    }
  };



  const handleEditModule = (item) => {
    setTrack({
      newStatus: item.statusName,
      duration: item.duration,
      commentBox: "",
      document: "", // Initialize commentBox as empty or with a value if needed
    });
    setIsEditing(true);
    setEditId(item._id);
    setSubmitted(false);
    setTrackErrors(initialStateErrors);
  };

  const handleErrors = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const prop = obj[key];
        if (prop.required === true || prop.valid === true) {
          return false;
        }
      }
    }
    return true;
  };

  const handleTrackSubmit = (event) => {
    event.preventDefault();
    const newErrorEducation = handleValidation(track);
    setTrackErrors(newErrorEducation);
    setSubmitted(true);
    if (handleErrors(newErrorEducation)) {
      if (id) {
        const data = {
          _id: id,
          status: track,
          progress: Math.min(100, track.progress + 80),


        };
        updateApplication(data)
          .then((res) => {
            toast.success("Successfully updated application status");
            getAllModuleDetails();
            if (modalRef.current) {
              modalRef.current.click(); // Close the modal
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return '#e0e0e0'; // Gray for 0 progress
    if (progress < 50) return '#ff9800'; // Orange for <50%
    if (progress < 100) return '#ffc107'; // Yellow for <100%
    return '#4caf50'; // Green for 100%
  };

  return (
    <>
      <Sidebar />
      <div
        className="content-wrapper"
        style={{ fontFamily: "Plus Jakarta Sans", fontSize: "14px" }}
      >
        <div className="content-header text-end">

          <BackButton />

        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="card rounded-1 ">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-4 border-end border-5 border-primary">

                            <h5 className="card-name fw-semibold text-center">
                              {tracks?.name}
                            </h5>
                            <p className="card-text text-center fw-semibold mb-1">
                              {tracks?.email} {/* Student Code:{tracks?.studentCode || "N/A"} */}
                            </p>
                            <p className="card-text text-secondary text-center fw-semibold mb-3">
                              {tracks?.studentCode || "N/A"} || {tracks?.country}
                            </p>
                            <div className="text-center">
                              <button
                                aria-valuenow="75"
                                aria-valuemin="0"
                                aria-valuemax="100"
                                className="btn btn-sm text-uppercase fw-semibold rounded-pill text-white px-4 py-1 position-relative"
                                style={{
                                  fontSize: "12px",
                                  backgroundColor: "#28A745",
                                  border: "none",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  className="position-absolute top-50 start-50 translate-middle"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#ffffff",
                                    opacity: 0.2,
                                  }}
                                >
                                  <div
                                    className="progress position-relative"
                                    style={{ height: "100%" }}
                                  >
                                    <div
                                      className="progress-bar progress-bar-striped progress-bar-animated"
                                      style={{ width: "75%", height: "100%" }}
                                    ></div>
                                  </div>
                                </div>
                                <span>View Profile</span>
                              </button>
                              <div className="text-center">
                                <small>(75%) Completed</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-8">
                            <h5 className="card-program mb-2 fw-light">
                              <span className="text-primary fw-bold">{tracks?.course}</span>

                            </h5>
                            <div className="mb-3 d-flex justify-content-between">
                              <p className="card-text">{tracks?.universityName}</p>
                              <div className="card p-2 rounded-1 border-primary border-2">
                                <i className="fas fa-star"></i>
                              </div>
                            </div>
                            <div className="card bg-transparent rounded-2 mt-4">
                              <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex flex-column">
                                    <p className="fw-semilight">Campus</p>
                                    <p className="fw-semibold">{tracks?.campus}</p>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <p className="fw-semilight">Intake</p>
                                    <p className="fw-semibold">{tracks?.inTake}</p>
                                  </div>

                                  <div className="d-flex flex-column">
                                    <p className="fw-semilight">Tuition Fee</p>
                                    <p className="fw-semibold">{tracks?.courseFees}</p>
                                  </div>
                                  <div className="d-flex flex-column">
                                    <p className="fw-semilight">Application Code</p>
                                    <p className="fw-semibold">{tracks?.applicationCode}</p>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* <div className="container-fluid ">
  <div className="row">
    <div className="col">
      <div className="card border-0 rounded-1 shadow-sm p-4">
        <div className="card-body">
        
          {status.map((item, index) => (
          <div   key={index} className="position-relative">
            <div className="progress" role="progressbar" aria-label="Progress" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{height: 8}}>
              <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" style={{width: '50%'}} />
            </div>
          
            
            <div className="d-flex justify-content-between position-absolute w-100 top-50 translate-middle-y">
              <button type="button" className="btn btn-sm btn-primary rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}  onClick={() => handleEditModule(item)} style={{width: '2rem', height: '2rem'}}>1</button>
              <button type="button" className="btn btn-sm btn-primary rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}  onClick={() => handleEditModule(item)} style={{width: '2rem', height: '2rem'}}>2</button>
              <button type="button" className="btn btn-sm btn-primary rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}  onClick={() => handleEditModule(item)} style={{width: '2rem', height: '2rem'}}>3</button>
              <button type="button" className="btn btn-sm btn-danger rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}   onClick={() => handleEditModule(item)}style={{width: '2rem', height: '2rem'}}>4</button>
              <button type="button" className="btn btn-sm btn-danger rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}  onClick={() => handleEditModule(item)} style={{width: '2rem', height: '2rem'}}>5</button>
              <button type="button" className="btn btn-sm btn-danger rounded-pill"  data-bs-bs-toggle="modal"
                              data-bs-bs-target={#modal-${index}}  onClick={() => handleEditModule(item)} style={{width: '2rem', height: '2rem'}}>6</button>
            </div>
          </div>
            ))}
        
          <div className="d-flex justify-content-between mt-3">
            <span>Submitted</span>
            <span>Offer</span>
            <span>Deposit</span>
            <span>Approval</span>
            <span>Enrollment</span>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> */}



              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="card border-0 rounded-1 shadow-sm p-3">
                      <div className="card-body">
                        {/* <div className="d-flex   justify-content-between align-items-center">
                      {status.map((item, index) => (
                        <div
                          className="position-relative m-2"
                          key={index}
                          style={{ flex: "1 1 auto", maxWidth: "18%" }}
                        >
                          <div className="position-relative">
                            <div
                              className="progress"
                              role="progressbar"
                              aria-label="Progress"
                              aria-valuenow={item.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ height: "9px" }}
                            >
                              <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                style={{
                                  width: ${item.progress}%,
                                  backgroundColor: getProgressColor(item.progress),
                                }}
                              ></div>
                            </div>
                          
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated"
                              style={{
                                width: ${item.progress}%,
                                backgroundColor: getProgressColor(item.progress),
                              }}
                            ></div>
                          </div>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>{item.duration} Days</Tooltip>}
                          >
                            <button
                              type="button"
                              className="position-absolute text-bold  top-0  start-0 translate-middle-y btn btn-sm btn-primary rounded-pill"
                              data-bs-toggle="modal"
                              data-bs-target={#modal-${index}}
                              style={{
                                width: "2rem",
                                height: "2rem",
                                left: "0",
                               
                                color: "#FFF",
                              }}
                              onClick={() => handleEditModule(item)}
                            >
{item.duration} 
                             
                            </button>
                          </OverlayTrigger>
                          <div className="d-flex justify-content-start align-items-center mt-3"> {item.statusName}</div>
                         

                          <div
                            className="modal fade"
                            id={modal-${index}}
                            tabIndex="-1"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h1
                                    className="modal-title fs-5"
                                    id="staticBackdropLabel"
                                  >
                                    Application Status
                                  </h1>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ref={modalRef}
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <form onSubmit={handleTrackSubmit}>
                                    <div className="input-group mb-3">
                                      <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                      >
                                        <i className="fa fa-tasks nav-icon text-dark"></i>
                                      </span>
                                      <input
                                        type="text"
                                        name="newStatus"
                                        value={track.newStatus}
                                        onChange={handleTrack}
                                        className="form-control"
                                        placeholder="Enter Status...."
                                        aria-label="Status"
                                        aria-describedby="basic-addon1"
                                        style={{ fontSize: "12px" }}
                                      />
                                      {submitted &&
                                        trackErrors.newStatus.required && (
                                          <p className="text-danger">
                                            Status is required
                                          </p>
                                        )}
                                    </div>
                                    <div className="input-group mb-3">
                                      <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                      >
                                        <i className="fa fa-tasks nav-icon text-dark"></i>
                                      </span>
                                      <input
                                        type="text"
                                        name="duration"
                                        value={track.duration}
                                        onChange={handleTrack}
                                        className="form-control"
                                        placeholder="Enter Status...."
                                        aria-label="Status"
                                        aria-describedby="basic-addon1"
                                        style={{ fontSize: "12px" }}
                                      />
                                      {submitted &&
                                        trackErrors.duration.required && (
                                          <p className="text-danger">
                                            Status is required
                                          </p>
                                        )}
                                    </div>
                                    <div className="input-group mb-3">
                                    
                                      <RichTextEditor
                                        placeholder="Start writing your content here..."
                                        name="commentBox"
                                        onChange={handleRichTextChange}
                                        value={track.commentBox}
                                        type="text"
                                        style={{
                                          fontFamily: "Plus Jakarta Sans",
                                          fontSize: "12px",
                                        
                                          zIndex: "0",
                                        }}
                                      />
                                      {submitted &&
                                        trackErrors.commentBox.required && (
                                          <p className="text-danger">
                                            Comment is required
                                          </p>
                                        )}
                                    </div>

                                    <div className="input-group mb-3">
                                      <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                      >
                                        <i className="fa fa-file nav-icon text-dark"></i>
                                      </span>
                                      <input
                                        type="number"
                                        className="form-control "
                                        style={{
                                          fontFamily: "Plus Jakarta Sans",
                                          fontSize: "12px",
                                        }}
                                        value={"80"}
                                        placeholder="Enter  Image upload"
                                        name="progress"
                                        onChange={handleTrack}
                                      />
                                    </div>
                                    <div className="input-group mb-3">
                                      <span
                                        className="input-group-text"
                                        id="basic-addon1"
                                      >
                                        <i className="fa fa-file nav-icon text-dark"></i>
                                      </span>
                                      <input
                                        type="file"
                                        className="form-control "
                                        style={{
                                          fontFamily: "Plus Jakarta Sans",
                                          fontSize: "12px",
                                        }}
                                        placeholder="Enter  Image upload"
                                        name="document"
                                        onChange={handleTrack}
                                      />
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button"
                                        className="btn px-4 py-2 text-uppercase fw-semibold"
                                        data-bs-bs-dismiss="modal"
                                        style={{
                                          fontSize: "12px",
                                          backgroundColor: "#231f20",
                                          color: "#fff",
                                        }}
                                      >
                                        Close
                                      </button>
                                      <button
                                        type="submit"
                                        className="btn px-4 py-2 text-uppercase fw-semibold"
                                        style={{
                                          fontSize: "12px",
                                          backgroundColor: "#fe5722",
                                          color: "#fff",
                                        }}
                                        data-bs-dismiss="modal"
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                       
                      ))}
                    </div> */}



                        <div className="d-flex justify-content-between align-items-center">
                          {status.map((item, index) => {
                            // Assuming staff contains the current user's details
                            const currentUser = staff?.designation;

                            // Define the range of statuses for user1 (first 3) and user2 (last 3)
                            const showForUser1 = currentUser === "Counciler" && index < 3;
                            const showForUser2 = currentUser === "Development Team" && index >= 3;

                            // Only display statuses that match the current user's criteria
                            if (showForUser1 || showForUser2) {
                              return (
                                <div
                                  className="position-relative m-2"
                                  key={index}
                                  style={{ flex: "1 1 auto", maxWidth: "18%" }}
                                >
                                  <div className="position-relative">
                                    <div
                                      className="progress"
                                      role="progressbar"
                                      aria-label="Progress"
                                      aria-valuenow={item.progress}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                      style={{ height: "9px" }}
                                    >
                                      <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        style={{
                                          width: ${item.progress}%,
                                          backgroundColor: getProgressColor(item.progress),
                                        }}
                                      ></div>
                                    </div>

                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={<Tooltip>{item.duration} Days</Tooltip>}
                                    >
                                      <button
                                        type="button"
                                        className="position-absolute text-bold top-0 start-0 translate-middle-y btn btn-sm btn-primary rounded-pill"
                                        data-bs-toggle="modal"
                                        data-bs-target={#modal-${index}}
                                        style={{
                                          width: "2rem",
                                          height: "2rem",
                                          left: "0",
                                          color: "#FFF",
                                        }}
                                        onClick={() => handleEditModule(item)}
                                      >
                                        {item.duration}
                                      </button>
                                    </OverlayTrigger>

                                    <div className="d-flex justify-content-start align-items-center mt-3">
                                      {item.statusName}
                                    </div>

                                    <div
                                      className="modal fade"
                                      id={modal-${index}}
                                      tabIndex="-1"
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                          <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                              Application Status
                                            </h1>
                                            <button
                                              type="button"
                                              className="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                              ref={modalRef}
                                            ></button>
                                          </div>
                                          <div className="modal-body">
                                            <form onSubmit={handleTrackSubmit}>
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1">
                                                  <i className="fa fa-tasks nav-icon text-dark"></i>
                                                </span>
                                                <input
                                                  type="text"
                                                  name="newStatus"
                                                  value={track.newStatus}
                                                  onChange={handleTrack}
                                                  className="form-control"
                                                  placeholder="Enter Status...."
                                                  aria-label="Status"
                                                  aria-describedby="basic-addon1"
                                                  style={{ fontSize: "12px" }}
                                                />
                                                {submitted && trackErrors.newStatus.required && (
                                                  <p className="text-danger">Status is required</p>
                                                )}
                                              </div>
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1">
                                                  <i className="fa fa-tasks nav-icon text-dark"></i>
                                                </span>
                                                <input
                                                  type="text"
                                                  name="duration"
                                                  value={track.duration}
                                                  onChange={handleTrack}
                                                  className="form-control"
                                                  placeholder="Enter Duration...."
                                                  aria-label="Duration"
                                                  aria-describedby="basic-addon1"
                                                  style={{ fontSize: "12px" }}
                                                />
                                                {submitted && trackErrors.duration.required && (
                                                  <p className="text-danger">Duration is required</p>
                                                )}
                                              </div>
                                              <div className="input-group mb-3">
                                                <RichTextEditor
                                                  placeholder="Start writing your content here..."
                                                  name="commentBox"
                                                  onChange={handleRichTextChange}
                                                  value={track.commentBox}
                                                  type="text"
                                                  style={{
                                                    fontFamily: "Plus Jakarta Sans",
                                                    fontSize: "12px",
                                                    zIndex: "0",
                                                  }}
                                                />
                                                {submitted && trackErrors.commentBox.required && (
                                                  <p className="text-danger">Comment is required</p>
                                                )}
                                              </div>
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1">
                                                  <i className="fa fa-file nav-icon text-dark"></i>
                                                </span>
                                                <input
                                                  type="number"
                                                  className="form-control "
                                                  style={{
                                                    fontFamily: "Plus Jakarta Sans",
                                                    fontSize: "12px",
                                                  }}
                                                  value={"80"}
                                                  placeholder="Enter Progress"
                                                  name="progress"
                                                  onChange={handleTrack}
                                                />
                                              </div>
                                              <div className="input-group mb-3">
                                                <span className="input-group-text" id="basic-addon1">
                                                  <i className="fa fa-file nav-icon text-dark"></i>
                                                </span>
                                                <input
                                                  type="file"
                                                  className="form-control "
                                                  style={{
                                                    fontFamily: "Plus Jakarta Sans",
                                                    fontSize: "12px",
                                                  }}
                                                  placeholder="Upload Document"
                                                  name="document"
                                                  onChange={handleTrack}
                                                />
                                              </div>
                                              <div className="modal-footer">
                                                <button
                                                  type="button"
                                                  className="btn px-4 py-2 text-uppercase fw-semibold"
                                                  data-bs-dismiss="modal"
                                                  style={{
                                                    fontSize: "12px",
                                                    backgroundColor: "#231f20",
                                                    color: "#fff",
                                                  }}
                                                >
                                                  Close
                                                </button>
                                                <button
                                                  type="submit"
                                                  className="btn px-4 py-2 text-uppercase fw-semibold"
                                                  style={{
                                                    fontSize: "12px",
                                                    backgroundColor: "#fe5722",
                                                    color: "#fff",
                                                  }}
                                                  data-bs-dismiss="modal"
                                                >
                                                  Submit
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return null; // If the status doesn't match the current user, do not display it
                            }
                          })}
                        </div>









                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="card card-body mb-3">
                      <h6 className="text-start">Notes</h6>
                      <div className="text-end">
                        <button className="btn btn-outline-dark text-uppercase fw-semibold px-3 py-1 text-center rounded-1" data-bs-toggle="modal"
                          data-bs-target="#StatusModal"

                          style={{ fontSize: '12px' }}>Add Status</button>
                      </div>

                      <div
                        className="modal fade"
                        id="StatusModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="staticBackdropLabel"
                              >
                                Application Status
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"

                              ></button>
                            </div>
                            <div className="modal-body">
                              <form onSubmit={handleTrackSubmit}>
                                <div className="input-group mb-3">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-tasks nav-icon text-dark"></i>
                                  </span>
                                  <select
                                    name="newStatus"
                                    value={track.newStatus}
                                    onChange={handleTrack}
                                    className="form-select"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <option value="">Select Status</option>
                                    {
                                      application.map((status) => (
                                        <option
                                          key={status._id}
                                          value={status.statusName}
                                        >
                                          {status.statusName}
                                        </option>
                                      ))}
                                  </select>
                                  {submitted &&
                                    trackErrors.newStatus.required && (
                                      <p className="text-danger">
                                        Status is required
                                      </p>
                                    )}
                                </div>
                                <div className="input-group mb-3 visually-hidden">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-tasks nav-icon text-dark"></i>
                                  </span>
                                  <input
                                    type="text"
                                    name="duration"
                                    value="0"
                                    onChange={handleTrack}
                                    className="form-control"
                                    placeholder="Enter Status...."
                                    aria-label="Status"
                                    aria-describedby="basic-addon1"
                                    style={{ fontSize: "12px" }}
                                  />

                                </div>
                                <div className="input-group mb-3">

                                  <RichTextEditor
                                    placeholder="Start writing your content here..."
                                    name="commentBox"
                                    onChange={handleRichTextChange}
                                    value={track.commentBox}
                                    type="text"
                                    style={{
                                      fontFamily: "Plus Jakarta Sans",
                                      fontSize: "12px",

                                      zIndex: "0",
                                    }}
                                  />
                                  {submitted &&
                                    trackErrors.commentBox.required && (
                                      <p className="text-danger">
                                        Comment is required
                                      </p>
                                    )}
                                </div>
                                <div className="input-group mb-3">
                                  <span
                                    className="input-group-text"
                                    id="basic-addon1"
                                  >
                                    <i className="fa fa-file nav-icon text-dark"></i>
                                  </span>
                                  <input
                                    type="file"
                                    className="form-control "
                                    style={{
                                      fontFamily: "Plus Jakarta Sans",
                                      fontSize: "12px",
                                    }}
                                    placeholder="Enter  Image upload"
                                    name="document"
                                    onChange={handleTrack}
                                  />
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn px-4 py-2 text-uppercase fw-semibold"
                                    data-bs-dismiss="modal"
                                    style={{
                                      fontSize: "12px",
                                      backgroundColor: "#231f20",
                                      color: "#fff",
                                    }}
                                  >
                                    Close
                                  </button>
                                  <button
                                    type="submit"
                                    data-bs-dismiss="modal"
                                    className="btn px-4 py-2 text-uppercase fw-semibold"
                                    style={{
                                      fontSize: "12px",
                                      backgroundColor: "#fe5722",
                                      color: "#fff",
                                    }}
                                  // data-bs-bs-dismiss="modal"
                                  >
                                    Submit
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container-fluid-fluid my-2">
                <div className="row flex-nowrap">

                  <div className="col-md-4 col-sm-4 d-flex flex-column justify-content-between overflow-auto border-end">
                    <div className="card border-0 rounded-1 shadow-sm vh-100 min-vh-100 overflow-auto">
                      <div className="card-header bg-white border-0">

                        <div className="text-center">
                          <button
                            aria-valuenow="75"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            className="btn btn-sm text-capitalize fw-semibold rounded-pill text-white  position-relative"
                            style={{
                              fontSize: "10px",
                              backgroundColor: "#7627ef",
                              border: "none",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              className="position-absolute top-50 start-50 translate-middle"
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#ffffff",
                                opacity: 0.2,
                              }}
                            >
                              <div
                                className="progress position-relative"
                                style={{ height: "100%" }}
                              >
                                <div
                                  className="progress-bar progress-bar-striped progress-bar-animated"
                                  style={{ width: "75%", height: "100%" }}
                                ></div>
                              </div>
                            </div>
                            <span>Document</span>
                          </button>
                          <div className="text-center">
                            <small>(75%) Completed</small>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-4">
                        <img
                          src={tracks?.photo || "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"}
                          className="card-img-top rounded-circle border-0"
                          alt="Profile"
                          style={{ width: "3rem", height: "3rem" }}
                        />  {tracks?.createdBy}
                        <p>
                          Application Status -  {formatDate(tracks?.createdOn)}
                        </p>

                        {tracks?.status && (
                          <div>
                            {tracks.status.map((item, index) => (
                              <a
                                href={item?.document || "#"}
                                target="_blank"

                                key={index}
                                className="d-flex gap-2 align-items-center mb-2 text-decoration-none"
                              >
                                <div className="me-2">
                                  {item?.document ? (
                                    <img
                                      src={item?.document}
                                      className="card-img-top border-0 me-2"
                                      alt="Document"
                                      style={{ width: "10rem", height: "3rem" }}
                                    />
                                  ) : (
                                    <div
                                      className="card-img-top border-0 me-2 d-flex justify-content-center align-items-center"
                                      style={{ width: "10rem", height: "3rem", backgroundColor: "#f0f0f0" }}
                                    >

                                      <p className="mb-0" style={{ fontSize: "12px", color: "#888" }}>
                                        No Document
                                      </p>
                                    </div>
                                  )}
                                  <p className="card-text mb-0" style={{ fontSize: "12px" }}>
                                    {item?.name}
                                  </p>
                                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-0 p-0">

                                    <p classname='mb-0'><small>Sent</small></p>

                                    <p classname='mb-0'><small>Time</small></p>
                                  </div>
                                </div>
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              </a>


                            ))}

                          </div>

                        )}
                      </div>

                    </div>
                  </div>


                  <div className="col-md-8 col-sm-8">
                    <div className="card border-0 rounded-1 shadow-sm vh-100 min-vh-100 overflow-auto">
                      <div className="card-header bg-white sticky-top">
                        <h6 className="card-title">Application Track</h6>
                      </div>


                      <div className="collapse" id="taggingSection">
                        <div className="btn btns-m border-0 rounded-1 btn-danger float-end m-2" data-bs-toggle="collapse" data-bs-target="#taggingSection"><i className="fa fa-minus" aria-hidden="true"></i>&nbsp;Hide</div>
                        <div className="card-body p-4 border rounded-1">

                          <form>
                            <div className="form-group mb-3">
                              <label for="tagPerson">Tag Person</label>
                              <input
                                type="text"
                                className="form-control rounded-1 text-muted"
                                id="tagPerson"
                                placeholder="Enter person's name"
                                style={{ fontSize: "12px" }}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label for="subject">Subject</label>
                              <RichTextEditor
                                placeholder="Start writing your content here..."
                                name="content"
                                style={{
                                  fontFamily: "Plus Jakarta Sans",
                                  fontSize: "12px"
                                }}
                                controls={[
                                  ['bold', 'italic', 'underline', 'strike'],
                                  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                                  ['unorderedList', 'orderedList'],
                                  ['indent', 'outdent'],
                                  ['link', 'image', 'video'],
                                  ['blockquote', 'codeBlock'],
                                  ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
                                  ['subscript', 'superscript'],
                                  ['color', 'backgroundColor']
                                ]}
                              />
                            </div>
                            <button type="submit" className="btn btn-primary float-end border-0 rounded-1 ">Send</button>
                          </form>
                        </div>
                      </div>


                      <div className="card-body ">
                        <div className="chat-messages">
                          <div className="container-fluid">

                            <div className="row">
                              {tracks?.status &&
                                tracks.status.map((item, index) => (
                                  <div key={index} className="d-flex justify-content-end mb-4">
                                    <div className="profile-content">
                                      <img
                                        src={tracks?.photo || "https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"}
                                        className="card-img-top rounded-circle border-0"
                                        alt="Profile"
                                        style={{ width: "4.5rem", height: "4.5rem" }}
                                      />
                                    </div>

                                    <div className="col-10">
                                      <div className="card ">
                                        <div className="card-header text-bg-danger">

                                          <p className="mb-0">Application Decision:{item?.newStatus}</p>
                                          <div className="d-flex gap-2">
                                            <p className="mb-0">{formatDate(item?.createdOn)}</p>
                                            <button className="btn btn-sm btn-link text-white" type="button" data-bs-toggle="collapse" data-bs-target="#taggingSection">
                                              <i className="fa fa-reply" aria-hidden="true"></i>
                                            </button>
                                          </div>

                                        </div>
                                        <div className="card-body">
                                          <RichTextEditor
                                            value={item?.commentBox}
                                            readOnly
                                          /> <br /><br />
                                          Sincerely,<br />
                                          {item?.createdBy}<br />
                                          Edufynd


                                          <div className="d-flex flex-column align-items-end justify-content-end">
                                            <p className="mb-0"><b>Duration</b>- {item?.duration}Days</p>
                                            <p className="mb-0"><b>Delayed</b>- {item?.delay}Days</p>
                                          </div>

                                          <div className="d-flex flex-wrap justify-content-between align-items-center mb-0 p-0">

                                            <p classname='mb-0'><small>Sent</small></p>

                                            <p classname='mb-0'><small>Time</small></p>
                                          </div>


                                        </div>

                                      </div>
                                    </div>

                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>



                    </div>
                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewApplication;



















import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import {
  FaPlus,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
  FaEdit,
} from "react-icons/fa";

const ThreatObservation = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  const downloadPDF = () => {
    if (images.length === 0) {
      alert("No images to download!");
      return;
    }

    const pdf = new jsPDF();
    images.forEach((image, index) => {
      pdf.addImage(image, "JPEG", 10, 10, 180, 150); // Add image to PDF
      if (index < images.length - 1) {
        pdf.addPage(); // Add a new page for the next image
      }
    });

    pdf.save("images.pdf"); // Save the PDF
  };

  const handleZoom = (type) => {
    setZoom((prevZoom) => (type === "in" ? prevZoom + 10 : prevZoom - 10));
  };

  // Handle scrolling in the large image section
  const handleImageScroll = (e) => {
    const viewerHeight = e.target.clientHeight; // The height of the visible image container
    const scrollTop = e.target.scrollTop; // The amount the container has been scrolled
    const imagesPerScroll = 1; // We want to change one image per scroll event

    // Calculate the index of the image to display based on scroll position
    const index = Math.floor(scrollTop / viewerHeight) * imagesPerScroll;

    // Ensure the index is within the valid range
    const newIndex = Math.min(Math.max(index, 0), images.length - 1);

    // Only change image if the index has actually changed
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          {/* Toolbar */}
          <div
            className="toolbar"
            style={{
              display: "flex",
              position: "fixed", // Make the toolbar fixed at the top
              background: "#fff",
              zIndex: 1,
              borderBottom: "1px solid #ccc",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Optional: Adds shadow for better separation
              padding: "10px",
              width: "100%",
            }}
          >
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <FaPlus size={20} />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <FaSearchPlus
              size={20}
              onClick={() => handleZoom("in")}
              style={{ cursor: "pointer" }}
            />
            <FaSearchMinus
              size={20}
              onClick={() => handleZoom("out")}
              style={{ cursor: "pointer" }}
            />
            <FaDownload
              size={20}
              onClick={downloadPDF}
              style={{ cursor: "pointer" }}
            />
            <FaEdit size={20} style={{ cursor: "pointer" }} />
          </div>

          {/* Adjust marginTop to match the toolbar height */}
          <div
            className="content container-fluid"
            style={{
              marginTop: "60px", // Make space for the fixed toolbar
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Viewer */}
            <div
              className="image-viewer"
              style={{
                display: "flex",
                height: "calc(100vh - 60px)", // Full screen height minus toolbar height
                overflowY: "auto", // Allow vertical scroll
              }}
            >
              {/* Thumbnails Section */}
              <div
                style={{
                  width: "150px",
                  overflowY: "auto",
                  borderRight: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "10px",
                      cursor: "pointer",
                      border:
                        idx === currentIndex
                          ? "2px solid green"
                          : "1px solid gray",
                      fontWeight: idx === currentIndex ? "bold" : "normal", // Bold the selected image
                    }}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>

              {/* Large Image Section */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflowY: "auto", // Allow scrolling in the large image section
                  height: "100%", // Ensures the image container takes full height
                  padding: "10px",
                }}
                onScroll={handleImageScroll} // Add onScroll event listener
              >
                {images.length > 0 ? (
                  <div
                    style={{
                      width: `${zoom}%`,
                      height: "auto",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={images[currentIndex]}
                      alt={`Image ${currentIndex + 1}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                ) : (
                  <p>No images uploaded. Please add images to view.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreatObservation;


























import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import SideBar from "../../components/SideBar";
import Header from "../../components/Header";
import { saveSOP ,getSingleSop } from '../../api/sop'; // assuming saveSOP is the API function to save data to backend
import { uploadFile } from '../../utils/FileUpload'; // assuming uploadFile is a utility function to upload file

const ThreatObservation = () => {
  const [pdfFile, setPdfFile] = useState(null); // No need to specify type in JSX, JavaScript infers it
  const [sopName, setSopName] = useState("Threat Observation"); // Default to "Threat Observation"
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track if the file is uploaded

  // Handle PDF upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file); // Set the uploaded file into state
      setIsFileUploaded(true); // Mark file as uploaded
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  // Handle SOP name change (if necessary)
  const handleSopNameChange = (e) => {
    setSopName(e.target.value);
  };

  // Handle save SOP to backend
  const handleSaveSop = async () => {
    if (!sopName || !pdfFile) {
      alert("Please provide both SOP name and PDF file.");
      return;
    }

    try {
      // Upload file first
      const uploadedFileUrl = await uploadFile(pdfFile);
      console.log(uploadedFileUrl, ":uploadedFileUrl");

      // Send SOP data (sopName and pdfUrl) to backend
      await saveSOP({
        sopName: sopName,
        pdfurl: uploadedFileUrl, // The URL of the uploaded file
      });

      alert("SOP saved successfully!");
    } catch (error) {
      console.error("Error saving SOP:", error);
      alert("There was an error saving the SOP.");
    }
  };

  useEffect(() => {
    // Set sopName automatically based on h5 content
    const title = document.querySelector('h5');
    if (title) {
      setSopName(title.innerText);
    }
  }, []); // Runs only once when the component mounts

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
              <div className="content-page-header mb-20">
                {/* Dynamically display SOP Name */}
                <h5>{sopName}</h5>
              </div>

              {/* File upload input and Save SOP button in single line */}
              <div className="file-upload-save-btn">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={isFileUploaded} // Disable input after upload
                />
                
                <button
                  className="btn btn-primary mt-4"
                  onClick={handleSaveSop}
                >
                  Save SOP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreatObservation;

