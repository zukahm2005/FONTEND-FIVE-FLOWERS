import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';

const ScreenshotPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screenshotUrl = location.state?.screenshotUrl;

  if (!screenshotUrl) {
    return <p>Không có ảnh chụp màn hình để hiển thị.</p>;
  }

  return (
    <div>
      <h3>Ảnh chụp màn hình</h3>
      <img src={screenshotUrl} alt="Screenshot" style={{ width: '100%', maxWidth: '700px' }} />
      
      <div style={{ marginTop: '10px' }}>
        <h4>Chia sẻ ảnh này:</h4>

        <FacebookShareButton url={screenshotUrl}>
          <button>Chia sẻ trên Facebook</button>
        </FacebookShareButton>

        <TwitterShareButton url={screenshotUrl}>
          <button>Chia sẻ trên Twitter</button>
        </TwitterShareButton>

        <WhatsappShareButton url={screenshotUrl}>
          <button>Chia sẻ qua WhatsApp</button>
        </WhatsappShareButton>
      </div>

      {/* Nút tải xuống ảnh */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = screenshotUrl;
            link.download = 'map-screenshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <span style={{ marginRight: '8px' }}>📥</span> Tải xuống ảnh
        </button>
      </div>

      {/* Nút quay lại trang DistanceTracker */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default ScreenshotPage;
