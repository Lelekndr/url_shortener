import { useState } from "react";
import axios from "axios";
import QRCODEGenerator from "qrcode";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = response.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCODEGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold mb-4 text-center">URL SHORTENER</h1>

      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter the URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleShorten()}
        />
        <button
          className="btn btn-primary w-full"
          onClick={handleShorten}
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner" /> : "Shorten"}
        </button>

        {error && <p className="text-error text-sm text-center">{error}</p>}
      </div>

      {shortUrl && (
        <div className="flex flex-col items-center gap-3 mt-6 w-full max-w-3xl">
          <p className="font-medium">Your shortened URL:</p>

            <a
            className="link link-primary break-all text-center"
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>

          <button
            className={`btn w-full ${copied ? "btn-success" : "btn-secondary"}`}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <div className="bg-white p-4 rounded-lg shadow mt-2">
            <p className="mb-2 text-center font-semibold text-gray-800">
              Scan QR Code
            </p>
            <img src={qrImage} alt="QR Code" className="mx-auto" />
          </div>

            <a
            className="btn btn-accent w-full"
            download="qr-code.png"
            href={qrImage}
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}

export default App;