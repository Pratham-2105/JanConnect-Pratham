// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const getIsDark = () =>
    (document.documentElement.getAttribute("data-theme") || "light") === "dark";

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(getIsDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = isDark ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsDark(!isDark);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur shadow-md">
      {/* Theme-aware styles for header buttons */}
      <style>{`
        /* Login button (transparent in both themes; flip text/border) */
        html[data-theme="dark"] header .header-login-btn {
          background: transparent;
          color: #fff;
          border-color: #fff;
        }
        html[data-theme="light"] header .header-login-btn {
          background: transparent;
          color: #000;
          border-color: #000;
        }

        /* Theme toggle button (transparent circle; flip icon/border) */
        html[data-theme="dark"] header .header-theme-btn {
          background: transparent;
          color: #fff;
          border-color: #fff;
        }
        html[data-theme="light"] header .header-theme-btn {
          background: transparent;
          color: #000;
          border-color: #000;
        }

        /* Optional subtle hover */
        header .header-login-btn:hover,
        header .header-theme-btn:hover {
          background: rgba(127,127,127,0.08);
        }
      `}</style>

      <div className="h-14 px-6 flex items-center justify-between">
        {/* LEFT: Logo + Menu */}
        <div className="flex items-center gap-[12px]">
          <span className="text-xl font-semibold">Jan Connect</span>
          <a
            href="#menu"
            className="inline-flex h-9 items-center justify-center rounded-md px-2
                       border header-theme-btn transition-colors"
            aria-label="Open menu"
            title="Menu"
          >
            <i className="fa fa-bars text-lg" />
          </a>
        </div>

        {/* RIGHT: Login + Theme */}
        <div className="flex items-center gap-[12px]">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex h-9 items-center justify-center rounded-md px-4
                       border header-login-btn transition-colors"
            title="Login"
            type="button"
          >
            Login
          </button>

          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full
                       border header-theme-btn transition-colors"
            aria-label="Toggle theme"
            title="Toggle theme"
            type="button"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
