import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get the current location (route)

  return (
    <nav>
      <Link to="/">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub logo"
          />{" "}
          <h3>CloudGit</h3>
        </div>
      </Link>
      <div>
        {/* Conditionally render the "Create" link */}
        {location.pathname !== "/create" && (
          <Link to="/create">
            <p>Create a Repository</p>
          </Link>
        )}

        {/* Conditionally render the "Profile" link */}
        {location.pathname !== "/profile" && (
          <Link to="/profile">
            <p>Profile</p>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
