import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
      {/* Main Section */}
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
            <Link to="/login" className="btn btn-light btn-lg me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg">
              Get Started
            </Link>

            <div className="ms-auto">
              <a href="#about" className="btn btn-lg mt-3 btn-outline-light ">
                About
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mt-4">
          <div className="row g-4">
            <div className="col-md-4" data-aos="zoom-in">
              <div className="card feature-card bg-white text-dark h-100 shadow">
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
              <div className="card feature-card bg-white text-dark h-100 shadow">
                <div className="card-body text-center">
                  <h5 className="card-title">📈 Real-Time Analytics</h5>
                  <p className="card-text">
                    Track clicks, conversions, and optimize your campaigns.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4" data-aos="zoom-in" data-aos-delay="200">
              <div className="card feature-card bg-white text-dark h-100 shadow">
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
      <div id="about" className="container-fluid bg-white text-white min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5">
        <div className="text-center mb-4" data-aos="fade-up">
          <h2 className="fw-bold text-dark">About Affiliate++</h2>
          <p className="lead text-muted">
            A smart solution for managing and tracking your affiliate marketing
            campaigns efficiently.
          </p>
        </div>
        <div className="row">
          <div className="col-md-6" data-aos="fade-right">
            <h5 className="fw-semibold text-dark">📌 What is Affiliate++?</h5>
            <p className="text-black">
              Affiliate++ is a powerful SaaS platform designed to simplify
              affiliate marketing. It empowers content creators, digital
              marketers, small businesses, and affiliate managers to create,
              organize, and track affiliate links with ease.
            </p>
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <h5 className="fw-semibold text-dark">🎯 Our Mission</h5>
            <p className="text-black">
              We help you grow by providing smart link tools, analytics, and a
              clean dashboard — all in one place.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
