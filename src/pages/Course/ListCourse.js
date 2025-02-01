import { Link } from "react-router-dom";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
} from "@mui/material";
import { deleteCourse, getFilterCourse } from "../../api/course";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { localDate } from "../../utils/dateformat";
import { templatePdf } from "../../utils/pdfmake";
import { ExportCsvService } from "../../utils/excel";
import { getproductId } from "../../utils/Storage";
import { getPassResult } from "../../api/result";

function JobList() {
  const initialStateInputs = {
    designation: "",
  };
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState(initialStateInputs);
  const [openFilter, setOpenFilter] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const pageSize = 10;
  const [stats, setStats] = useState(null);

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const [job, setJob] = useState();
  const [filter, setFilter] = useState(false);

  useEffect(() => {
    filter ? filterJobList() : getAllJobList();
  }, [pagination.from, pagination.to]);

  const getAllJobList = () => {
    const data = {
      limit: 10,
      page: pagination.from,
      masterId: getproductId(),
    };
    getFilterCourse(data)
      .then((res) => {
        setJob(res?.data?.result?.userList);
        console.log("ffff", res?.data?.result?.userList);

        setPagination({ ...pagination, count: res?.data?.result?.userCount });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  const openPopup = (data) => {
    setOpen(true);
    setDeleteId(data);
  };

  const closePopup = () => {
    setOpen(false);
  };

  const deleteCourseData = () => {
    deleteCourse(deleteId)
      .then((res) => {
        toast.success(res?.data?.message);
        closePopup();
        getAllJobList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openFilterPopup = () => {
    setOpenFilter(true);
  };

  const closeFilterPopup = () => {
    setOpenFilter(false);
  };

  const filterJobList = (event) => {
    event?.preventDefault();
    setFilter(true);
    const data = {
      limit: 10,
      page: pagination.from,
      designation: inputs?.designation,
      masterId: getproductId(),
    };
    getFilterCourse(data)
      .then((res) => {
        setJob(res?.data?.result?.userList);
        setPagination({ ...pagination, count: res?.data?.result?.userCount });
        closeFilterPopup();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetFilter = () => {
    setFilter(false);
    setInputs(initialStateInputs);
    getAllJobList();
  };

  const handleInputs = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPassResult();
        if (res.success) {
          setStats(res.result);
          console.log("res:", res); // Check the response structure
        } else {
          console.error("Failed to fetch statistics.");
          alert("Failed to fetch statistics.");
        }
      } catch (error) {
        console.error("Error fetching pass statistics:", error);
        alert("Failed to fetch statistics.");
      }
    };

    fetchStats();
  }, []);

  const pdfDownload = (event) => {
    event?.preventDefault();
    const data = { masterId: getproductId() };
    getFilterCourse(data)
      .then((res) => {
        var result = res?.data?.result?.userList;
        var tablebody = [];
        tablebody.push([
          {
            text: "S.NO",
            fontSize: 11,
            alignment: "center",
            margin: [5, 5],
            bold: true,
          },
          {
            text: "Designation",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: "Experience",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: "No Of Positions",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: " Qualification",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: " Location",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: "Skills",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
          {
            text: "JobDescription",
            fontSize: 11,
            alignment: "center",
            margin: [20, 5],
            bold: true,
          },
        ]);
        result.forEach((element, index) => {
          tablebody.push([
            {
              text: index + 1,
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
              border: [true, false, true, true],
            },
            {
              text: element?.designation ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.experience ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.noOfPositions ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.qualification ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.location ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.skills ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
            {
              text: element?.jobDescription ?? "-",
              fontSize: 10,
              alignment: "left",
              margin: [5, 3],
            },
          ]);
        });
        templatePdf("Job List", tablebody, "landscape");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const exportCsv = (event) => {
    event?.preventDefault();
    const data = { masterId: getproductId() };
    getFilterCourse(data)
      .then((res) => {
        var result = res?.data?.result?.userList;
        let list = [];
        result?.forEach((res) => {
          list.push({
            designation: res?.designation ?? "-",
            experience: res?.experience ?? "-",
            noOfPositions: res?.noOfPositions ?? "-",
            qualification: res?.qualification ?? "-",
            skills: res?.skills ?? "-",
            location: res?.location ?? "-",
            jobDescription: res?.jobDescription ?? "-",
            startDate: localDate(res?.createdOn) ?? "-",
          });
        });
        let header1 = [
          "designation",
          "experience",
          "noOfPositions",
          "skills",
          "location",
          "jobType",
          "jobDescription",
        ];
        let header2 = [
          "Designation",
          "Experience",
          "No Of Positions",
          "Skills",
          "Location",
          "Job Type",
          "jobDescription",
        ];
        ExportCsvService.downloadCsv(
          list,
          "careerlist",
          "Caree List",
          header1,
          header2
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div id="main-wrapper">
        <Header />
        <SideBar />
        <div class="content-body">
          <div class="content container-fluid">
            <div class="row">
              <div class="content-page-header mb-20">
                <h5>Course Management</h5>
                <div class="list-btn">
                  <ul class="filter-list">
                    <li>
                      <Link class="btn-filters" onClick={pdfDownload}>
                        <span>
                          <i class="fa fa-file-pdf" aria-hidden="true"></i>
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link class="btn-filters" onClick={exportCsv}>
                        <span>
                          <i class="fa fa-file-excel" aria-hidden="true"></i>
                        </span>
                      </Link>
                    </li>
                    <li></li>
                    <li>
                      <Link class="btn btn-pix-primary " to="/CourseAdd">
                        <i
                          class="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add Course{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-xl-12">
                <div class="card mt-2">
                  <div class="card-body">
                    <div class="card-table table-responsive overflow-auto">
                      <table
                        id="pixalive-table"
                        className="card-table dataTable"
                      >
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Course</th>
                            <th>Image</th>
                            <th>Learning Video</th>

                            <th>Test Video</th>
                            <th>Total Attempts</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {job?.map((data, index) => (
                            <tr key={index}>
                              <td>{pagination.from + index + 1}</td>
                              <td>{data?.courseName}</td>

                              {/* Image Display */}
                              <td>
                                <img
                                  src={
                                    data?.courseImageUrl ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt="Course Thumbnail"
                                  style={{
                                    width: "200px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                  }}
                                />
                              </td>
                              <td>
                                <video
                                  src={
                                    data?.learningVideo
                                      ? data?.learningVideo
                                      : "https://www.w3schools.com/html/mov_bbb.mp4"
                                  }
                                  controls
                                  style={{
                                    width: "200px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </td>

                              {/* Video Display */}
                              <td>
                                <video
                                  src={
                                    data?.mainVideo
                                      ? data?.mainVideo
                                      : "https://www.w3schools.com/html/mov_bbb.mp4"
                                  }
                                  controls
                                  style={{
                                    width: "200px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                  }}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </td>

                              <td className="text-center">
                                <span className="badge bg-primary">
                                  {stats ? stats.totalAttemptCount : 0}
                                </span>
                              </td>

                              <td className="text-capitalize text-center text-truncate">
                                <div className="d-flex">
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      openPopup(data?._id);
                                    }}
                                  >
                                    <i className="far fa-trash-alt"></i>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
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
              Are you sure you want to Delete <br /> the selected Job ?
            </h5>
            <button
              type="button"
              className="btn btn-save mx-3"
              onClick={deleteCourseData}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-cancel "
              onClick={closePopup}
            >
              No
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openFilter} fullWidth maxWidth="sm">
        <DialogTitle>
          Filter Jobs
          <IconButton className="float-end" onClick={closeFilterPopup}>
            <i className="fa fa-times fa-xs" aria-hidden="true"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="from-group mb-3">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                name="designation"
                value={inputs?.designation}
                onChange={handleInputs}
                placeholder="Designation"
              />
            </div>

            <div>
              <button
                type="button"
                className="btn btn-cancel  float-end"
                onClick={resetFilter}
              >
                Reset
              </button>
              <button
                type="submit"
                onClick={filterJobList}
                className="btn btn-save float-end mx-2"
              >
                Apply
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default JobList;
