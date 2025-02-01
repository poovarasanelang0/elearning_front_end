import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { getSingleQuestion, updateQuestion } from '../../api/question';
import { getFilterCourse } from '../../api/course';
import { toast } from 'react-toastify';

function AddJob() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");

  const initialStateInputs = {
    courseName: "",
    video: "",
    courseId: "",
    question: "",
    answer: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  };

  const initialStateErrors = {
    courseName: false,
    video: false,
    courseId: false,
    question: false,
    answer: false,
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  };

  const [inputs, setInputs] = useState(initialStateInputs);
  const [errors, setErrors] = useState(initialStateErrors);
  const [jobList, setJobList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchAllJobs();
  }, []);

  const fetchJobDetails = async () => {
    try {

      const res = await getSingleQuestion(id);
      console.log("ui")
      setInputs(res?.data?.result || initialStateInputs);
    } catch (err) {
      console.error("Error fetching question details:", err);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const res = await getFilterCourse({ limit: 10 });
      setJobList(res?.data?.result?.userList || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleInputs = (event) => {
    const { name, value } = event.target;

    setInputs((prevInputs) => {
      const updatedInputs = { ...prevInputs, [name]: value };

      if (name === "courseName") {
        const selectedCourse = jobList.find((course) => course.courseName === value);
        if (selectedCourse) {
          updatedInputs.courseId = selectedCourse._id;
          updatedInputs.video = selectedCourse.video;
        }
      }

      return updatedInputs;
    });

    if (submitted) {
      validateField(name, value);
    }
  };

  const validateField = (fieldName, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: !value.trim(),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      courseName: !inputs.courseName.trim(),
      video: !inputs.video.trim(),
      courseId: !inputs.courseId.trim(),
      question: !inputs.question.trim(),
      answer: !inputs.answer.trim(),
      option1: !inputs.option1.trim(),
      option2: !inputs.option2.trim(),
      option3: !inputs.option3.trim(),
      option4: !inputs.option4.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    // if (validateForm()) {
      try {
        const res = await updateQuestion(inputs);
        toast.success(res?.data?.message);
        navigate("/QustionList");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Error updating question");
      }
    // } else {
    //   toast.error("Please fill all required fields.");
    // }
  };

  return (
    <div id="main-wrapper">
      <Header />
      <SideBar />
      <div className="content-body">
        <div className="content container-fluid">
          <div className="row">
            <div className="content-page-header mb-20">
              <h5>Edit Questions</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-12">
              <div className="card mt-2">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group-item">
                      <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Course<span className="text-danger">*</span></label>
                            <select
                              className="form-control"
                              name="courseName"
                              value={inputs.courseName}
                              onChange={handleInputs}
                            >
                              <option value="">{inputs.courseName}</option>
                              {jobList.map((item) => (
                                <option key={item._id} value={item.courseName}>{item.courseName}</option>
                              ))}
                            </select>
                            {errors.courseName && (
                              <span className="text-danger form-text">This field is required.</span>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Questions<span className="text-danger">*</span></label>
                            <textarea
                              className="form-control"
                              name="question"
                              value={inputs.question}
                              onChange={handleInputs}
                              rows="4"
                              placeholder="Enter question"
                            ></textarea>
                            {errors.question && (
                              <span className="text-danger form-text">This field is required.</span>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Answer<span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className="form-control"
                              name="answer"
                              value={inputs.answer}
                              onChange={handleInputs}
                              placeholder="Enter answer"
                            />
                            {errors.answer && (
                              <span className="text-danger form-text">This field is required.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        {["option1", "option2", "option3", "option4"].map((option, index) => (
                          <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>{`Option ${index + 1}`}<span className="text-danger">*</span></label>
                              <input
                                type="text"
                                className="form-control"
                                name={option}
                                value={inputs[option]}
                                onChange={handleInputs}
                                placeholder={`Enter option ${index + 1}`}
                              />
                              {errors[option] && (
                                <span className="text-danger form-text">This field is required.</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="add-customer-btns text-end">
                        <button type="button" className="btn btn-cancel" onClick={() => navigate("/QustionList")}>Cancel</button>
                        <button type="submit" className="btn btn-save">Submit</button>
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
  );
}

export default AddJob;