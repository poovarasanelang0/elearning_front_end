



// import { useState } from 'react';
// import Header from '../../components/Header';
// import SideBar from '../../components/SideBar';
// import { getUserId, getproductId } from '../../utils/Storage';
// import { Link, useNavigate } from 'react-router-dom';
// import { saveUser } from '../../api/user';
// import { toast } from 'react-toastify';

// function AddJob() {
//   let initialStateInputs = {
//     name: "",
//     email: "",
//     mobileNo: "",
//     password: "",
//     designation: "",
//   };

//   let initialStateErrors = {
//     name: { required: false },
//     email: { required: false },
//     mobileNo: { required: false },
//     password: { required: false },
//     designation: { required: false },
//   };

//   const [errors, setErrors] = useState(initialStateErrors);
//   const [inputs, setInputs] = useState(initialStateInputs);
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useNavigate();

//   const handleInputs = (event) => {
//     setInputs({ ...inputs, [event.target.name]: event.target.value });
//     if (submitted) {
//       const newError = handleValidation({ ...inputs, [event.target.name]: event.target.value });
//       setErrors(newError);
//     }
//   };

//   const handleValidation = (data) => {
//     let error = initialStateErrors;

//     if (data.name === "") {
//       error.name.required = true;
//     }
//     if (data.email === "") {
//       error.email.required = true;
//     }
//     if (data.mobileNo === "") {
//       error.mobileNo.required = true;
//     }
//     if (data.password === "") {
//       error.password.required = true;
//     }
//     if (data.designation === "") {
//       error.designation.required = true;
//     }

//     return error;
//   };

//   const handleErrors = (obj) => {
//     for (const key in obj) {
//       if (obj.hasOwnProperty(key)) {
//         const prop = obj[key];
//         if (prop.required === true) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const newError = handleValidation(inputs);
//     setErrors(newError);
//     setSubmitted(true);
//     if (handleErrors(newError)) {
//       saveUser(inputs)
//         .then((res) => {
//           toast.success(res?.data?.message);
//           navigate("/UserList");
//         })
//         .catch((err) => {
//           toast.error(err?.response?.data?.message);
//         });
//     }
//   };

//   return (
//     <>
//       <div id="main-wrapper">
//         <Header />
//         <SideBar />
//         <div className="content-body">
//           <div className="content container-fluid">
//             <div className="row">
//               <div className="content-page-header mb-20">
//                 <h5>Add User</h5>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-xl-12">
//                 <div className="card mt-2">
//                   <div className="card-body">
//                     <div className="col-md-12">
//                       <form onSubmit={handleSubmit}>
//                         <div className="card-body">
//                           <div className="form-group-item">
//                             <div className="row">
//                               <div className="col-lg-4 col-md-6 col-sm-12">
//                                 <div className="form-group">
//                                   <label>Name<span className="text-danger">*</span></label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     onChange={handleInputs}
//                                     name="name"
//                                     placeholder="name"
//                                   />
//                                   {errors.name.required ? (
//                                     <span className="text-danger form-text">
//                                       This field is required.
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-md-6 col-sm-12">
//                                 <div className="form-group">
//                                   <label>Phone Number<span className="text-danger">*</span></label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     onChange={handleInputs}
//                                     name="mobileNo"
//                                     placeholder="mobileNo"
//                                   />
//                                   {errors.mobileNo.required ? (
//                                     <span className="text-danger form-text">
//                                       This field is required.
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-md-6 col-sm-12">
//                                 <div className="form-group">
//                                   <label>Email<span className="text-danger">*</span></label>
//                                   <input
//                                     type="text"
//                                     className="form-control"
//                                     onChange={handleInputs}
//                                     name="email"
//                                     placeholder="email"
//                                   />
//                                   {errors.email.required ? (
//                                     <span className="text-danger form-text">
//                                       This field is required.
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-md-6 col-sm-12">
//                                 <div className="form-group">
//                                   <label>Designation<span className="text-danger">*</span></label>
//                                   <select
//                                     className="form-control"
//                                     onChange={handleInputs}
//                                     name="designation"
//                                     value={inputs.designation}
//                                   >
//                                     <option value="">Select Designation</option>
//                                     <option value="Manager">Manager</option>
//                                     <option value="Developer">Developer</option>
//                                     <option value="Designer">Designer</option>
//                                     <option value="Tester">Tester</option>
//                                   </select>
//                                   {errors.designation.required ? (
//                                     <span className="text-danger form-text">
//                                       This field is required.
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>
//                               <div className="col-lg-4 col-md-6 col-sm-12">
//                                 <div className="form-group">
//                                   <label>Password<span className="text-danger">*</span></label>
//                                   <input
//                                     type="text"
//                                     name="password"
//                                     onChange={handleInputs}
//                                     className="form-control"
//                                     placeholder="Password"
//                                   />
//                                   {errors.password.required ? (
//                                     <span className="text-danger form-text">
//                                       This field is required.
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="add-customer-btns text-end">
//                             <Link to="/UserList" className="btn btn-cancel">Cancel</Link>
//                             <button type="submit" className="btn btn-save">Submit</button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AddJob;









import { useState } from "react";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { Link, useNavigate } from "react-router-dom";
import { saveUser } from "../../api/user";
import { toast } from "react-toastify";

function AddJob() {
  let initialStateInputs = {
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    designation: "",
    nricnumber:""
  };

  let initialStateErrors = {
    name: { required: false },
    email: { required: false },
    mobileNo: { required: false },
    password: { required: false },
    designation: { required: false },
    nricnumber:{ required: false },
  };

  const [errors, setErrors] = useState(initialStateErrors);
  const [inputs, setInputs] = useState(initialStateInputs);
  const [submitted, setSubmitted] = useState(false);
  const [designations, setDesignations] = useState([
    "Software Engineer",
    "Project Manager",
    "Product Owner",
  ]);
  const [newDesignation, setNewDesignation] = useState("");
  const navigate = useNavigate();

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (submitted) {
      const newError = handleValidation({ ...inputs, [event.target.name]: event.target.value });
      setErrors(newError);
    }
  };

  const handleValidation = (data) => {
    let error = initialStateErrors;

    if (data.name === "") {
      error.name.required = true;
    }
    if (data.email === "") {
      error.email.required = true;
    }
    if (data.mobileNo === "") {
      error.mobileNo.required = true;
    }
    if (data.password === "") {
      error.password.required = true;
    }
    if (data.designation === "") {
      error.designation.required = true;
    }
    if (data.nricnumber === "") {
      error.nricnumber.required = true;
    }

    return error;
  };

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newError = handleValidation(inputs);
    setErrors(newError);
    setSubmitted(true);
    if (handleErrors(newError)) {
      saveUser(inputs)
        .then((res) => {
          console.log("res:",res);
          toast.success(res?.data?.message);
          navigate("/UserList");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    }
  };

  const handleAddDesignation = () => {
    if (newDesignation.trim()) {
      setDesignations([...designations, newDesignation]);
      setNewDesignation("");
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
                <h5>Add User</h5>
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
                                  <label>Name<span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleInputs}
                                    name="name"
                                    placeholder="name"
                                  />
                                  {errors.name.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Phone Number<span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleInputs}
                                    name="mobileNo"
                                    placeholder="mobileNo"
                                  />
                                  {errors.mobileNo.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Nric Number<span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleInputs}
                                    name="nricnumber"
                                    placeholder="nricnumber"
                                  />
                                  {errors.nricnumber.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Email<span className="text-danger">*</span></label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    onChange={handleInputs}
                                    name="email"
                                    placeholder="email"
                                  />
                                  {errors.email.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Password<span className="text-danger">*</span></label>
                                  <input
                                    type="password"
                                    name="password"
                                    onChange={handleInputs}
                                    className="form-control"
                                    placeholder="Password"
                                  />
                                  {errors.password.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Designation<span className="text-danger">*</span></label>
                                  <select
                                    className="form-control"
                                    name="designation"
                                    onChange={handleInputs}
                                  >
                                    <option value="">Select Designation</option>
                                    {designations.map((designation, index) => (
                                      <option key={index} value={designation}>
                                        {designation}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.designation.required && (
                                    <span className="text-danger form-text">This field is required.</span>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6 col-sm-12">
                                <div className="form-group">
                                  <label>Add New Designation</label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={newDesignation}
                                      onChange={(e) => setNewDesignation(e.target.value)}
                                      placeholder="Enter new designation"
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-primary ms-2"
                                      onClick={handleAddDesignation}
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="add-customer-btns text-end">
                            <Link to="/UserList" className="btn btn-cancel">
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
export default AddJob;
