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

  const isCourseCompleted = (courseId) => {
    const result = userResults[courseId];
    return result && result.testStatus === "complete" && parseInt(result.percentage, 10) >= 80;
  };

  return (
    <>
      <Header />
      <div className="container mt-5 pt-1">
        <div className="row mt-5 g-3">
          <h2 className="text-center mb-4 mt-3">Available Courses</h2>

          {Array.isArray(job) && job.length > 0 ? (
            job.map((data, index) => (
              <div className="col-md-12 col-lg-4" key={index}>
                <div className="card shadow-lg rounded border-0 overflow-hidden">
                  <div className="card-body p-3">
                    <h5 className="card-title text-truncate" style={{ maxWidth: "80%" }}>
                      {data.courseName || "Unnamed Course"}
                    </h5>
                    <img
                      src={data.courseImageUrl || "default-image.jpg"} // Replace with a default image if none exists
                      alt={data.courseName || "Course Image"}
                      className="img-fluid rounded my-3"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    {isCourseCompleted(data?._id) ? (
                      <span className="btn btn-outline-success btn-sm disabled">
                        You have completed the course.
                      </span>
                    ) : (
                      <Link
                        className="btn btn-outline-primary btn-sm"
                        to={{
                          pathname: "/CourseDetailsUser",
                          search: `?id=${data?._id}`,
                        }}
                      >
                        I need details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center mt-4">No courses available at the moment.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default CourseList;
