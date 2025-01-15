import React, { useId } from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(function Input(
  { label, type, className, className2, ...props },
  ref
) {
  const id = useId(); // Generate a unique ID for accessibility

  return (
    <div className={`w-full ${className2}`}>
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        className={`py-1 bg-zinc-800 text-white outline-none duration-200 border focus:border-blue-800 border-gray-200 w-full ${className}`}
        {...props}
      />
    </div>
  );
});

// Default props for consistent behavior
Input.defaultProps = {
  type: "text",
  className: "",
  className2: "",
};

// Prop validation for type safety
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  className2: PropTypes.string,
};

export default React.memo(Input);
