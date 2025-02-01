import React from 'react';
function ForgotPassword() {
return( 
<>
    <section className="auth-page-wrapper position-relative d-flex align-items-center justify-content-center min-vh-100">    
        <div className="card mb-0">
            <div className="row g-0 align-items-center">
                <div className="col-xl-5">
                    <div className="auth-card bg-pixalive shadow-none d-none d-sm-block mb-0">
                        <div className="card-body py-3 d-flex justify-content-between flex-column">
                            <a href="/" className="mb-0 mb-lg-20 text-center login-logo">
                                <img alt="Logo" src="../assets/images/logo-light.svg"/>                    
                            </a>                                            
                            <div className="auth-effect-main my-5 position-relative rounded-circle d-flex align-items-center justify-content-center mx-auto">
                                <div className="effect-circle-1 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">
                                    <div className="effect-circle-2 position-relative mx-auto rounded-circle d-flex align-items-center justify-content-center">
                                        <div className="effect-circle-3 mx-auto rounded-circle position-relative text-white fs-4xl d-flex align-items-center justify-content-center">
                                            Welcome to <strong className="text-primary-1 ms-1">Pixalive</strong>
                                        </div>
                                    </div>
                                </div>
                                <ul className="auth-user-list list-unstyled">
                                    <li>
                                        <div className="avatar-sm d-inline-block">
                                            <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                                                <img src="../assets/images/users/avatar-1.jpg" alt="" className="img-fluid"/>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="avatar-sm d-inline-block">
                                            <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                                                <img src="assets/images/users/avatar-2.jpg" alt="" className="img-fluid"/>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="avatar-sm d-inline-block">
                                            <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                                                <img src="assets/images/users/avatar-3.jpg" alt="" className="img-fluid"/>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="avatar-sm d-inline-block">
                                            <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                                                <img src="assets/images/users/avatar-4.jpg" alt="" className="img-fluid"/>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="avatar-sm d-inline-block">
                                            <div className="avatar-title bg-white shadow-lg overflow-hidden rounded-circle">
                                                <img src="assets/images/users/avatar-5.jpg" alt="" className="img-fluid"/>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white mb-2">Connecting with Like-Minded People on Pixalive</h3>
                                <p className="text-white opacity-75 fs-base">Empowering Users, Creators, Influencers, Businesses in the Social Media Landscape</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 mx-auto">
                    <div className="card mb-0 border-0 shadow-none mb-0 ">
                        <div className="card-body p-sm-5">
                            <div className="text-center mt-2">
                                <h5 className="fs-3xl">Forgot Password?</h5>
                                <p className="text-muted mb-4">Reset password with Steex</p>
                                <div className="pb-4">
                                    <img src="assets/images/email.png" alt="" className="avatar-md"/>
                                </div>
                            </div>
                            <div className="alert border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                Enter your email and instructions will be sent to you!
                            </div>
                            <div className="p-2 mt-3">
                                <form action="#">                            
                                    <div className="mb-3">
                                        <label for="username" className="form-label">Email <span className="text-danger">*</span></label>
                                        <div className="position-relative ">
                                            <input type="text" className="form-control  password-input" id="Enter Email" placeholder="Enter Email Id" required/>
                                        </div>
                                    </div>    
                                    <div className="mt-4">
                                        <a href="/ResetPassword" className="btn btn-primary btn-pix-login w-100" type="submit">Send Reset Link</a>
                                    </div>
                                </form>
                                <div className="mt-3 text-center">
                                    <p className="mb-0">Back to <a href="/" className="back-to-login"> Login </a> </p>
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
export default ForgotPassword;