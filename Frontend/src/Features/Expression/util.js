import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1,
    }
  );

  // Start camera
  streamRef.current = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  videoRef.current.srcObject = streamRef.current;

  // Wait until video is fully ready (IMPORTANT 🚀)
  await new Promise((resolve) => {
    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
      resolve();
    };
  });
};

export const detect = ({
  landmarkerRef,
  videoRef,
  setExpression,
}) => {
  const video = videoRef.current;
  const landmarker = landmarkerRef.current;

  if (!video || !landmarker) return;

  if (
    video.readyState < 2 ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return;
  }

  try {
    const results = landmarker.detectForVideo(
      video,
      performance.now()
    );

    if (results.faceBlendshapes?.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

      const smile =
        getScore("mouthSmileLeft") + getScore("mouthSmileRight");
      const jawOpen = getScore("jawOpen");
      const browUp = getScore("browInnerUp");
      const frown =
        getScore("mouthFrownLeft") + getScore("mouthFrownRight");

      let currentExpression = "Neutral 😐";

      if (smile > 1) {
        currentExpression = "happy";
      } else if (jawOpen > 0.4 && browUp > 0.2) {
        currentExpression = "surprised";
      } else if (frown > 0.2) {
        currentExpression = "sad";
      } else if (getScore("browDownLeft") + getScore("browDownRight") > 0.4) {
        currentExpression = "Angry";
      }

      setExpression(currentExpression);
      return currentExpression
    }
  } catch (err) {
    console.warn("Detection error:", err);
  }
};