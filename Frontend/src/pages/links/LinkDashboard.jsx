import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { serverEndpoint } from "../../config";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const LinkDashboard = () => {
  const [errors, setErrors] = useState({});
  const [linksData, setLinksData] = useState([]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true,
      });

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
    { field: "caompaignTitle", headerName: "Campaign", flex: 2 },
    { field: "originalUrl", headerName: "URL", flex: 3 },
    { field: "category", headerName: "Category", flex: 2 },
    { field: "clickCount", headerName: "Clicks", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => (
        <div>
          <IconButton>
            {" "}
            <EditIcon />{" "}
          </IconButton>
          <IconButton>
            {" "}
            <DeleteIcon />{" "}
          </IconButton>
        </div>
      ),
    },
  ];
  return (
    <div className="conatiner py-4">
      <h2>Manage Affiliate Links</h2>
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
        />
      </div>
    </div>
  );
};

export default LinkDashboard;
