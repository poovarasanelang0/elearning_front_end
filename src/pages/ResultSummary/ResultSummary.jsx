import { useState, useEffect } from "react";
import { getAllResults } from "../../api/result";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const ResultSummary = () => {
  const [results, setResults] = useState([]); // Store all results
  const [highPerformers, setHighPerformers] = useState([]); // Users with percentage >= 80
  const [lowPerformers, setLowPerformers] = useState([]); // Users with percentage < 80
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await getAllResults();
      console.log("API Response:", response);

      const allResults = response?.data?.result || [];
      if (allResults.length > 0) {
        setResults(allResults);

        const highPerformers = allResults.filter(
          (result) => Number(result.percentage) >= 80
        );
        const lowPerformers = allResults.filter(
          (result) => Number(result.percentage) < 80
        );

        setHighPerformers(highPerformers);
        setLowPerformers(lowPerformers);
      } else {
        setResults([]);
        setHighPerformers([]);
        setLowPerformers([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch results.");
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="main-wrapper">
      <Header />
      <SideBar />
      <div className="content-body">
        <div className="content container-fluid">
          <div className="row">
            <div className="content-page-header mb-20">
              <h5 className="fw-bold">Summary Report</h5>
            </div>
            {loading ? (
              <div>Loading results...</div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <>
                {highPerformers.length > 0 ? (
                  <div className="mb-4">
                    <h6 className="fw-bold">High Performers</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email Id</th>

                            <th>Course Name</th>
                            <th>NRIC NO</th>

                            <th>Percentage</th>
                            <th>Attempts</th>
                            <th>Date</th>
                            <th>Test Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {highPerformers.map((result, index) => (
                            <tr key={result._id}>
                              <td>{index + 1}</td>
                              <td>{result.userData?.name || "N/A"}</td>
                              <td>{result.userData?.email || "N/A"}</td>
                              <td>{result.courseData?.courseName || "N/A"}</td>
                              <td>{result.userData.nricnumber || "N/A"}</td>
                              <td>{result.percentage}%</td>
                              {/* <td className="badge text-bg-success d-flex align-items-center"></td> */}
                              <td>{result.attemptNumber}</td>
                              <td>{result.createdOn}</td>
                              <td className="badge text-bg-success  ">
                                {result.testStatus}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>No high-performing users found.</div>
                )}

                {lowPerformers.length > 0 ? (
                  <div>
                    <h6 className="fw-bold">Low Performers</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email Id</th>
                            <th>NRIC NO</th>

                            <th>Course Name</th>
                            <th>Percentage</th>
                            <th>Test Status</th>
                            <th>Attempts</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowPerformers.map((result, index) => (
                            <tr key={result._id}>
                              <td>{index + 1}</td>
                              <td>{result.userData.name || "N/A"}</td>
                              <td>{result.userData.email || "N/A"}</td>
                              <td>{result.userData.nricnumber || "N/A"}</td>

                              <td>{result.courseData.courseName || "N/A"}</td>
                              <td>{result.percentage}%</td>
                              <td>{result.testStatus}</td>
                              <td>{result.attemptNumber}</td>
                              <td>
                                <Link
                                  to={`/result-details?id=${result._id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div>No low-performing users found.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
