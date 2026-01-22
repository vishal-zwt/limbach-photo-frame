import { useRef, useState } from "react";

export default function Home() {
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 1080;
    canvas.height = 1920;

    const frame = new Image();
    frame.src = "/frame.png";

    const userImg = new Image();
    userImg.src = image;
    userImg.crossOrigin = "anonymous";

    await Promise.all([
      new Promise((res) => (frame.onload = res)),
      new Promise((res) => (userImg.onload = res)),
    ]);

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw user photo (FIXED)
    drawCoverImage(ctx, userImg, 70, 1120, 470, 560);

    // Draw frame
    ctx.drawImage(frame, 0, 0, 1080, 1920);

    // Draw name (FIXED)
    ctx.font = "700 52px 'Noto Serif Gujarati'";
    ctx.fillStyle = "#7a1e00";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 540, 1570);

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
