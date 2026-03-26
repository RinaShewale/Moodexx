import React from 'react'

const FormGroup = ({ label, placeholder, value, onChange, type }) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>

      <input
        type={type || "text"}   // 🔥 dynamic type (important)
        id={label}
        name={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  )
}

export default FormGroup