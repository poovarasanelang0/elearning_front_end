import React, { useState, useEffect } from "react";
import { FaVideo, FaPlayCircle, FaCheckCircle } from "react-icons/fa";
import Header from "../Header/Header";
import { getFilterCourse, getSingleCourse } from "../../../api/course";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CourseDetailsUser = () => {
  const [isLearningModalOpen, setLearningModalOpen] = useState(false);
  const [isTestModalOpen, setTestModalOpen] = useState(false);
  const [learningVideoWatched, setLearningVideoWatched] = useState(false);
  const [testVideoWatched, setTestVideoWatched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [course, setCourse] = useState(null);
  const [job, setJob] = useState([]);

  const courseId = new URLSearchParams(window.location.search).get("id");

  // Check if both videos have been watched to enable assessment
  const isAssessmentEnabled = learningVideoWatched && testVideoWatched;

  const handleVideoEnd = (type) => {
    if (type === "learning") setLearningVideoWatched(true); // Mark learning video as watched
    if (type === "test") setTestVideoWatched(true); // Mark test video as watched
    setErrorMessage(""); // Reset error message
  };

  const handleStartAssessment = () => {
    if (!isAssessmentEnabled) {
      setErrorMessage("You must watch both videos to start the assessment.");
    }
  };

  useEffect(() => {
    getAllJobList();
  }, []);

  useEffect(() => {
    if (courseId) {
      getSingleCourse(courseId)
        .then((res) => {
          setCourse(res?.data?.result);
        })
        .catch((err) => {
          toast.error("Error fetching course details.");
        });
    }
  }, [courseId]);

  const getAllJobList = () => {
    const data = { limit: 10 };
    getFilterCourse(data)
      .then((res) => {
        const userList = res?.data?.result?.userList || [];
        setJob(userList);
        console.log(userList, ":list couuu");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Header />
      <div className="container py-4 mt-5">
        {/* Course Details Section */}
        <div className="row mt-5">
          <div className="col-lg-6">
            {course ? (
              <div className="card flex-fill">
                <img
                  src={course.courseImageUrl || "default-image.jpg"}
                  alt={course.courseName || "Course Image"}
                  className="img-fluid card-img-top rounded my-3"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{course.courseName}</h5>
                  <p className="text-muted">
                    <strong>User Progress:</strong> 75%
                  </p>
                </div>
              </div>
            ) : (
              <p>Loading course details...</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-3">
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setLearningModalOpen(true)}
                data-bs-toggle="modal"
                data-bs-target="#learningModal"
                disabled={learningVideoWatched}
              >
                <FaVideo /> Learning Details
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setTestModalOpen(true)}
                data-bs-toggle="modal"
                data-bs-target="#testModal"
                disabled={testVideoWatched}
              >
                <FaPlayCircle /> Test Video
              </button>

              <button
                className={`btn d-flex align-items-center gap-2 ${
                  isAssessmentEnabled ? "btn-success" : "btn-secondary disabled"
                }`}
                onClick={handleStartAssessment}
                disabled={!isAssessmentEnabled}
              >
                <Link
                  className="text-decoration-none text-white"
                  to={{
                    pathname: "/ListQuestions",
                    search: `?id=${course?._id}`,
                  }}
                >
                  <FaCheckCircle /> Start Assessment
                </Link>
              </button>

              {errorMessage && (
                <div className="text-danger mt-2">{errorMessage}</div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Modal */}
        <div
          className="modal fade"
          id="learningModal"
          tabIndex="-1"
          aria-labelledby="learningModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="learningModalLabel">
                  Learning Video
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {course && course.learningVideo && (
                  <video
                    className="w-100"
                    controls
                    onEnded={() => handleVideoEnd("learning")}
                  >
                    <source src={course.learningVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                  disabled={!learningVideoWatched}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Modal */}
        <div
          className="modal fade"
          id="testModal"
          tabIndex="-1"
          aria-labelledby="testModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="testModalLabel">
                  Test Video
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {course && course.mainVideo && (
                  <video
                    className="w-100"
                    controls
                    onEnded={() => handleVideoEnd("test")}
                  >
                    <source src={course.mainVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-dismiss="modal"
                  disabled={!testVideoWatched}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsUser;
