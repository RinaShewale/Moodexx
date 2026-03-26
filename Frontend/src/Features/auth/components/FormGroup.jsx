import React from "react";

const FormGroup = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  autoComplete = "off",
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name || label}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type} // supports password toggle
        id={name || label}
        name={name || label} // allows dynamic/random name
        placeholder={placeholder}
        autoComplete={autoComplete} // prevents browser autofill
        required
      />
    </div>
  );
};

export default FormGroup;