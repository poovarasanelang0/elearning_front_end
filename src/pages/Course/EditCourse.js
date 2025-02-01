
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; 
import SideBar from '../../components/SideBar'; 
import { getSingleJob, updateJob } from '../../api/groupjob';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';


function EditJob () { 
  
  let initialStateErrors = {
    course: { required: false },
    experience: { required: false },
    qualification: { required: false },
    skills: { required: false },
    noOfPositions: { required: false },
    location: { required: false },
    numberOfResource: { required: false },
  };

  const [errors, setErrors] = useState(initialStateErrors);
  const [inputs, setInputs] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const id = new URLSearchParams(location.search).get('id')

  useEffect(() => {
    getJobDetails()
  }, [])

  const getJobDetails = () => {
    getSingleJob(id).then(res => {
      setInputs(res?.data?.result)
    }).catch(err => { console.log(err); })
  }

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (submitted) {
      const newError = handleValidation({ ...inputs, [event.target.name]: event.target.value })
      setErrors(newError)
    }
  };


  const handleValidation = (data) => {
    let error = initialStateErrors;
    if (data.course === "") {
      error.course.required = true;
    }
    if (data.experience === "") {
      error.experience.required = true;
    }
    if (data.qualification === "") {
      error.qualification.required = true;
    }
    if (data.skills === "") {
      error.skills.required = true;
    }
  
    if (data.location === "") {
      error.location.required = true;
    }
    if (data.noOfPositions === "") {
      error.noOfPositions.required = true;
    }
    return error
  }

  const handleErrors = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const prop = obj[key];
        if (prop.required === true) {
          return false;
        }
      }
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newError = handleValidation(inputs)
    setErrors(newError)
    setSubmitted(true)
    if (handleErrors(newError)) {
      updateJob(inputs)
        .then((res) => {
          toast.success(res?.data?.message);
          navigate("/PixaliveGroupJobList")
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    }
  }

	return( 
	<>
    <div id="main-wrapper">
    <Header />
    <SideBar />
      <div class="content-body">
        <div class="content container-fluid">
          <div class="row">
              <div class="content-page-header page-header mb-20">
                <div class="col">
                  <h5>Edit Job</h5>
                  <ul class="breadcrumb">
                    <li class="breadcrumb-item"><Link to="/PixaliveGroupJobList">Job List</Link></li>
                    <li class="breadcrumb-item active">Edit Job</li>
                  </ul>
                </div>              
              </div>
            </div>
          
            <div className="row">
              <div className="col-xl-12">
                <div className="card mt-2">
                  <div className="card-body">

                    <div className="col-md-12">
                      <form onSubmit={handleSubmit}>
                        <div className="card-body">
                          <div className="form-group-item">
                            <div className="row">

                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Course Name<span className="text-danger">*</span></label>
                                  <input type="text" className="form-control" value={inputs?.course} onChange={handleInputs} name='course' placeholder="course" />
                                  {errors.course.required ?
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span> : null
                                  }
                                </div>
                              </div>
                             
                             
                             
                            
                            </div>
                          </div>
                          <div className="add-customer-btns text-end">
                            <Link to="/PixaliveGroupJobList" className="btn btn-cancel">Cancel</Link>
                            <button type='submit' className="btn btn-save">Update</button>
                          </div>
                        </div>
                      </form>
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
  export default EditJob;