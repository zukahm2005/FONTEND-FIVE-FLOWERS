import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import './SecreenshotPage.css';

const ScreenshotPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screenshotUrl = location.state?.screenshotUrl;
  const download = location.state?.download;

  if (!screenshotUrl) {
    return <p>Không có ảnh chụp màn hình để hiển thị.</p>;
  }

  return (
    <div className="screenshot-container">
      <h3>Screenshot</h3>
      <img src={screenshotUrl} alt="Screenshot" />

      <div className="share-button">
        <FacebookShareButton url={screenshotUrl} quote="Check out my map screenshot!">
          <button>Share on Facebook</button>
        </FacebookShareButton>

        <TwitterShareButton url={screenshotUrl} title="Check out my map screenshot!">
          <button>Share on Twitter</button>
        </TwitterShareButton>

        <WhatsappShareButton url={screenshotUrl} title="Check out my map screenshot!">
          <button>Share on WhatsApp</button>
        </WhatsappShareButton>
      </div>

      <div className="download-button">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = download;
            link.download = 'map-screenshot.png'; // Tên file khi tải xuống
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <span>📥</span> Download Image
        </button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ScreenshotPage;
