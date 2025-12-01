import { useState } from "react";
import QRCode from "react-qr-code";
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";

export default function QRTokenCard({ orderId, token }) {
  const [showToken, setShowToken] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopyMsg("📋 Token Copied!");
    setTimeout(() => setCopyMsg(""), 2000);
  };

  return (
    <>
      <div className="qr-card">
        <h3>Order Ready Receipt</h3>

        <div className="info">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p>
            <strong>Pickup Token:</strong> {showToken ? token : "••••••"}
            <button className="eye-btn" onClick={() => setShowToken(!showToken)}>
              {showToken ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
            <button className="copy-btn" onClick={copyToken}>
              <FiCopy size={14} />
            </button>
          </p>
        </div>

        <div className="qr-wrapper">
          <QRCode size={150} value={JSON.stringify({ orderId, token })} />
        </div>

        {copyMsg && <p className="toast">{copyMsg}</p>}
      </div>

      <style>
        {`
          .qr-card {
            background:white;
            padding:20px;
            border-radius:12px;
            box-shadow:0 5px 15px rgba(0,0,0,0.1);
            text-align:center;
            margin-top:15px;
          }

          .info p {
            font-size:14px;
            margin:6px 0;
          }

          .qr-wrapper {
            margin-top:12px;
            display:flex;
            justify-content:center;
          }

          .eye-btn, .copy-btn {
            background:none;
            border:none;
            margin-left:8px;
            cursor:pointer;
            color:#14532d;
          }

          .toast {
            margin-top:10px;
            background:#16a34a;
            color:white;
            padding:6px 12px;
            border-radius:8px;
            display:inline-block;
            font-size:13px;
            animation:fade .3s ease;
          }

          @keyframes fade {
            from { opacity:0; transform:translateY(6px);}
            to { opacity:1; }
          }
        `}
      </style>
    </>
  );
}
