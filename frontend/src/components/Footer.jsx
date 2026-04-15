import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="text-center text-lg-start bg-body-tertiary text-muted">
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span style={{ fontFamily: "'Barlow', sans-serif" }}>
            Get connected with us on our socials:
          </span>
        </div>
        <div>
          <a href="#" className="me-4 text-reset">
            <img src="/images/github.png" height="25" width="25" alt="github" />
          </a>
          <a href="https://www.google.com/" className="me-4 text-reset">
            <img src="/images/google.png" height="25" width="25" alt="google" />
          </a>
          <a href="https://www.linkedin.com/home" className="me-4 text-reset">
            <img
              src="/images/linkedin.png"
              height="25"
              width="25"
              alt="linkedin"
            />
          </a>
          <a href="https://www.instagram.com/" className="me-4 text-reset">
            <img
              src="/images/instagram.png"
              height="25"
              width="25"
              alt="instagram"
            />
          </a>
          <a href="https://x.com/" className="me-4 text-reset">
            <img
              src="/images/twitter.png"
              height="25"
              width="25"
              alt="twitter"
            />
          </a>
          <a href="https://www.youtube.com/" className="me-4 text-reset">
            <img
              src="/images/youtube.png"
              height="25"
              width="25"
              alt="youtube"
            />
          </a>
        </div>
      </section>

      <section>
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <span style={{ fontFamily: "'Barlow', sans-serif" }}>
                  HireSense
                </span>
              </h6>
              <p style={{ fontFamily: "'Barlow', sans-serif" }}>
                We provide you with an efficient tool to parse your resumes and
                job descriptions. Not only that, you can use our ranking system
                to compare and rank your resumes against a job description of
                your choosing.
              </p>
            </div>
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <span style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Useful Links
                </span>
              </h6>
              <p>
                <Link
                  to="/"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  What is it?
                </Link>
              </p>
              <p>
                <Link
                  to="/intro"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  How does it work?
                </Link>
              </p>
              <p>
                <a
                  href="https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume-with-examples"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  How to write resumes?
                </a>
              </p>
              <p>
                <a
                  href="https://www.wright.edu/human-resources/writing-an-effective-job-description"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  How to write job descriptions?
                </a>
              </p>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <span style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Our Features
                </span>
              </h6>
              <p>
                <Link
                  to="/parse-resume"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  Parse Resumes
                </Link>
              </p>
              <p>
                <Link
                  to="/parse-job"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  Parse Job Descriptions
                </Link>
              </p>
              <p>
                <Link
                  to="/rank"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  Rank Resumes
                </Link>
              </p>
            </div>
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <span style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Contact
                </span>
              </h6>
              <p style={{ fontFamily: "'Barlow', sans-serif" }}>
                <img
                  src="/images/map.png"
                  height="25"
                  width="20"
                  style={{ opacity: 0.5 }}
                  alt="map"
                />{" "}
                Lamachaur, Pokhara-16
              </p>
              <p>
                <Link
                  to="/about"
                  className="text-reset"
                  style={{
                    textDecoration: "none",
                    fontFamily: "'Barlow', sans-serif",
                  }}
                >
                  <img
                    src="/images/page.png"
                    height="20"
                    width="20"
                    style={{ opacity: 0.5 }}
                    alt="page"
                  />{" "}
                  About Us
                </Link>
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif" }}>
                <img
                  src="/images/phone.png"
                  height="20"
                  width="20"
                  style={{ opacity: 0.5 }}
                  alt="phone"
                />{" "}
                981234567 
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className="text-center p-4"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        © 2025 Copyright:
        <a className="text-reset" style={{ textDecoration: "none" }} href="#">
          <span
            style={{ fontWeight: "bold", fontFamily: "'Barlow', sans-serif" }}
          >
            {" "}
            HireSense
          </span>
        </a>
      </div>
    </footer>
  );
}
