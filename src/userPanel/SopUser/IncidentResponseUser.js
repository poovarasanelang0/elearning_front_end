



import React from "react";
import Header from "../Component/Header/Header";

const IncidentResponseUser = () => {
    const pdfUrl = "/IncidentResponse.pdf"; 
    return (
    <>
    <Header />
    <div className="container mt-5">
        <div className="row mt-5">
          <h4 className="mt-5 text-primary fw-bold">IncidentResponse</h4>
        </div>         <div className="row">
          <div className="col">
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Threat Observation PDF"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentResponseUser;
