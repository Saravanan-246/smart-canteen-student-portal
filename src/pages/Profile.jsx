import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth(); // logged-in student

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Student",
    image: "",
  });

  const [lastUpdated, setLastUpdated] = useState("");

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else if (user?.email) {
      // first time → prefill email
      setProfile((p) => ({ ...p, email: user.email }));
    }

    const savedTime = localStorage.getItem("studentProfileUpdatedAt");
    if (savedTime) setLastUpdated(savedTime);
  }, [user]);

  // Save profile
  const handleSave = () => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
    const time = new Date().toLocaleString();
    localStorage.setItem("studentProfileUpdatedAt", time);
    setLastUpdated(time);
  };

  // Image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-card">
          <header className="profile-header">
            <h1>Student Profile</h1>
            <p>Manage your personal details</p>
          </header>

          <div className="profile-layout">
            {/* Profile Image */}
            <div className="image-wrapper">
              <div className="avatar-ring">
                <img
                  src={profile.image || "https://via.placeholder.com/120"}
                  alt="profile"
                  className="profile-img"
                />
              </div>
              <label className="upload-btn">
                Change Photo
                <input type="file" hidden onChange={handleImage} />
              </label>
              <span className="image-hint">Recommended: square image, 1:1</span>
            </div>

            {/* Inputs */}
            <div className="form">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="readonly"
                />
              </div>

              <div className="field">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Role</label>
                <input
                  type="text"
                  value={profile.role}
                  readOnly
                  className="readonly"
                />
              </div>

              <div className="actions-row">
                <button className="save-btn" onClick={handleSave}>
                  Save Profile
                </button>
              </div>

              {lastUpdated && (
                <p className="saved-info">
                  Profile last updated on <span>{lastUpdated}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS: Orange + White theme */}
      <style>{`
        .profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 40%, #FFCC80 100%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .profile-card {
          width: 100%;
          max-width: 860px;
          background: #ffffff;
          border-radius: 24px;
          padding: 24px 26px 26px;
          border: 1px solid #ffe0b2;
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(255, 243, 224, 0.8);
          color: #111827;
          animation: fade-in 0.35s ease-out;
        }

        .profile-header {
          border-bottom: 1px solid #ffe0b2;
          padding-bottom: 16px;
          margin-bottom: 22px;
        }

        .profile-header h1 {
          margin: 0 0 4px 0;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #1f2933;
        }

        .profile-header p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 24px;
          align-items: flex-start;
        }

        .image-wrapper {
          text-align: center;
        }

        .avatar-ring {
          width: 136px;
          height: 136px;
          border-radius: 999px;
          margin: 0 auto 14px;
          padding: 3px;
          background: conic-gradient(
            from 180deg,
            #ff9800,
            #ffb74d,
            #ff7043,
            #ff9800
          );
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-img {
          width: 124px;
          height: 124px;
          border-radius: 999px;
          object-fit: cover;
          background: #f9fafb;
          border: 2px solid #ffffff;
        }

        .upload-btn {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          background: #fff3e0;
          color: #f97316;
          border-radius: 999px;
          cursor: pointer;
          font-size: 13px;
          border: 1px solid #ffcc80;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: #ffe0b2;
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(249, 115, 22, 0.2);
        }

        .image-hint {
          display: block;
          margin-top: 6px;
          font-size: 11px;
          color: #9ca3af;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .field input {
          padding: 11px 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          background: #f9fafb;
          color: #111827;
          outline: none;
          transition: all 0.18s ease;
        }

        .field input::placeholder {
          color: #9ca3af;
        }

        .field input:focus {
          border-color: #ff9800;
          box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.8);
          background: #ffffff;
        }

        .readonly {
          background: #f3f4f6;
          color: #6b7280;
          border-style: dashed;
        }

        .actions-row {
          margin-top: 8px;
          display: flex;
          justify-content: flex-end;
        }

        .save-btn {
          background: linear-gradient(135deg, #ff9800, #f97316);
          color: white;
          padding: 11px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 12px 25px rgba(249, 115, 22, 0.45);
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(249, 115, 22, 0.55);
        }

        .save-btn:active {
          transform: translateY(0);
          box-shadow: 0 8px 18px rgba(249, 115, 22, 0.4);
        }

        .saved-info {
          margin-top: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .saved-info span {
          color: #111827;
          font-weight: 500;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 20px;
          }

          .profile-layout {
            grid-template-columns: 1fr;
          }

          .image-wrapper {
            margin-bottom: 8px;
          }

          .actions-row {
            justify-content: stretch;
          }

          .save-btn {
            width: 100%;
            justify-content: center;
            display: inline-flex;
          }
        }
      `}</style>
    </>
  );
}
