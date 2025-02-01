import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { getPassResult } from "../../api/result";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPassResult();
        if (res.success) {
          setStats(res.result);
          console.log("res:", res); // Check the response structure
        } else {
          console.error("Failed to fetch statistics.");
          alert("Failed to fetch statistics.");
        }
      } catch (error) {
        console.error("Error fetching pass statistics:", error);
        alert("Failed to fetch statistics.");
      }
    };

    fetchStats();
  }, []);

  // Prepare the data for charts dynamically based on the fetched stats
  const attemptData = stats
    ? {
        labels: Object.values(stats.coursePassCounts || {}).map(
          (course) => course.courseName || "Unknown Course"
        ), // Use course names for labels
        datasets: [
          {
            label: "Attempt 1-Passed",
            data: Object.values(stats.coursePassCounts || {}).map(
              (course) => course["attempt-1Count"] || 0
            ),
            backgroundColor: "#4CAF50",
            borderWidth: 2,
            barThickness: 15,
          },
          {
            label: "Attempt 2-Passed",
            data: Object.values(stats.coursePassCounts || {}).map(
              (course) => course["attempt-2Count"] || 0
            ),
            backgroundColor: "#FFC107",
            borderWidth: 2,
            barThickness: 15,
          },
          {
            label: "Attempt 3-Passed",
            data: Object.values(stats.coursePassCounts || {}).map(
              (course) => course["attempt-3Count"] || 0
            ),
            backgroundColor: "#F44336",
            borderWidth: 2,
            barThickness: 15,
          },
        ],
      }
    : {};

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const courseData = stats
    ? {
        labels: Object.values(stats.coursePassCounts || {}).map(
          (course) => course.courseName || "Unknown Course"
        ),
        datasets: [
          {
            label: "Users per Course",
            data: Object.values(stats.coursePassCounts || {}).map(
              (course) => course.passCount || 0
            ),
            backgroundColor: Object.values(stats.coursePassCounts || {}).map(
              () => generateRandomColor()
            ),
          },
        ],
      }
    : {};

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />

        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
            <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon dash-bg">
                        <i className="fe fe-user fs-3"></i>
                      </span>
                      <div className="dash-count">
                        <h5>Total Users Attempt</h5>
                        <h3>{stats ? stats.totalAttemptCount : 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon dash-bg">
                        <i className="fe fe-user fs-3"></i>
                      </span>
                      <div className="dash-count">
                        <h5>Total Users Pass</h5>
                        <h3>{stats ? stats.totalPassCount : 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon dash-bg">
                        <i className="fe fe-check-circle"></i>
                      </span>
                      <div className="dash-count">
                        <h5>1st Attempt Pass</h5>
                        <h3>{stats?.attemptPassCounts?.["1"] || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon dash-bg">
                        <i className="fe fe-repeat"></i>
                      </span>
                      <div className="dash-count">
                        <h5>2nd Attempt Pass</h5>
                        <h3>{stats?.attemptPassCounts?.["2"] || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="dash-widget-icon dash-bg">
                        <i className="fe fe-thumbs-up"></i>
                      </span>
                      <div className="dash-count">
                        <h5>3rd Attempt Pass</h5>
                        <h3>{stats?.attemptPassCounts?.["3"] || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Attempt Analysis</h5>
                  </div>
                  <div className="card-body">
                    {attemptData.datasets && attemptData.datasets.length > 0 ? (
                      <Bar data={attemptData} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-xl-4 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Course-wise Statistics</h5>
                  </div>
                  <div className="card-body">
                    {courseData.datasets && courseData.datasets.length > 0 ? (
                      <Pie data={courseData} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* table */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5
                      className="card-title fw-bold"
                      style={{ color: "blue" }}
                    >
                      Detailed Course-wise Data
                    </h5>
                  </div>
                  <div className="card-body">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="bg-secondary text-white">
                            Course Name
                          </th>
                          <th className="bg-secondary text-white">
                            1st Attempt Pass
                          </th>
                          <th className="bg-secondary text-white">
                            2nd Attempt Pass
                          </th>
                          <th className="bg-secondary text-white">
                            3rd Attempt Pass
                          </th>
                          <th className="bg-secondary text-white">
                            Total Users
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats && stats.coursePassCounts ? (
                          Object.keys(stats.coursePassCounts).map(
                            (courseId) => (
                              <tr key={courseId}>
                                <td>
                                  {stats.coursePassCounts[courseId]
                                    ?.courseName || "Unknown Course"}
                                </td>{" "}
                                {/* Show course name */}
                                <td>
                                  {stats.coursePassCounts[courseId]?.[
                                    "attempt-1Count"
                                  ] || 0}
                                </td>
                                <td>
                                  {stats.coursePassCounts[courseId]?.[
                                    "attempt-2Count"
                                  ] || 0}
                                </td>
                                <td>
                                  {stats.coursePassCounts[courseId]?.[
                                    "attempt-3Count"
                                  ] || 0}
                                </td>
                                <td>
                                  {stats.coursePassCounts[courseId]
                                    ?.passCount || 0}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="5">Loading...</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>    
    </>
  );
}

export default Dashboard;
