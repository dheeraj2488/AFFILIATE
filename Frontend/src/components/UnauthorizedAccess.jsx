function UnauthorizedAccess() {
    return (
      <div className="container text-center py-5">
        <h2 className="text-danger">Unauthorized Access</h2>
        <p className="lead">
          You do not have sufficient permissions to view this page.
          <br />
          Please contact your administrator.
        </p>
      </div>
    );
  }
  
  export default UnauthorizedAccess;
  