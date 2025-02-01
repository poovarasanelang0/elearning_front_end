import React, { useState } from "react";
import Header from "../Header/Header";

const Assement = () => {
  const [videoCompleted, setVideoCompleted] = useState(false);

  const handleVideoEnd = () => {
    setVideoCompleted(true); // Enable the button when the video ends
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="row mt-5">
          <div className="col-md-12 mt-5 text-center">
            <h2 className="mb-4">Course Assessment</h2>
            {/* Video Section */}
            <div className="mb-4">
              <video
                width="600"
                controls
                onEnded={handleVideoEnd} // Event triggers when video ends
              >
                <source src="your-video-url.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            {/* Button Section */}
            <button
              className="btn btn-primary"
              disabled={!videoCompleted} // Disable button until video ends
              onClick={() => alert("Test Started!")}
            >
              Start Test
            </button>
            {/* dumy buuton for ui only  */}
            <br /> <br />
            <a href="/ListQuestions" >
            <button
              className="btn btn-primary"
            >
              Start Test
            </button>
            </a>
          
          </div>
        </div>
      </div>
    </>
  );
};

export default Assement;
