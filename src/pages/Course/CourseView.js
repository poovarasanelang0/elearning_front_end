
import { useLocation } from 'react-router';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { useState } from 'react';
import { useEffect } from 'react';
import { getSingleJob } from '../../api/groupjob';
import { Link } from 'react-router-dom';
import { localDate } from '../../utils/dateformat';

function ViewJob() {

  const location = useLocation()
  const id = new URLSearchParams(location.search).get('id')
  const [job, setJob] = useState({});
  useEffect(() => {
    getJobDetails()
  }, [])

  const getJobDetails = () => {
    getSingleJob(id).then(res => {
      setJob(res?.data?.result)
    }).catch(err => { console.log(err); })
  }


  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div class="content-body">
          <div class="content container-fluid">
            <div class="row">
              <div class="content-page-header page-header mb-20">
                <div class="col">
                  <h5>Course Details</h5>
                  <ul class="breadcrumb">
                    <li class="breadcrumb-item"><Link to="/PixaliveGroupJobList">Course List</Link></li>
                    <li class="breadcrumb-item active">Course Details</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <div class="student-personals-grp">
                      <div class="card">
                        <div class="card-body">
                          <div class="heading-detail">
                            <h4>Course Details :</h4>
                          </div>
                          <div class="personal-activity">
                            <div class="views-personal">
                              <h4>Course Name</h4>
                              <h5>{job?.courseName}</h5>
                              
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
}
export default ViewJob;