import { useState } from "react";
import axios from "axios";
import QRCODEGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setVisible(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = response.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCODEGenerator.toDataURL(newShortUrl, {
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      setQrImage(qr);

      setTimeout(() => setVisible(true), 50);
    } catch (error) {
      console.log("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
           style={{ fontFamily: "'DM Mono', monospace" }}>

        {/* bg glow */}
        <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
             style={{ background: "radial-gradient(circle, rgba(99,211,168,0.07) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-[560px] flex flex-col gap-8">

          {/* header */}
          <div className="flex flex-col gap-2">
            <p className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: "#63d3a8" }}>// utility tool</p>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight m-0"
                style={{ fontFamily: "'Syne', sans-serif", color: "#f0f4f8", letterSpacing: "-0.02em" }}>
              URL <span style={{ color: "#63d3a8" }}>Short</span>ener
            </h1>
            <p className="text-[0.78rem] leading-relaxed m-0" style={{ color: "#4a5568" }}>
              Paste a long URL and get a clean, shareable link instantly.
            </p>
          </div>

          {/* input group */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              className="url-input w-full rounded-[10px] px-4 py-3 text-[0.82rem] outline-none transition-all"
              style={{ background: "#0d1421", border: "1px solid #1e2d45", color: "#e2e8f0", fontFamily: "'DM Mono', monospace" }}
              placeholder="https://your-very-long-url.com/goes/here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            />

            <button
              className="w-full rounded-[10px] py-3 flex items-center justify-center gap-2 font-bold text-[0.85rem] tracking-wide cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#63d3a8", color: "#080c14", fontFamily: "'Syne', sans-serif", border: "none" }}
              onClick={handleShorten}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : "→ Shorten URL"}
            </button>

            {error && (
              <div className="text-[0.75rem] text-center px-4 py-2 rounded-lg"
                   style={{ color: "#f87171", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.15)" }}>
                {error}
              </div>
            )}
          </div>

          {/* result card */}
          {shortUrl && (
            <div className={`result-card flex flex-col gap-5 rounded-[14px] p-6 ${visible ? "show" : ""}`}
                 style={{ background: "#0d1421", border: "1px solid #1e2d45" }}>

              <p className="text-[0.65rem] tracking-[0.15em] uppercase m-0" style={{ color: "#2d4060" }}>
                Your shortened link
              </p>

              <div className="flex items-center justify-between gap-4 rounded-[10px] px-4 py-3"
                   style={{ background: "#080c14", border: "1px solid #1e2d45" }}>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                   className="text-[0.85rem] break-all flex-1 no-underline hover:underline"
                   style={{ color: "#63d3a8" }}>
                  {shortUrl}
                </a>
                <button
                  className="flex-shrink-0 rounded-[7px] px-3 py-1.5 text-[0.72rem] cursor-pointer transition-all"
                  style={{
                    background: copied ? "rgba(99,211,168,0.07)" : "transparent",
                    border: `1px solid ${copied ? "#63d3a8" : "#1e2d45"}`,
                    color: copied ? "#63d3a8" : "#4a5568",
                    fontFamily: "'DM Mono', monospace"
                  }}
                  onClick={handleCopy}
                >
                  {copied ? "✓ copied" : "copy"}
                </button>
              </div>

              <div className="h-px" style={{ background: "#1e2d45" }} />

              <div className="flex items-center gap-6">
                <img src={qrImage} alt="QR Code" className="w-[90px] h-[90px] rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-[0.72rem] leading-relaxed m-0" style={{ color: "#4a5568" }}>
                    Scan with your phone or download the QR code to share offline.
                  </p>
                  <a download="qr-code.png" href={qrImage}
                     className="inline-flex items-center gap-1 rounded-[7px] px-3 py-1.5 text-[0.72rem] no-underline transition-all w-fit hover:opacity-80"
                     style={{ border: "1px solid #1e2d45", color: "#4a5568", fontFamily: "'DM Mono', monospace" }}>
                    ↓ download qr
                  </a>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    
  );
}