import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const UserDetails = useSelector((state) => state.userDetails);

  return (


    <nav className="navbar navbar-expand-lg bg-black navbar-dark">
    <div className="container-fluid">
      <a className="navbar-brand fw-bold text-white" href="/"> 🔗 Affiliate<span className="text-info">++</span></a>
   
    </div>
  
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
         
        </div>
    </nav>
  );
}

export default Header;
