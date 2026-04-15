import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Banner Section */}
      <div className="position-relative">
        <img src="/images/ban1.jpg" className="img-fluid w-100" alt="Banner" />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
          <img
            src="/images/skillSync6.png"
            style={{ width: "300px" }}
            alt="HireSense Logo"
          />
          <p
            style={{
              color: "black",
              fontSize: "20px",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            NER based resume ranking system
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="jumbotron" style={{ marginBottom: 0 }}>
        <p
          style={{
            color: "black",
            fontSize: "30px",
            fontFamily: "'Barlow', sans-serif",
            textAlign: "center",
          }}
        >
          Welcome to the HireSense Home Page!
        </p>
        <hr />
        <p
          style={{
            color: "black",
            fontSize: "18px",
            fontFamily: "'Barlow', sans-serif",
            textAlign: "justify",
          }}
        >
          If you've somehow landed on this page, you might be wondering what
          "HireSense" actually is. Well, this page answers it all. Basically,
          HireSense is a NER based resume ranking system. End of story. Huh?
          What's that? You need more info? Well if you insist, then I suppose
          I'll tell you.
        </p>
        <p
          style={{
            color: "black",
            fontSize: "18px",
            fontFamily: "'Barlow', sans-serif",
            textAlign: "justify",
          }}
        >
          HireSense is a system that allows users to upload job description
          along with multiple resumes. The system then uses a custom NER model
          to extract important features from the job description and resumes.
          The features from each resumes are compared against the features of
          the job description. Overall match scores between the resumes and the
          job description are calculated and based on these scores the resumes
          are ranked. HireSense offers a seamless and user friendly interface
          for these functionalities and abstracts the complex inner workings of
          the system from the user. But not only that, HireSense has features
          that allow users to parse their resumes and job description.
        </p>
        <p
          style={{
            color: "black",
            fontSize: "18px",
            fontFamily: "'Barlow', sans-serif",
            textAlign: "justify",
          }}
        >
          In this modern world where the number of jobs and potential candidates
          are increasing day by day, companies require an automated tool that
          allows them to shortlist hundreds and thousands of resumes. Manual
          screening introduces error, human bias and is tedious and time
          consuming. With the help of HireSense companies can efficiently screen
          through numerous resumes quickly and with little to no resources. All
          you need is a stable internet connection to access and use this
          application. Aside from the corporate environment, you as an
          individual can use this application to parse their resumes to get
          insight into their skillset in a structured format. This allows them
          to tweak their resumes to best fit the job that they are applying for,
          hence increasing their chances of getting hired.
        </p>
        <p
          style={{
            color: "black",
            fontSize: "18px",
            fontFamily: "'Barlow', sans-serif",
            textAlign: "justify",
          }}
        >
          What's that? You say you're head hurts from all the information dump.
          You're the one who asked for it, you know. Oh, you also want to know
          how it works? Well then, head over to the{" "}
          <Link
            to="/intro"
            className="text-reset"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            instruction page
          </Link>
          .
        </p>
      </div>

      {/* Carousel */}
      <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[
            "resume1.jpg",
            "resume2.jpg",
            "resume3.jpg",
            "resume4.jpg",
            "resume5.jpg",
          ].map((img, i) => (
            <div
              className={`carousel-item ${i === 0 ? "active" : ""}`}
              key={img}
            >
              <img
                src={`/images/${img}`}
                className="d-block w-100"
                alt={`slide ${i + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}
