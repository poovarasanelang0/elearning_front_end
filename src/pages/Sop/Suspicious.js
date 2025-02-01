




import React from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";

const Suspicious = () => {
  const pdfUrl = "/SOPonSuspicious.pdf";

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
              <div className="content-page-header mb-20">
                <h5>Suspicious</h5>
              </div>
            </div>
            <div className="row">
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
        </div>{" "}
      </div>
    </>
  );
};

export default Suspicious;

