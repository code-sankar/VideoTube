import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import defaultLogo from "../assets/logo.png";

function Logo({ className, logoSrc, title, imageSize, textSize, linkTo }) {
  return (
    <Link to={linkTo} className={`flex items-center ${className}`}>
      <img
        src={logoSrc || defaultLogo}
        alt="logo"
        className={`inline-block mr-2 ${imageSize}`}
      />
      <div className={`font-bold ${textSize} text-white`}>{title}</div>
    </Link>
  );
}

// Default Props
Logo.defaultProps = {
  className: "",
  logoSrc: defaultLogo,
  title: "Video Tube",
  imageSize: "w-10 h-10",
  textSize: "text-xl",
  linkTo: "/",
};

// Prop Validation
Logo.propTypes = {
  className: PropTypes.string,
  logoSrc: PropTypes.string,
  title: PropTypes.string,
  imageSize: PropTypes.string,
  textSize: PropTypes.string,
  linkTo: PropTypes.string,
};

export default Logo;
