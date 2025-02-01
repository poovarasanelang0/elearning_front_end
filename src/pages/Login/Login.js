import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isValidEmail, isValidPassword } from "../../utils/validation";
import { loginAdmin } from "../../api/login";
import { getuserId, saveToken, getLoginType } from "../../utils/Storage";
import { isAuthenticated } from "../../utils/Auth";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  let initialStateErrors = {
    email: { required: false, valid: false },
    password: { required: false, valid: false },
  };

  const [errors, setErrors] = useState(initialStateErrors);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleValidation = (data) => {
    let error = initialStateErrors;
    if (data.password === "") {
      error.password.required = true;
    }
    if (data.email === "") {
      error.email.required = true;
    }

    if (!isValidEmail(data.email)) {
      error.email.valid = true;
    }
    return error;
  };

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
    if (submitted) {
      const newError = handleValidation({
        ...inputs,
        [event.target.name]: event.target.value,
      });
      setErrors(newError);
    }
  };

  const handleErrors = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const prop = obj[key];
        if (prop.required === true || prop.valid === true) {
          return false;
        }
      }
    }
    return true;
  };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const newError = handleValidation(inputs);
  //   setErrors(newError);
  //   setSubmitted(true);
  //   if (handleErrors(newError)) {
  //     loginAdmin(inputs).then(res => {
  //           let token = res?.data?.result?.token;
  //           let loginType = res?.data?.result?.loginType;
  //           if (loginType === 'master') {
  //               let masterId = res?.data?.result?.masterDetails?._id;
  //               let data = {
  //                   token: token, masterId: masterId, loginType: loginType
  //               };
  //               saveToken(data);
  //               if (isAuthenticated()) {
  //                   navigate("/Dashboard");
  //                   window.location.reload(); // Refresh the page
  //               }
  //           }
  //           if (loginType === 'user') {
  //               let userId = res?.data?.result?.UserDetails?._id;
  //               let data = {
  //                   token: token, userId: userId, loginType: loginType
  //               };
  //               saveToken(data);
  //               if (isAuthenticated()) {
  //                   navigate("/CourseUser");
  //                   window.location.reload();
  //               }
  //           }

  //           toast.success(res?.data?.message);
  //       })
  //       .catch((err) => {
  //           toast.error(err?.response?.data?.message);
  //       });
  //   }
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    const newError = handleValidation(inputs);
    setErrors(newError);
    setSubmitted(true);
    if (handleErrors(newError)) {
      loginAdmin(inputs)
        .then((res) => {
          let token = res?.data?.result?.token;
          let loginType = res?.data?.result?.loginType;

          if (loginType === "master") {
            let masterId = res?.data?.result?.masterDetails?._id;
            let data = {
              token: token,
              masterId: masterId,
              loginType: loginType,
            };
            saveToken(data); // Save masterId and token for master login
            if (isAuthenticated()) {
              navigate("/Dashboard");
              window.location.reload(); // Refresh the page
            }
          }

          if (loginType === "user") {
            let userId = res?.data?.result?.userDetails?._id; // Extract the userId
            let data = {
              token: token,
              userId: userId, // Store userId
              loginType: loginType,
            };
            saveToken(data); // Save userId and token for user login
            if (isAuthenticated()) {
              navigate("/UserDashboard");
              window.location.reload();
            }
          }

          toast.success(res?.data?.message);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    }
  };

  if (isAuthenticated()) {
    const type = getLoginType();
    if (type === "master") {
      return <Navigate to="/Dashboard" />;
    } else if (type === "user") {
      return <Navigate to="/CourseUser" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  return (
    <>
      <section className="auth-page-wrapper position-relative d-flex align-items-center justify-content-center min-vh-100">
        <div className="card mb-0">
          <div className="row g-0 align-items-center">
            <div className="col-xl-5">
              <div className="auth-card bg-pixalive shadow-none d-none d-sm-block mb-0">
                {/* <div className="mask mask-1"></div> */}
                <div className="card-body py-3 d-flex justify-content-between flex-column">
                  <div className="auth-effect-main my-4 position-relative rounded-circle d-flex align-items-center justify-content-center mx-auto">
                    <div className="effect-circle-1 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">
                      <div className="effect-circle-2 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">
                        <div className="effect-circle-3 mx-auto rounded-circle position-relative text-white fs-4xl d-flex align-items-center justify-content-center">
                          Welcome to{" "}
                          <strong className="text-primary-1 ms-1">
                            Supreme
                          </strong>
                        </div>
                      </div>
                    </div>
                    <ul className="auth-user-list list-unstyled">
                      <li>
                        <div className="avatar-sm d-inline-block">
                          <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                            <img
                              src="../assets/images/users/avatar-1.jpg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="avatar-sm d-inline-block">
                          <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                            <img
                              src="assets/images/users/avatar-2.jpg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="avatar-sm d-inline-block">
                          <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                            <img
                              src="assets/images/users/avatar-3.jpg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="avatar-sm d-inline-block">
                          <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                            <img
                              src="assets/images/users/avatar-4.jpg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="avatar-sm d-inline-block">
                          <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                            <img
                              src="assets/images/users/avatar-5.jpg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white mb-2">
                      Connect with Like-Minded Individuals{" "}
                    </h3>
                    <p className="text-white opacity-75 fs-base">
                      Enhancing User Testing and Optimizing Admin Panel Control
                      for Smarter Management
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 mx-auto">
              <div className="card mb-0 border-0 shadow-none mb-0 ">
                <div className="card-body p-sm-5">
                  <div className="text-center mt-2">
                    <h5 className="fs-3xl">Welcome Back</h5>
                    <p className="text-muted">
                      Sign in to continue to{" "}
                      <span className="text-primary">Supreme Security. </span>
                    </p>
                  </div>
                  <div className="p-2 mt-3">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Email Id <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative ">
                          <input
                            onChange={handleInputs}
                            type="text"
                            className="form-control  password-input"
                            id="username"
                            name="email"
                            placeholder="Enter Email Id"
                          />
                        </div>
                        {errors.email.required ? (
                          <span className="text-danger form-text">
                            This field is required.
                          </span>
                        ) : errors.email.valid ? (
                          <span className="text-danger form-text">
                            Enter valid Email Id.
                          </span>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="password-input">
                          Password <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <input
                            onChange={handleInputs}
                            type="password"
                            className="form-control pe-5 password-input "
                            placeholder="Enter password"
                            id="password-input"
                            name="password"
                          />
                          {errors.password.required ? (
                            <span className="text-danger form-text">
                              This field is required.
                            </span>
                          ) : errors.password.valid ? (
                            <span className="text-danger form-text">
                              A minimum 8 characters password contains a
                              combination of {""}
                              <strong>uppercase, lowercase, {""}</strong>
                              <strong>special character{""}</strong> and{" "}
                              <strong>number</strong>.
                            </span>
                          ) : null}
                        </div>
                        {/* <div className="float-end">
                          <Link to="/ForgotPassword" className="text-muted">
                            Forgot password?
                          </Link>
                        </div> */}
                      </div>

                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="auth-remember-check"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="auth-remember-check"
                        >
                          Remember me
                        </label>
                      </div> */}

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-pix-login w-100"
                          type="submit"
                        >
                          Log In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
