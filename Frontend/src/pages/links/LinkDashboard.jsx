import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { serverEndpoint } from "../../config";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";
import AssessmentIcon from '@mui/icons-material/Assessment';
import { usePermission } from "../../rbac/permissions";
import { useNavigate } from 'react-router-dom';
const LinkDashboard = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);
  const [formData, setFormData] = useState({
    campaignTitle: "",
    originalUrl: "",
    category: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const permissions = usePermission(); // custom hook to get permissions

  const handelModalShow = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category,
      });
    } else {
      setFormData({
        campaignTitle: "",

        originalUrl: "",

        category: "",
      });
    }

    setIsEdit(isEdit);
    setShowModal(true);
  };

  const handelModalClose = () => {
    setShowModal(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModalShow = (linkId) => {
    setFormData({
      id: linkId,
    });
    setShowDeleteModal(true);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
        withCredentials: true,
      });
      setFormData({
        campaignTitle: "",

        originalUrl: "",
        category: "",
      });

      fetchLinks();
    } catch (error) {
      setErrors({ message: "Something wentwrong, please try again" });
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (formData.campaignTitle.length === 0) {
      newErrors.username = "campaignTitle is Mandatory";
      isValid = false;
    }
    if (formData.originalUrl.length === 0) {
      newErrors.password = "originalUrl is Mandatory";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // We use event.preventDefault() to stop the default form behavior (page reload) and handle submission in our own way using JavaScript.
    if (validate()) {
      const body = {
        campaignTitle: formData.campaignTitle,
        originalUrl: formData.originalUrl,
        category: formData.category,
      };
      const configuration = {
        withCredentials: true, // it is used to send cookies with the request
      };

      try {
        if (isEdit) {
          await axios.put(
            `${serverEndpoint}/links/${formData.id}`,
            body,
            configuration
          );
        } else {
          await axios.post(`${serverEndpoint}/links`, body, configuration);
        }

        setErrors({});
        setFormData({
          campaignTitle: "",
          originalUrl: "",
          category: "",
        });

        fetchLinks();
      } catch (err) {
        if (err.response?.data?.code == "INSUFFICENT_FUNDS") {
          setErrors({
            message: `You don't have enough credits to create a link
            Add funds to your account using manage payment option`,
          });
        } else {
          setErrors({ message: "something went wrong , please try again" });
        }
      } finally {
        handelModalClose();
      }
    }
  };
  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });
      // console.log("link data" , response.data);
      setLinksData(response.data.data);
    } catch (error) {
      console.log(error);

      setErrors({
        message: "Unable to fetchlinks at the moment, please try again",
      });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: "campaignTitle", headerName: "Campaign", flex: 2 },
    {
      field: "originalUrl",
      headerName: "URL",
      flex: 3,
      renderCell: (params) => (
        <a
          href={`${serverEndpoint}/links/r/${params.row._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.row.originalUrl}
        </a>
      ),
    },
    { field: "category", headerName: "Category", flex: 2 },
    { field: "clickCount", headerName: "Clicks", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          {permissions.canEditLink && (
            <IconButton>
              <EditIcon onClick={() => handelModalShow(true, params.row)} />
            </IconButton>
          )}
          {permissions.canDeleteLink && (
            <IconButton>
              <DeleteIcon
                onClick={() => handleDeleteModalShow(params.row._id)}
              />
            </IconButton>
          )}
           {permissions.canViewLink && (
                        <IconButton>
                            <AssessmentIcon onClick={() => {
                                navigate(`/analytics/${params.row._id}`);
                            }} />
                        </IconButton>
                    )}
        </div>
      ),
    },
  ];

  return (
    <div className="conatiner py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Affiliate Links</h2>

        {permissions.canCreateLink && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handelModalShow(false)}
          >
            Add
          </button>
        )}
      </div>

      {errors.message && (
        <div className="alert alert-danger" role="alert">
          {errors.message}{" "}
        </div>
      )}

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={linksData}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={20}
          rowsPerPageOptions={[20, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
                page: 0,
              },
            },
          }}
          disableRowSelectionOnClick
          showToolbar
          sx={{
            fontFamily: "inherit", // here inherit means it will take the font from the parent element by default
          }}
        />
      </div>

      <Modal show={showModal} onHide={handelModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? <>Edit link</> : <>Add Link</>}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="campaignTitle" className="form-label">
                campaignTitle:
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.camapignTitle ? "is-invalid" : ""
                }`}
                id="campaignTitle"
                name="campaignTitle"
                value={formData.campaignTitle}
                onChange={handleChange}
              />
              {errors.campaignTitle && (
                <div className="invalid-feedback">{errors.campaignTitle}</div>
              )}
            </div>
            <div>
              <label htmlFor="originalUrl">originalUrl:</label>
              <input
                type="text"
                className={`form-control ${
                  errors.originalUrl ? "is-invalid" : ""
                }`}
                id="originalUrl"
                name="originalUrl"
                value={formData.originalUrl}
                onChange={handleChange}
              />
              {errors.originalUrl && (
                <div className="invalid-feedback">{errors.originalUrl}</div>
              )}
            </div>
            <div>
              <label htmlFor="category" className="form-label">
                category:
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this link?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal()}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteSubmit}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LinkDashboard;
