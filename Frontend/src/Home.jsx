import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css"; // Assuming you have a CSS file for custom styles
function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
    <div style={{ overflowX: 'hidden' , width: '100%' }}>
      <div
        className="container-fluid  text-white min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5"
        style={{ paddingTop: "100px" , backgroundColor: '#03001C' } }
      >
        <div className="mb-5" data-aos="fade-down">
          <h1 className="display-3 fw-bold mb-3">Affiliate Link Manager</h1>
          <p className="lead">
            Shorten, track, and manage your affiliate links like a pro.
          </p>
          <div className="mt-4">
            <Link to="/login" className="btn btn-light btn-lg me-3" >
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg">
              Get Started
            </Link>

            <div className="mt-3">
              <a href="#about" className="btn btn-lg btn-outline-light  ">
                About
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mt-4">
          <div className="row g-4 mx-0">
            <div className="col-md-4" data-aos="zoom-in">
              <div className="card feature-card bg-white text-dark h-100 shadow hover-pop">
                <div className="card-body text-center">
                  <h5 className="card-title">🔗 Smart Link Management</h5>
                  <p className="card-text">
                    Organize and shorten your affiliate URLs with categories and
                    tags.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="100">
              <div className="card feature-card bg-white text-dark h-100 shadow hover-pop">
                <div className="card-body text-center">
                  <h5 className="card-title">📈 Real-Time Analytics</h5>
                  <p className="card-text">
                    Track clicks, conversions, and optimize your campaigns.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="card feature-card bg-white text-dark h-100 shadow hover-pop">
                <div className="card-body text-center">
                  <h5 className="card-title">👥 Team Collaboration</h5>
                  <p className="card-text">
                    Role-based access so your entire team can contribute
                    effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
  id="about"
  className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5"
  style={{
    background: "linear-gradient(135deg, #ffffff, #f1f4f9)",
    color: "#1f1f1f",
  }}
>
  <div className="text-center mb-5 px-3" data-aos="fade-up">
    <h2 className="fw-bold display-5" style={{ color: "#03001C" }}>
      About <span className="text-info">Affiliate++</span>
    </h2>
    <p className="mt-3 fs-5 text-secondary">
      In the digital age, affiliate marketing has become a prominent strategy
      for monetization through content sharing. However, managing affiliate
      links manually is often inefficient and unorganized — leading to issues
      like loss of tracking data, duplication of links, and lack of insights
      into performance.
    </p>
    <p className="lead text-muted">
      A smart solution for managing and tracking your affiliate marketing
      campaigns efficiently.
    </p>
  </div>

  <div className="row w-100 px-3">
    <div className="col-md-6 mb-4" data-aos="fade-right">
      <div
        className="p-4 h-100 rounded shadow-sm"
        style={{ backgroundColor: "#ffffff" }}
      >
        <h5 className="fw-semibold mb-3 text-dark">
          📌 What is <span className="text-info">Affiliate++</span>?
        </h5>
        <p className="text-muted">
          Affiliate++ is a powerful SaaS platform designed to simplify affiliate
          marketing. It empowers content creators, digital marketers, small
          businesses, and affiliate managers to create, organize, and track
          affiliate links with ease.
        </p>
      </div>
    </div>
    <div className="col-md-6 mb-4" data-aos="fade-left">
      <div
        className="p-4 h-100 rounded shadow-sm"
        style={{ backgroundColor: "#ffffff" }}
      >
        <h5 className="fw-semibold mb-3 text-dark">🎯 Our Mission</h5>
        <p className="text-muted">
          We help you grow by providing smart link tools, analytics, and a clean
          dashboard — all in one place.
        </p>
      </div>
    </div>
  </div>
</div>

      </div>
    </>
  );
}

export default HomePage;
