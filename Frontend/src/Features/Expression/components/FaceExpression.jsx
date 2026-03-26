import { useEffect, useRef, useState } from "react";
import { detect, init } from "../util";

export default function FaceExpression({ onDetect = () => { } }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });

    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ✅ ONLY button click → no auto trigger
  async function handleClick() {
    const exp = await detect({ landmarkerRef, videoRef, setExpression });
    setExpression(exp);

    if (exp && exp !== "Detecting...") {
      onDetect(exp); // ✅ single call
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "12px",
          boxShadow: "0 0px 16px rgba(255, 255, 255, 0.48)",
          marginBottom: "10px",
        }}
        playsInline
      />

      <h2 style={{ marginBottom: "10px" }}>{expression}</h2>

      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#a855f7",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Detect Expression
      </button>
    </div>
  );
}