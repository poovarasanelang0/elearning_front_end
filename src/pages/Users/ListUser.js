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
import { deleteUser, getFilterUser } from "../../api/user";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { localDate } from "../../utils/dateformat";
import { templatePdf } from "../../utils/pdfmake";
import { ExportCsvService } from "../../utils/excel";

function JobList() {
  const initialStateInputs = {
    designation: "",
  };
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState(initialStateInputs);
  const [openFilter, setOpenFilter] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const pageSize = 10;
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
    };
    getFilterUser(data)
      .then((res) => {
        setJob(res?.data?.result?.userList);
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

  const deleteUserData = () => {
    deleteUser(deleteId)
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
    };
    getFilterUser(data)
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

  const pdfDownload = (event) => {
    event?.preventDefault();

    getFilterUser(inputs)
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
    const data = {};
    getFilterUser(data)
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
                <h5>User Management</h5>
                <div class="list-btn">
                  <ul class="filter-list">
                    {/* <li>
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
                    <li>
                      <Link class="btn-filters" onClick={openFilterPopup}>
                        <span>
                          <i class="fe fe-filter"></i>
                        </span>
                      </Link>
                    </li> */}
                    <li>
                      <Link class="btn btn-pix-primary " to="/UserAdd">
                        <i
                          class="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add User{" "}
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
                      <table id="pixalive-table" class="card-table dataTable">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th> Email</th>
                            <th>Action</th>
                           
                          </tr>
                        </thead>
                        <tbody>
                          {job?.map((data, index) => (
                            <tr key={index}>
                              <td>{pagination.from + index + 1}</td>
                              <td>{data?.name}</td>
                              <td>{data?.mobileNo}</td>
                              <td>{data?.email}</td>



                              <td>
                                <div className="d-flex">
                                  <Link
                                    className="dropdown-item"
                                    to={{
                                      pathname: "/UserEdit",
                                      search: `?id=${data?._id}`,
                                    }}
                                  >
                                    <i className="far fa-edit me-2"></i>Edit
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    to={{
                                      pathname: "/Userview",
                                      search: `?id=${data?._id}`,
                                    }}
                                  >
                                    <i className="far fa-eye me-2"></i>View
                                  </Link>
                                  <Link
                                    className="dropdown-item"
                                    onClick={() => {
                                      openPopup(data?._id);
                                    }}
                                  >
                                    <i className="far fa-trash-alt me-2"></i>
                                    Delete
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {job?.length === 0 ? (
                            <tr>
                              <td className="form-text text-danger">No data</td>
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
              Are you sure you want to Delete <br /> the selected Job ?
            </h5>
            <button
              type="button"
              className="btn btn-save mx-3"
              onClick={deleteUserData}
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
