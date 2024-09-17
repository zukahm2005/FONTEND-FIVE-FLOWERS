import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import './ScreenshotPage.css';

const ScreenshotPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screenshotUrl = location.state?.screenshotUrl;
  const [uploadedUrl, setUploadedUrl] = useState(null);

  // Upload the image to Cloudinary
  const uploadToCloudinary = async (base64Image) => {
    const cloudName = 'ddrgrnsex'; // Your Cloudinary cloud name
    const uploadPreset = 'share img'; // Your upload preset

    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Use useEffect to handle async logic
  useEffect(() => {
    if (screenshotUrl) {
      const uploadScreenshot = async () => {
        const url = await uploadToCloudinary(screenshotUrl);
        setUploadedUrl(url);
      };

      uploadScreenshot();
    }
  }, [screenshotUrl]);

  // Handle case where there is no screenshot URL
  if (!screenshotUrl) {
    return <p>Không có ảnh chụp màn hình để hiển thị.</p>;
  }

  return (
    <div className="screenshot-container">
      <h3>Screenshot</h3>
      <img src={screenshotUrl} alt="Screenshot" />

      <div className="share-button">
        <FacebookShareButton url={uploadedUrl} quote="Check out my map screenshot!">
          <button>Share on Facebook</button>
        </FacebookShareButton>

        <TwitterShareButton url={uploadedUrl} title="Check out my map screenshot!">
          <button>Share on Twitter</button>
        </TwitterShareButton>

        <WhatsappShareButton url={uploadedUrl} title="Check out my map screenshot!">
          <button>Share on WhatsApp</button>
        </WhatsappShareButton>
      </div>

      <div className="download-button">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = screenshotUrl; // Use screenshotUrl for download
            link.download = 'map-screenshot.png'; // Name of the downloaded file
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
