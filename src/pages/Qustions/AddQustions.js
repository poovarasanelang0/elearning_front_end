
import { useState } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { getUserId, getproductId } from '../../utils/Storage';
import { Link, useNavigate } from 'react-router-dom';
import { saveQuestion } from '../../api/question';
import { getFilterCourse } from '../../api/course';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function AddJob() {
  let initialStateInputs = {
    courseName: "",
    video: "",
    courseId: "",
    question: "",
    answer: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    
  }

  let initialStateErrors = {
    courseName: { required: false },
    video: { required: false },
    courseId: { required: false },
    question: { required: false },
    answer: { required: false },
    option1: { required: false },
    option2: { required: false },
    option3: { required: false },
    option4: { required: false },
  
  };

  const [errors, setErrors] = useState(initialStateErrors);
  const [inputs, setInputs] = useState(initialStateInputs);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate()


  const handleInputs = (event) => {
    const { name, value } = event.target;

    setInputs((prevProgram) => {
      const updatedProgram = { ...prevProgram, [name]: value };
      if (name === "courseName") {
        const selectedUniversity = job.find(
          (u) => u.courseName === value
        );
        if (selectedUniversity) {
   
  
          return {
            ...updatedProgram,
           courseId: selectedUniversity._id,
            video: selectedUniversity.mainVideo,
           
          };
        }
      }

      return updatedProgram;
    });

    if (submitted) {
      const newError = handleValidation({ ...inputs, [name]: value });
      setErrors(newError);
    }
  };
  const [job, setJob] = useState();

  useEffect(() => {
    getAllJobList();
  }, []);

  const getAllJobList = () => {
    const data = {
      limit: 10,
    }
    getFilterCourse(data)
      .then((res) => {
        setJob(res?.data?.result?.userList);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleValidation = (data) => {
    let error = initialStateErrors;
    if (data.courseName === "") {
      error.courseName.required = true;
    }
    if (data.question === "") {
      error.question.required = true;
    }
    if (data.answer === "") {
      error.answer.required = true;
    }
    if (data.option1 === "") {
      error.option1.required = true;
    }
    if (data.option2 === "") {
      error.option2.required = true;
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
    
      saveQuestion(inputs)
   
        .then((res) => {
         
          toast.success(res?.data?.message);
        
          navigate("/QustionList")
        })
        
        .catch((err) => {
          toast.error(err?.response?.data?.message);
       
        });
    }
  }


  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
              <div className="content-page-header mb-20">
                <h5>Add Qustions</h5>
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
                            <div className='row'> 
                            <div className="col-lg-4 col-md-6 col-sm-12">
  <div className="form-group">
    <label htmlFor="qualification">
      Course<span className="text-danger">*</span>
    </label>
    <select 
      className="form-control" 
      id="qualification" 
      name="courseName" 
      onChange={handleInputs}
    >
      <option value="">-- Select Course --</option>
      {job?.map((item, index) => (
        <option value={item?.courseName}>{item?.courseName}</option>
      ))}
    </select>
    {errors.qualification?.required && (
      <span className="text-danger form-text">
        This field is required.
      </span>
    )}
  </div>
  <div className="form-group visually-hidden">
    <label htmlFor="qualification">
      CourseId<span className="text-danger">*</span>
    </label>
    <select 
      className="form-control" 
      id="qualification" 
      name="courseId" 
      value={inputs.courseId}
      onChange={handleInputs}
    >
      <option value="">-- Select CourseId --</option>
      {job?.map((item, index) => (
        <option value={item?.courseId}>{item?.courseId}</option>
      ))}
    </select>
    {errors.courseId?.required && (
      <span className="text-danger form-text">
        This field is required.
      </span>
    )}
  </div>
  <div className="form-group visually-hidden">
    <label htmlFor="qualification">
      Video<span className="text-danger">*</span>
    </label>
    <select 
      className="form-control" 
      id="qualification" 
      name="video" 
      value={inputs.video}
      onChange={handleInputs}
    >
      <option value="">-- Select video--</option>
      {job?.map((item, index) => (
        <option value={item?.video}>{item?.video}</option>
      ))}
    </select>
    {errors.video?.required && (
      <span className="text-danger form-text">
        This field is required.
      </span>
    )}
  </div>
</div>

                             
                          <div className="col-lg-4 col-md-6 col-sm-12">
  <div className="form-group">
    <label htmlFor="experience">Qustions<span className="text-danger">*</span></label>
    <textarea 
      className="form-control" 
      id="experience" 
      name="question" 
      placeholder="Qustions" 
      onChange={handleInputs} 
      rows="4"
    ></textarea>
    {errors.question?.required && (
      <span className="text-danger form-text">
        This field is required.
      </span>
    )}
  </div>
</div>
<div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label> Answer<span className="text-danger">*</span></label>
                                  <input type="text" className="form-control" onChange={handleInputs} name='answer' placeholder="Experience" />
                                  {errors.answer.required ?
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span> : null
                                  }
                                </div>
                              </div>
</div>
                            <div className="row">

                              
                            <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label> Option 1<span className="text-danger">*</span></label>
                                  <input type="text" className="form-control" onChange={handleInputs} name='option1' placeholder="Enter the Option" />
                                  {errors.option1.required ?
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span> : null
                                  }
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label> Option 2<span className="text-danger">*</span></label>
                                  <input type="text" className="form-control" onChange={handleInputs} name='option2' placeholder="Experience" />
                                  {errors.option2.required ?
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span> : null
                                  }
                                </div>
                              </div>
                              
                              <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Option 3</label>
                                  <input type="text" name='option3' onChange={handleInputs} className="form-control" placeholder="Enter option3" />
                                 
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Option 4</label>
                                  <input type="text" onChange={handleInputs} name='option4' className="form-control" placeholder="Enter option4" />
                                
                                </div>
                              </div>
                              
                            </div>
                          </div>
                          <div className="add-customer-btns text-end">
                            <Link to="/QustionList" className="btn btn-cancel">Cancel</Link>
                            <button type='submit' className="btn btn-save">Submit</button>
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
export default AddJob;