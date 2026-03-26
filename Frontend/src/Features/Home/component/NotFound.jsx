import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style/notfound.scss";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="futuristic-404">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn’t exist or has been moved.</p>

        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} /> Go Home
        </button>
      </div>
    </div>
  );
}