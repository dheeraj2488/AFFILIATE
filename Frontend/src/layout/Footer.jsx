import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container-fluid  text-center py-4 ">
      <div className="small text-white mt-6">
        &copy; {currentYear} Affiliate Link Manager | All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
