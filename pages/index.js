import { useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [output, setOutput] = useState(null);

  const generateImage = async () => {
    const canvas = canvasRef.current;
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");

    const frame = new Image();
    frame.src = "/frame.png";

    const userImg = new Image();
    userImg.src = image;

    await Promise.all([
      new Promise((res) => (frame.onload = res)),
      new Promise((res) => (userImg.onload = res)),
    ]);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // USER PHOTO POSITION (tuned for your frame)
    ctx.drawImage(userImg, 90, 1040, 420, 520);

    // FRAME OVERLAY
    ctx.drawImage(frame, 0, 0, 1080, 1920);

    // NAME TEXT
    ctx.font = "600 46px 'Noto Serif Gujarati'";
    ctx.fillStyle = "#7a1e00";
    ctx.textAlign = "center";
    ctx.fillText(name, 540, 1650);

    setOutput(canvas.toDataURL("image/png"));
  };

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: 20, textAlign: "center" }}>
      <h2>🙏 પ્રાણપ્રતિષ્ઠા મહોત્સવ 🙏</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setImage(reader.result);
          reader.readAsDataURL(file);
        }}
      />

      <br /><br />

      <input
        type="text"
        placeholder="તમારું નામ લખો"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <br /><br />

      <button
        onClick={generateImage}
        disabled={!image || !name}
        style={{
          padding: "12px 20px",
          background: "#7a1e00",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        ફોટો બનાવો
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {output && (
        <>
          <br /><br />
          <img src={output} style={{ width: "100%", borderRadius: 10 }} />
          <br /><br />
          <a href={output} download="pran-pratistha.png">
            ⬇️ Download Image
          </a>
        </>
      )}
    </div>
  );
}
