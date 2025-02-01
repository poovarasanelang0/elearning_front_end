import React, { useState } from "react";
import { isValidEmail, isValidPassword, isValidPhone } from "../../utils/validation";
import { saveMaster } from "../../api/master";
import { isAuthenticated } from "../../utils/Auth";

import { saveToken } from "../../utils/Storage";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const initialState = {
        name: '',
        email: '',

        password: '',
        companyName: '',
        mobileNo: ''
    }
    const initialStateErrors = {
        name: { required: false },
        email: { required: false, valid: false },

        password: { required: false, valid: false },
        companyName: { required: false },
        mobileNo: { required: false, valid: false },
    }
    const [inputs, setInputs] = useState(initialState);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState(initialStateErrors);
    const navigate = useNavigate()

    const handleValidation = (data) => {
        let error = initialStateErrors;
        if (data.name === "") {
            error.name.required = true;
        }
        if (data.email === "") {
            error.email.required = true;
        }

        if (data.password === "") {
            error.password.required = true;
        }
        if (data.companyName === "") {
            error.companyName.required = true;
        }
        if (data.mobileNo === "") {
            error.mobileNo.required = true;
        }
        if (!isValidPhone(data.mobileNo)) {
            error.mobileNo.valid = true;
        }
        if (!isValidPassword(data.password)) {
            error.password.valid = true;
        }
        if (!isValidEmail(data.email)) {
            error.email.valid = true
        }
        return error
    }

    const handleInputs = (event) => {
        setInputs({ ...inputs, [event?.target?.name]: event?.target?.value })
        if (submitted) {
            const newError = handleValidation({ ...inputs, [event.target.name]: event.target.value })
            setErrors(newError)
        }
    }

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
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const newError = handleValidation(inputs)
        setErrors(newError)
        setSubmitted(true)
        if (handleErrors(newError)) {
            const data = {
                email: inputs?.email,
                name: inputs?.name,

                password: inputs?.password,

                companyName: inputs?.companyName,
                mobileNo: inputs?.mobileNo

            }
            saveMaster(data).then(res => {
                let token = res?.data?.result?.token;
                let userId = res?.data?.result?._id;

                let data = {
                    token: token,
                    userId: userId

                }
                saveToken(data);
                if (isAuthenticated()) {
                    navigate("/Dashboard");
                }
                toast.success(res?.data?.message);
            }).catch(err => {
                toast.error(err?.response?.data?.message);
            })
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

                                    <a href="/" className="mb-0 mb-lg-20 text-center login-logo">

                                        <img alt="Logo" src="../assets/images/logo-light.svg" />

                                    </a>



                                    <div className="auth-effect-main my-5 position-relative rounded-circle d-flex align-items-center justify-content-center mx-auto">

                                        <div className="effect-circle-1 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">

                                            <div className="effect-circle-2 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">

                                                <div className="effect-circle-3 mx-auto rounded-circle position-relative text-white fs-4xl d-flex align-items-center justify-content-center">

                                                    Welcome to{" "}

                                                    <strong className="text-primary-1 ms-1">

                                                        Pixalive

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

                                            Connecting with Like-Minded People on Pixalive

                                        </h3>

                                        <p className="text-white opacity-75 fs-base">

                                            Empowering Users, Creators, Influencers, Businesses in the

                                            Social Media Landscape

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

                                            Sign in to continue to Pixalive.

                                        </p>

                                    </div>

                                    <div className="p-2 mt-3">

                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3">

                                                <label htmlFor="username" className="form-label">

                                                    Company Name <span className="text-danger">*</span>

                                                </label>

                                                <div className="position-relative ">

                                                    <input
                                                        type="text"

                                                        className="form-control  password-input"

                                                        name="companyName"

                                                        placeholder="Enter Company Name"
                                                        onChange={handleInputs}

                                                    />
                                                    {errors.companyName.required ?
                                                        <span className="text-danger form-text">
                                                            This field is required.
                                                        </span> : null
                                                    }
                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label" htmlFor="password-input">

                                                    Email <span className="text-danger">*</span>

                                                </label>

                                                <div className="position-relative auth-pass-inputgroup mb-3">

                                                    <input

                                                        type="email"

                                                        className="form-control pe-5 password-input "

                                                        placeholder="Enter Email"

                                                        name="email"

                                                        onChange={handleInputs}

                                                    />
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
                                            </div>

                                            <div className="mb-3">

                                                <label htmlFor="username" className="form-label">

                                                    Contact Mobile <span className="text-danger">*</span>

                                                </label>

                                                <div className="position-relative ">

                                                    <input

                                                        type="text"

                                                        className="form-control  password-input"

                                                        name="mobileNo"

                                                        placeholder="Enter Mobile Number"

                                                        onChange={handleInputs}

                                                    />
                                                    {errors.mobileNo.required ? (
                                                        <span className="text-danger form-text">
                                                            This field is required.
                                                        </span>
                                                    ) : errors.mobileNo.valid ? (
                                                        <span className="text-danger form-text">
                                                            Enter valid Phone Number.
                                                        </span>
                                                    ) : null}
                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <label className="form-label" htmlFor="password-input">

                                                    Contact Person <span className="text-danger">*</span>

                                                </label>

                                                <div className="position-relative auth-pass-inputgroup mb-3">

                                                    <input

                                                        type="text"

                                                        className="form-control pe-5 password-input "

                                                        placeholder="Contact Person"

                                                        name="name"

                                                        onChange={handleInputs}

                                                    />
                                                    {errors.name.required ?
                                                        <span className="text-danger form-text">
                                                            This field is required.
                                                        </span> : null}

                                                </div>



                                            </div>


                                            <div className="mb-3">

                                                <label className="form-label" htmlFor="password-input">

                                                    Password <span className="text-danger">*</span>

                                                </label>

                                                <div className="position-relative auth-pass-inputgroup mb-3">

                                                    <input

                                                        type="password"

                                                        className="form-control pe-5 password-input "

                                                        placeholder="Enter password"

                                                        name="password"

                                                        onChange={handleInputs}

                                                    />
                                                    {errors.password.required ? (
                                                        <span className="text-danger form-text">
                                                            This field is required.
                                                        </span>
                                                    ) : errors.password.valid ? (
                                                        <span className="text-danger form-text">
                                                            A minimum 8 characters password contains a
                                                            combination of {''}
                                                            <strong>uppercase, lowercase, {''}</strong>
                                                            <strong>special character{''}</strong> and <strong>number</strong>.
                                                        </span>
                                                    ) : null}
                                                </div>



                                            </div>



                                            <div className="form-check">

                                                <input

                                                    className="form-check-input"

                                                    type="checkbox"

                                                    value=""

                                                    id="auth-remember-check"

                                                    autoComplete="off"

                                                    name="remember"

                                                />

                                                <label

                                                    className="form-check-label"

                                                    htmlFor="auth-remember-check"

                                                >

                                                    Remember me

                                                </label>

                                            </div>



                                            <div className="mt-4">

                                                <button

                                                    className="btn btn-primary btn-pix-login w-100"

                                                    type="submit"

                                                >

                                                    Sign In

                                                </button>

                                            </div>

                                        </form>



                                        <div className="text-center mt-3">

                                            <p className="mb-0">Keep your interest alive</p>

                                        </div>



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

export default Signup;
