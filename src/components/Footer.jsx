// src/components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="footer" className="py-10">
      {/* Theme-aware, scoped styles */}
      <style>{`
        #footer { transition: background-color .25s ease, color .25s ease; }
        #footer .inner { max-width: 900px; margin: 0 auto; padding: 0 16px; }

        /* Layout */
        #footer .cta-row { display:flex; justify-content:center; gap:24px; margin-bottom:24px; }
        #footer .btn-base { 
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px; 
          border-radius: 8px; 
          font-size: 18px; 
          font-weight: 600;
          cursor: pointer; 
          transition: all .2s ease; 
          border-width: 1px;
          min-height: 48px; 
          line-height: 1;    /* prevent vertical drift */
          text-align: center;
        }

        #footer .socials { display:flex; justify-content:center; gap:24px; list-style:none; padding:0; margin:0 0 16px 0; }
        #footer .icons .icon.round { 
          width:56px; height:56px; 
          display:inline-flex; align-items:center; justify-content:center;
          border-radius:9999px; font-size:22px; transition: all .2s ease;
        }

        /* ---------- DARK THEME ---------- */
        html[data-theme="dark"] #footer { background:#000; color:#fff; }
        html[data-theme="dark"] #footer .btn-login { 
          background:#000; color:#fff !important; border:1px solid #fff; 
        }
        html[data-theme="dark"] #footer .btn-login:hover { background:#111; }
        html[data-theme="dark"] #footer .btn-signup { 
          background:#fff; color:#000 !important; border:1px solid #000; 
        }
        html[data-theme="dark"] #footer .btn-signup:hover { background:#f3f4f6; }
        html[data-theme="dark"] #footer .icons .icon.round { background:#1f2937; color:#fff; }
        html[data-theme="dark"] #footer .icons .icon.round:hover { background:#374151; }
        html[data-theme="dark"] #footer .copyright { color:#9ca3af; text-align:center; }

        /* ---------- LIGHT THEME ---------- */
        html[data-theme="light"] #footer { background:#f7f7f7; color:#111; }
        html[data-theme="light"] #footer .btn-login { 
          background:#fff; color:#000 !important; border:1px solid #000; 
        }
        html[data-theme="light"] #footer .btn-login:hover { background:#f3f4f6; }
        html[data-theme="light"] #footer .btn-signup { 
          background:#000; color:#fff !important; border:1px solid #000; 
        }
        html[data-theme="light"] #footer .btn-signup:hover { background:#111; }
        html[data-theme="light"] #footer .icons .icon.round { background:#e5e7eb; color:#111; }
        html[data-theme="light"] #footer .icons .icon.round:hover { background:#d1d5db; }
        html[data-theme="light"] #footer .copyright { color:#4b5563; text-align:center; }
      `}</style>

      <div className="inner flex flex-col items-center">
        {/* Buttons */}
        <div className="cta-row">
          <button
            onClick={() => navigate("/login")}
            className="btn-base btn-login"
            type="button"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="btn-base btn-signup"
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Social icons (template classes preserved) */}
        <ul className="icons socials">
          <li>
            <a href="#" className="icon round fa-twitter" aria-label="Twitter">
              <span className="label">Twitter</span>
            </a>
          </li>
          <li>
            <a href="#" className="icon round fa-facebook" aria-label="Facebook">
              <span className="label">Facebook</span>
            </a>
          </li>
          <li>
            <a href="#" className="icon round fa-instagram" aria-label="Instagram">
              <span className="label">Instagram</span>
            </a>
          </li>
        </ul>

        {/* Copyright */}
        <div className="copyright text-sm">
          <p>All copyrights reserved 2025.</p>
        </div>
      </div>
    </footer>
  );
}
