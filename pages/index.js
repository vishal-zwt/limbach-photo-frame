import { useRef, useState } from "react";
import dynamic from "next/dynamic";

function Home() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [output, setOutput] = useState(null);

  const drawCoverImage = (ctx, img, x, y, w, h) => {
    const ratio = Math.max(w / img.width, h / img.height);
    const nw = img.width * ratio;
    const nh = img.height * ratio;
    const nx = x + (w - nw) / 2;
    const ny = y + (h - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  };

  const generateImage = async () => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 656;
    canvas.height = 928;

    const frame = new Image();
    frame.src = "/frame.png";

    const userImg = new Image();
    userImg.src = image;
    userImg.crossOrigin = "anonymous";

    await Promise.all([
      new Promise((res) => (frame.onload = res)),
      new Promise((res) => (userImg.onload = res)),
    ]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // USER PHOTO
    drawCoverImage(ctx, userImg, 0, 765, 155, 165);

    // FRAME
    ctx.drawImage(frame, 0, 0, 656, 928);

    // NAME
    ctx.font = "700 40px 'Noto Serif Gujarati'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 400, 900);

    setOutput(canvas.toDataURL("image/png"));
  };

  return (
    <div style={{ maxWidth: 420, margin: "auto", padding: 20, textAlign: "center" }}>
      <h2>🚩 લિંબચ ધામ અંતિસરા 🚩<br/>
     પ્રાણ પ્રતિષ્ઠા મહોત્સવ <br/>
આપનો ફોટો પોસ્ટ કરો અને શેર કરો</h2>

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
          cursor: "pointer",
        }}
      >
        ફોટો બનાવો
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {output && (
        <>
          <br /><br />
          <img src={output} width={656} height={928} style={{ borderRadius: 10 }} />
          <br /><br />
          <a href={output} download="pran-pratistha.png">
            ⬇️ Download Image
          </a>
        </>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
