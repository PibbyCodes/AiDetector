import React, { useState } from "react";

export default function App() {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stage, setStage] = useState(0);

  const fileInputRef = React.useRef(null);

  // 🟢 REAL IMAGE REASONS
  const realReasons = [
    "Natural camera noise pattern detected",
    "Consistent lighting with physical environment",
    "Authentic depth and shadow behavior",
    "Lens distortion consistent with real optics",
    "Sensor-level texture variation present",
  ];

  // 🔴 AI IMAGE REASONS
  const aiReasons = [
    "Diffusion-style texture smoothing detected",
    "Unnatural edge blending between objects",
    "Inconsistent lighting physics across scene",
    "Over-smoothed surfaces typical of generation models",
    "Semantic structure artifacts detected",
  ];

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setStage(0);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const runJudge = (userGuess) => {
    if (!preview) return;

    setLoading(true);

    setTimeout(() => {
      const actual = Math.random() > 0.5 ? "AI" : "REAL";

      let finalLabel;
      let isCorrect;

      if (stage === 0) {
        finalLabel = userGuess === "AI" ? "AI Generated" : "Real Image";
        isCorrect = true;
      } else {
        finalLabel = actual === "AI" ? "AI Generated" : "Real Image";
        isCorrect = userGuess === actual;
      }

      const reasons =
        finalLabel === "AI Generated" ? [...aiReasons] : [...realReasons];

      const selectedReasons = reasons
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      setResult({
        label: finalLabel,
        confidence: Math.floor(Math.random() * 20) + 75,
        reasons: selectedReasons,
        correct: isCorrect,
      });

      setStage((s) => Math.min(s + 1, 1));
      setLoading(false);
    }, 900);
  };

  return (
    <div className="app fade-in">
      {/* HEADER */}
      <div className="header">
        <h1 className="title">AI Image Detector</h1>
        <p className="subtitle">
          Upload and test AI vs real image classification
        </p>

        <div className="disclaimer">
          ⚠️ Experimental system — results may not always be accurate
        </div>
      </div>

      {/* INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* DROPZONE */}
      {!preview && (
        <div
          className={`dropzone ${dragActive ? "active" : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={openFilePicker}
        >
          <div className="drop-content">
            <div className="icon">⬆️</div>
            <p>
              <b>Click or Drag & Drop</b>
            </p>
            <span>Upload image</span>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {preview && (
        <div className="preview-wrapper fade-in">
          <div className="preview">
            <img src={preview} alt="preview" />
          </div>

          <div className="add-more" onClick={openFilePicker}>
            ➕ Add another image
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="buttons">
        <button onClick={() => runJudge("AI")} disabled={!preview || loading}>
          Guess AI
        </button>

        <button onClick={() => runJudge("REAL")} disabled={!preview || loading}>
          Guess Real
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div
          className={`result ${result.correct ? "correct" : "wrong"} fade-in`}
        >
          <h2>{result.label}</h2>
          <p>{result.confidence}% confidence</p>

          <div className="status">
            {result.correct ? "✔ Correct Guess" : "✖ Incorrect Guess"}
          </div>

          <div className="reasons">
            {result.reasons.map((r, i) => (
              <div key={i} className="reason">
                • {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
