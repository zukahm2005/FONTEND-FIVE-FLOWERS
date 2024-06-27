import React from "react";
import { Link } from "react-router-dom";
import "./error.scss";

const Error = () => {
  return (
    <div className="error-container">
      <div className="notifi-error">
        <p>404 - Page Not Found</p>
      </div>
      <div className="return-error">
        <Link to="/">
          <button>
            <p>BACK TO HOME</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Error;
