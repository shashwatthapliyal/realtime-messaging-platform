
import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Search,
  UserRound,
  Settings,
  UsersRound,
  LogOut,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

import "../Navbar.css";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchValue.trim()) return;

    // Connect your profile-search API here.
    console.log("Search profile:", searchValue.trim());
  };

  return (
    <header className="glass-navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">
            <Sparkles size={22} />
          </span>
          <span className="logo-text">
            Connect<span className="logo-accent">ly</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="navbar-links">
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Home size={19} strokeWidth={2} />
            <span>Home</span>
          </NavLink>

          {/* Search */}
          <div className="navbar-search" ref={searchRef}>
            {searchOpen && (
              <form
                className="search-form"
                onSubmit={handleSearch}
              >
                <input
                  autoFocus
                  type="search"
                  placeholder="Search profiles..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="Search profiles"
                />

                {searchValue && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearchValue("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            )}

            <button
              className={`nav-icon-btn ${searchOpen ? "selected" : ""}`}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? "Close search" : "Search profiles"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>
        </nav>

        {/* Profile dropdown */}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className={`profile-trigger ${profileOpen ? "selected" : ""}`}
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <span className="profile-avatar">
              <UserRound size={21} />
            </span>
            <span className="profile-label">My Account</span>
            <ChevronDown
              size={16}
              className={`chevron ${profileOpen ? "rotate" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-heading">
                <div className="dropdown-avatar">
                  <UserRound size={22} />
                </div>
                <div>
                  <p className="dropdown-title">My Account</p>
                  <p className="dropdown-subtitle">
                    Manage your account
                  </p>
                </div>
              </div>

              <div className="dropdown-divider" />

              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <UserRound size={18} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/connections"
                className="dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <UsersRound size={18} />
                <span>Connections</span>
              </Link>

              <Link
                to="/settings"
                className="dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout-item"
                onClick={() => {
                  setProfileOpen(false);
                  // Connect your existing logout logic here.
                }}
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
