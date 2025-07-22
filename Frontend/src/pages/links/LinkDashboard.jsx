import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { serverEndpoint } from "../../config";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { usePermission } from "../../rbac/permissions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  
  //file upload variables
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setpreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [totalCount, setTotalCount] = useState(0);
  //MUI DataGrid require array of fields as the sort model when using server side sorting.
  //When using client-side pagination/sorting/filter/search, MUI takes care of everything
  //abstracting implementation details. Since we are now managing data using server,
  //we need to manage everything and let DataGrid know what is happening.
  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);

  const handelModalShow = (isEdit, data = {}) => {
    if (isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category,
        thumbnail : data.thumbnail
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

      console.log("form data", body);

      try {
        setLoading(true);
        // If thumbnailFile is selected, upload it to Cloudinary and add the URL to the body
        let thumbnailUrl = "";
        if (thumbnailFile) {
          thumbnailUrl = await uploadToCloudinary(thumbnailFile);
          body.thumbnail = thumbnailUrl; // Add the thumbnail URL to the body
        }
        // console.log("thumbnailUrl", thumbnailUrl);
        if (isEdit) {
          await axios.put(
            `${serverEndpoint}/links/${formData.id}`,
            body,
            configuration
          );
          toast.success("Link Edited Successfully")
        } else {
          await axios.post(`${serverEndpoint}/links`, body, configuration);
          toast.success("Link Added Successfully")
        }

        setErrors({});
        setFormData({
          campaignTitle: "",
          originalUrl: "",
          category: "",
        });

        setThumbnailFile(null); // Reset the thumbnail file after submission
        setpreviewUrl(""); // Reset the preview URL after submission
        fetchLinks();
        setLoading(false);
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
        setLoading(false);
      }
    }
  };

  const uploadToCloudinary = async (file) => {
    const { data } = await axios.post(
      `${serverEndpoint}/links/generate-upload-signature`,
      {},
      { withCredentials: true }
    );
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", data.apiKey);
    formData.append("timestamp", data.timestamp);
    formData.append("signature", data.signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url; // Return the URL of the uploaded image and we will store this URL in the database
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const sortField = sortModel[0]?.field || "createdAt";
      const sortOrder = sortModel[0]?.sort || "desc";
      // we are doing server side pagination, sorting and searching
      //it helps to reduce the amount of data sent to the client and improve performance
      // for example we have 1000 links and we want to show only 20 links per page that is why pagination is used
      const params = {
        currentPage: currentPage,
        pageSize: pageSize,
        searchTerm: searchTerm,
        sortField: sortField,
        sortOrder: sortOrder,
      };
      const response = await axios.get(`${serverEndpoint}/links`, {
        params: params,
        withCredentials: true,
      });
      // console.log("link data" , response.data.data);
      setLinksData(response.data.data.links);
      setTotalCount(response.data.data.total);
    } catch (error) {
      console.log(error);

      setErrors({
        message: "Unable to fetchlinks at the moment, please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [currentPage, pageSize, searchTerm, sortModel]);

  const columns = [
    {
      field: "thumbnail",
      headerName: "Thumbnail",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        params.row.thumbnail ? (
          <img
            src={params.row.thumbnail}
            alt="Thumbnail"
            style={{ maxHeight: "45px" }}
          />
        ) : (
          <span style={{ color: "#888" }}> No Image</span>
        )
      ),
    },
    { field: "campaignTitle", headerName: "Campaign",width: 150},
    {
      field: "originalUrl",
      headerName: "URL",
      width: 250,
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
    { field: "category", headerName: "Category", width: 200, },
    { field: "clickCount", headerName: "Clicks", width: 100, },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div >
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
              <AssessmentIcon
                onClick={() => {
                  navigate(`/analytics/${params.row._id}`);
                }}
              />
            </IconButton>
          )}
        </div>
      ),
    },
    {
      field: "share",
      headerName: "Share Affiliate Link",
      sortable: false,
      flex : 1,
      renderCell: (params) => {
        const shareUrl = `${serverEndpoint}/links/r/${params.row._id}`;
        return (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={(e) => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Affiliate link copied to clipboard");
            }}
          >
            Copy
          </button>
        );
      },
    },
  ];

  return (
    <div className="conatiner py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Affiliate Links</h2>

        {permissions.canCreateLink && (
          <button
            className="btn btn-danger btn-sm"
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

      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Campaign title , Original Url , or Category"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0); // Reset to first page on new search
          }}
        />
      </div>

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
                pageSize: pageSize,
                page: currentPage,
              },
            },
          }}
          paginationMode="server"
          pageSizeOptions={[2, 3, 4]}
          onPaginationModelChange={(newPage) => {
            setCurrentPage(newPage.page);
            setPageSize(newPage.pageSize);
          }}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setCurrentPage(0); // Reset to first page on page size change
          }}
          rowCount={totalCount}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={(model) => {
            setSortModel(model);
            setCurrentPage(0); // Reset to first page on sort change
          }}
          loading={loading}
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

            <div className="mb-3">
              <label htmlFor="thumbnailFile" className="form-control">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setThumbnailFile(file);
                    setpreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the selected file
                  } else {
                    setpreviewUrl(""); // Reset preview URL if no file is selected
                  }
                }}
                className="form-control"
              />

              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    width="150"
                    alt="Thumbnail Preview"
                    className="img-responsive border rounded-2"
                  />
                </div>
              )}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-danger"  disabled={loading}>
              {loading ? "Loading..." : "Submit"}
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
