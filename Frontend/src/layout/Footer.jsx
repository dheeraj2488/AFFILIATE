import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container-fluid bg-light text-center py-4 border-top">

      <div className="text-muted small">
        &copy; {currentYear} Affiliate Link Manager | All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
