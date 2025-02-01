import { Link } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
} from "@mui/material";
import { deleteQuestion, getFilterQuestion } from "../../api/question";
import { toast } from "react-toastify";
import { localDate } from "../../utils/dateformat";
import { templatePdf } from "../../utils/pdfmake";
import { ExportCsvService } from "../../utils/excel";
import { getproductId } from "../../utils/Storage";
import { getFilterCourse } from "../../api/course";

function JobList() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const pageSize = 10;

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const [jobs, setJobs] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(""); // For selected course filter

  useEffect(() => {
    getAllCourses();
    getAllJobs();
  }, [pagination.from, pagination.to]);

  const getAllJobs = () => {
    const data = {
      limit: 10,
      page: pagination.from,
      masterId: getproductId(),
    };
    getFilterQuestion(data)
      .then((res) => {
        setJobs(res?.data?.result?.userList);
        setPagination({ ...pagination, count: res?.data?.result?.userCount });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllCourses = () => {
    const data = { limit: 10 };
    getFilterCourse(data)
      .then((res) => {
        setQuestions(res?.data?.result?.userList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from, to });
  };

  const handleCourseChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCourse(selectedValue);
    if (selectedValue) {
      filterQuestionsByCourse(selectedValue);
    } else {
      getAllJobs(); // Reset to show all jobs if no course is selected
    }
  };

  const filterQuestionsByCourse = (courseName) => {
    const data = {
      limit: 10,
      page: pagination.from,
      courseName,
      masterId: getproductId(),
    };
    getFilterQuestion(data)
      .then((res) => {
        setJobs(res?.data?.result?.userList);
        setPagination({ ...pagination, count: res?.data?.result?.userCount });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteQuestionData = () => {
    deleteQuestion(deleteId)
      .then((res) => {
        toast.success(res?.data?.message);
        setOpen(false);
        getAllJobs();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openPopup = (data) => setOpen(true) || setDeleteId(data);
  const closePopup = () => setOpen(false);

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div className="content-body">
          <div className="content container-fluid">
            <div className="row">
              <div className="content-page-header mb-20">
                <h5>Question Management</h5>{" "}
                <div className="col-md-4">
                  <select
                    className="form-control"
                    id="qualification"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                  >
                    <option value="">-- Select Course --</option>
                    {questions?.map((item, index) => (
                      <option key={index} value={item?.courseName}>
                        {item?.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex align-items-center">
                  <div className="list-btn ms-3">
                    <ul className="filter-list">
                      <li>
                        <Link className="btn btn-pix-primary " to="/QustionAdd">
                          <i
                            className="fa fa-plus-circle me-2"
                            aria-hidden="true"
                          ></i>
                          Add Questions
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="card-table table-responsive overflow-auto">
                      <table
                        id="pixalive-table"
                        className="card-table dataTable"
                      >
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Course</th>
                            <th>Questions</th>
                            <th>Answer</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jobs?.map((data, index) => (
                            <tr key={index}>
                              <td>{pagination.from + index + 1}</td>
                              <td>{data?.courseName}</td>
                              <td>{data?.question}</td>
                              <td>{data?.answer}</td>
                              <td>
                                <div className="d-flex">
                                  <Link
                                    className="dropdown-item"
                                    to={{
                                      pathname: "/QustionEdit",
                                      search: `?id=${data?._id}`,
                                    }}
                                  >
                                    <i className="far fa-edit "></i>
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      openPopup(data?._id);
                                    }}
                                  >
                                    <i className="far fa-trash-alt "></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {jobs?.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="form-text text-danger text-center"
                              >
                                No data
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                    <div className="float-end my-2">
                      <Pagination
                        count={Math.ceil(pagination.count / pageSize)}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open}>
        <DialogContent>
          <div className="text-center m-4">
            <h5 className="mb-4">
              Are you sure you want to Delete the selected Question?
            </h5>
            <button
              type="button"
              className="btn btn-save mx-3"
              onClick={deleteQuestionData}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-cancel"
              onClick={closePopup}
            >
              No
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default JobList;
