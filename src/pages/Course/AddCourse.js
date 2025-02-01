import { useState } from 'react';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { saveCourse } from '../../api/course';
import { toast } from 'react-toastify';
import { uploadFile } from '../../utils/FileUpload'; // Ensure this uploads to AWS and returns a URL

function AddCourse() {
  const initialStateInputs = {
    courseName: "",
    mainVideo: null,
    learningVideo: null,
    courseImage: null,
  };

  const initialStateErrors = {
    courseName: { required: false },
    mainVideo: { required: false },
    courseImage: { required: false },
  };

  const [errors, setErrors] = useState(initialStateErrors);
  const [inputs, setInputs] = useState(initialStateInputs);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleInputs = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));

    if (submitted) {
      const newError = handleValidation({ ...inputs, [name]: value });
      setErrors(newError);
    }
  };

  const handleValidation = (data) => {
    const error = { ...initialStateErrors };

    if (data.courseName.trim() === "") {
      error.courseName.required = true;
    }

    if (!data.mainVideo) {
      error.mainVideo.required = true;
    }

    if (!data.courseImage) {
      error.courseImage.required = true;
    }

    return error;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = handleValidation(inputs);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) =>
      Object.values(error).includes(true)
    );

    if (!hasErrors) {
      try {
        let primaryVideoUrl = "";
        let learningVideoUrl = "";
        let courseImageUrl = "";

        // Upload primary video
        if (inputs.mainVideo) {
          const uploadResponse = await uploadFile(inputs.mainVideo);
          if (uploadResponse) {
            primaryVideoUrl = uploadResponse;
          } else {
            throw new Error("Main video upload failed.");
          }
        }

        // Upload learning video if provided
        if (inputs.learningVideo) {
          const uploadResponse = await uploadFile(inputs.learningVideo);
          if (uploadResponse) {
            learningVideoUrl = uploadResponse;
          }
        }

        // Upload course image
        if (inputs.courseImage) {
          const uploadResponse = await uploadFile(inputs.courseImage);
          if (uploadResponse) {
            courseImageUrl = uploadResponse;
          } else {
            throw new Error("Course image upload failed.");
          }
        }

        const courseData = {
          courseName: inputs.courseName,
          mainVideo: primaryVideoUrl,
          courseImageUrl: courseImageUrl,
          learningVideo: learningVideoUrl,
        };

        // Make the API call to save the course
        const res = await saveCourse(courseData);

        if (res.status === 200) {
          toast.success(`Course "${res.data.courseName}" added successfully!`);
          navigate("/CourseList");
        } else {
          throw new Error(res.message || "Failed to save course.");
        }
      } catch (err) {
        console.error("Save course error:", err);
        toast.error(
          err?.response?.data?.message ||
            "Failed to save course. Please try again."
        );
      }
    }
  };

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
              <div className="content-page-header mb-20">
                <h5>Add Course</h5>
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
                                  <label>
                                    Course Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleInputs}
                                    name="courseName"
                                    placeholder="Course Name"
                                    value={inputs.courseName}
                                  />
                                  {errors.courseName.required && (
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>
                                    Primary Video
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      setInputs((prevInputs) => ({
                                        ...prevInputs,
                                        mainVideo: file,
                                      }));
                                    }}
                                    name="mainVideo"
                                    accept="video/*"
                                  />
                                  {errors.mainVideo.required && (
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Learning Video</label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      setInputs((prevInputs) => ({
                                        ...prevInputs,
                                        learningVideo: file,
                                      }));
                                    }}
                                    name="learningVideo"
                                    accept="video/*"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>
                                    Course Image
                                    <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      setInputs((prevInputs) => ({
                                        ...prevInputs,
                                        courseImage: file,
                                      }));
                                    }}
                                    name="courseImage"
                                    accept="image/*"
                                  />
                                  {errors.courseImage.required && (
                                    <span className="text-danger form-text">
                                      This field is required.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="add-customer-btns text-end">
                            <Link to="/CourseList" className="btn btn-cancel">
                              Cancel
                            </Link>
                            <button type="submit" className="btn btn-save">
                              Submit
                            </button>
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

export default AddCourse;
