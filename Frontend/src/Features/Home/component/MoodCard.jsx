import React from "react";
import PropTypes from "prop-types";
import "../component/style/MoodCard.scss";

const MoodCard = ({ mood, isActive, onClick }) => {
  return (
    <button
      className={`mood-card ${isActive ? "active" : ""}`}
      style={{ background: `var(${mood.colorVar})` }}
      onClick={() => onClick(mood)}
    >
      {mood.name}
    </button>
  );
};

MoodCard.propTypes = {
  mood: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default MoodCard;