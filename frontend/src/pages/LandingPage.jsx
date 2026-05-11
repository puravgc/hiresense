import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "🧠",
    title: "NER-Powered Parsing",
    desc: "Our custom spaCy model extracts skills, experience, education, and more from any resume format.",
  },
  {
    icon: "🏆",
    title: "Instant Ranking",
    desc: "Upload a job description and dozens of resumes — get a ranked shortlist in seconds, not hours.",
  },
  {
    icon: "⚖️",
    title: "Customizable Weights",
    desc: "Tune how much each factor — skills, experience, education — counts toward the final score.",
  },
  {
    icon: "✉️",
    title: "One-Click Outreach",
    desc: "Send a professional interview invitation directly to a candidate without leaving the dashboard.",
  },
  {
    icon: "🔒",
    title: "Secure Google Login",
    desc: "Sign in instantly with your Google account. No passwords to remember.",
  },
  {
    icon: "📊",
    title: "Transparent Scores",
    desc: "See a detailed breakdown per candidate — skill match, experience match, education match.",
  },
];

const STATS = [
  { value: "10×", label: "Faster screening" },
  { value: "95%", label: "Accuracy on key fields" },
  { value: "∞", label: "Resumes per session" },
];

export default function LandingPage() {
  const { user, hasProfile, loading } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Redirect logged-in users who already have a profile
  useEffect(() => {
    if (!loading && user && hasProfile)
      navigate("/dashboard", { replace: true });
    if (!loading && user && !hasProfile)
      navigate("/onboarding", { replace: true });
  }, [loading, user, hasProfile, navigate]);

  // Subtle animated dot grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let width, height;
    const dots = [];
    const NUM = 60;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const initDots = () => {
      dots.length = 0;
      for (let i = 0; i < NUM; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Draw connection lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(108,99,255,${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${d.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    initDots();
    draw();
    window.addEventListener("resize", () => {
      resize();
      initDots();
    });
    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/google-login";
  };

  if (loading) return null;

  return (
    <div className="lp-root">
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="lp-canvas" />

      {/* ─── NAV ─── */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">
          <img
            src="/images/skillSync7.png"
            alt="HireSense"
            className="lp-nav-logo"
          />
          <span>HireSense</span>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="lp-hero">
        <div className="lp-badge">✦ AI-Powered Resume Ranking</div>
        <h1 className="lp-headline">
          Hire smarter,
          <br />
          <span className="lp-gradient-text">not harder.</span>
        </h1>
        <p className="lp-sub">
          HireSense uses NER-based AI to parse, score, and rank resumes against
          your job description — so you spend time interviewing the right
          people, not sifting through stacks of paper.
        </p>
        <div className="lp-ctas">
          <button
            id="hero-get-started-btn"
            className="lp-btn primary"
            onClick={handleLogin}
          >
            <span className="lp-google-icon">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.1-2.7-.4-3.9z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16.1 19.1 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.6 16.3 40 24 40v4z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.2-4.2 5.6l6.2 5.2C36.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.9z"
                />
              </svg>
            </span>
            Get Started Free
          </button>
          <a href="#features" className="lp-btn secondary">
            See How It Works ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="lp-stats">
          {STATS.map((s) => (
            <div className="lp-stat" key={s.label}>
              <span className="lp-stat-val">{s.value}</span>
              <span className="lp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="lp-features" id="features">
        <div className="lp-section-badge">Features</div>
        <h2 className="lp-section-title">
          Everything a modern recruiter needs
        </h2>
        <p className="lp-section-sub">
          From parsing to outreach — your entire shortlisting workflow in one
          place.
        </p>
        <div className="lp-feature-grid">
          {FEATURES.map((f, i) => (
            <div
              className="lp-feature-card"
              key={i}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="lp-how">
        <div className="lp-section-badge">How it works</div>
        <h2 className="lp-section-title">Simple. Fast. Powerful.</h2>
        <div className="lp-steps">
          {[
            {
              n: "01",
              title: "Upload Job Description",
              desc: "Drop in your JD as a PDF, DOCX, or TXT.",
            },
            {
              n: "02",
              title: "Upload Resumes",
              desc: "Add as many candidate resumes as you have.",
            },
            {
              n: "03",
              title: "Get Ranked Results",
              desc: "AI scores and ranks every candidate instantly.",
            },
            {
              n: "04",
              title: "Email Top Candidates",
              desc: "Send interview invites directly from HireSense.",
            },
          ].map((s, i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-num">{s.n}</div>
              <div className="lp-step-body">
                <h4 className="lp-step-title">{s.title}</h4>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
              {i < 3 && <div className="lp-step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BOTTOM ─── */}
      <section className="lp-cta-bottom">
        <div className="lp-cta-glow" />
        <h2 className="lp-cta-title">Ready to hire smarter?</h2>
        <p className="lp-cta-sub">
          Join and set up your hiring profile in under 2 minutes.
        </p>
        <button
          id="bottom-get-started-btn"
          className="lp-btn primary large"
          onClick={handleLogin}
        >
          <span className="lp-google-icon">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.3-.1-2.7-.4-3.9z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 16.1 19.1 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.6 16.3 40 24 40v4z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.2-4.2 5.6l6.2 5.2C36.9 36.7 44 31 44 24c0-1.3-.1-2.7-.4-3.9z"
              />
            </svg>
          </span>
          Get Started with Google
        </button>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <span>© 2025 HireSense — NER-based Resume Ranking System</span>
      </footer>
    </div>
  );
}
