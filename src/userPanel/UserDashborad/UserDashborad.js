import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../Component/Header/Header';
import { getResultUser } from '../../api/result'; 
import { getuserId } from '../../utils/Storage'; 

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [courseData, setCourseData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Test Completion (%)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [results, setResults] = useState([]);
  const userId = getuserId(); // Assuming user ID is fetched correctly

  useEffect(() => {
    if (userId) {
      fetchUserResults(userId);
    } else {
      console.error('User ID is missing.');
    }
  }, [userId]);

  // Fetch user results and course data
  const fetchUserResults = async (userId) => {
    try {
      const res = await getResultUser(userId);
      const resultData = res?.result || [];

      // Log the fetched data to see its structure
      console.log(resultData);
      
      // Make sure resultData is an array of objects
      if (Array.isArray(resultData)) {
        // Transform resultData into chart format
        const labels = resultData.map((item) => item.courseData.courseName || 'Unknown Course'); // Use courseName safely
        const percentages = resultData.map((item) => parseFloat(item.percentage) || 0); // Ensure percentage is valid
        const additionalData = resultData.map((item) => ({
          courseName: item.courseData.courseName || 'Unknown Course',
          percentage: item.percentage,
          testStatus: item.testStatus,
          date: item.createdOn ? new Date(item.createdOn).toLocaleDateString() : 'Unknown Date', // Format date with fallback
        }));

        setResults(additionalData);

        setCourseData({
          labels,
          datasets: [
            {
              label: 'Test Completion (%)',
              data: percentages,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error('Result data is not in expected array format');
      }
    } catch (err) {
      console.error('Error fetching user results:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="row mt-5">
          <div className="col-md-12 mt-5">
            <h2 className="text-center">Course-wise Test Completion</h2>
            {/* Displaying the bar chart */}
            <Bar data={courseData} options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100, // Set max value for Y-axis to 100 for percentage
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Test Completion Percentage',
                },
              },
            }} />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <h3>Test Completion Details</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Completion Percentage</th>
                  <th>Test Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((item, index) => (
                    <tr key={index}>
                      <td>{item.courseName}</td>
                      <td>{item.percentage}%</td>
                      <td>{item.testStatus}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No results available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
