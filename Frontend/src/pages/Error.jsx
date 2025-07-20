import React from 'react'
import { Link } from 'react-router-dom'
const Error = () => {
  return (
    <div className="container text-center py-5">
      
      <div className="container text-center py-5">
        <h2 className="text-danger">Unauthorized Access</h2>
        <p className="lead">
          You do not have sufficient permissions to view this page.
          <br />
          Please contact your administrator.
        </p>
      </div>
      <Link to='/'  className="btn btn-secondary"> Go home </Link>
    </div>
  )
}

export default Error
