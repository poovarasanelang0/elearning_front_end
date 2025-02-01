import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import { getSingleUser } from "../../api/user";
import { getCourseQuestion } from "../../api/result";
import { Link } from "react-router-dom";

function ViewJob() {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const [job, setJob] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    getJobDetails();
    getResultDetails();
  }, []);

  const getJobDetails = () => {
    getSingleUser(id)
      .then((res) => {
        setJob(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getResultDetails = () => {
    getCourseQuestion(id)
      .then((res) => {
        const filteredResult = res?.data?.result;
        if (filteredResult) {
          setResult(filteredResult);
        } else {
          setResult(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div id="main-wrapper" className="bg-light">
      <Header />
      <SideBar />
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center py-3">
                <h3 className="text-primary">User Details</h3>
                <Link to="/UserList" className="btn btn-outline-primary">
                  Back to User List
                </Link>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="text-secondary mb-4">Personal Information</h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <p className="mb-1 fw-bold">Name</p>
                  <p>{job?.name || "N/A"}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 fw-bold">Phone Number</p>
                  <p>{job?.mobileNo || "N/A"}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 fw-bold">Email</p>
                  <p>{job?.email || "N/A"}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 fw-bold">Designation</p>
                  <p>{job?.designation || "N/A"}</p>
                </div>
              </div>

              {result && (
                <>
                  <h4 className="text-secondary mt-5 mb-4">
                    Candidate Result Details
                  </h4>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="table">
                        <tr className="bg-primary">
                          <th className="bg-primary text-white">Attempt Number</th>
                          <th className="bg-primary text-white">Correct Answers</th>
                          <th className="bg-primary text-white">Total Questions</th>
                          <th className="bg-primary text-white">Course Name</th>
                          <th className="bg-primary text-white">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.map((item, index) => (
                          <tr key={index}>
                            <td>{item.attemptNumber || "N/A"}</td>
                            <td>{item.correctAnswers || "N/A"}</td>
                            <td>{item.totalQuestions || "N/A"}</td>
                            <td>{item?.courseData?.courseName || "N/A"}</td>
                            <td>{item.percentage || "N/A"}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewJob;
