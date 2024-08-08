import { motion } from "framer-motion";
import React, { useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import ReactModal from "react-modal";
import "./videoHome.scss";

ReactModal.setAppElement("#root");

const VideoHome = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="video-container">
      <div className="image-video-home">
        <img
          src="https://bikex-club.myshopify.com/cdn/shop/files/img-3_4cc2f418-f105-44c5-a184-74407a766cb0_2000x_1.jpg?v=1614290805"
          alt="Video Thumbnail"
        />
      </div>
      <div className="video-banner-content">
        <div className="video-banner-inner">
          <div className="video-icon" onClick={openModal}>
            <motion.div
              className="icon-overlay"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <CiPlay1 className="icon-video-play" />
          </div>
          <div className="video-title">
            <p>Watch Video</p>
          </div>
        </div>
      </div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="video-modal"
        overlayClassName="video-modal-overlay"
      >
        <button onClick={closeModal} className="close-modal-btn">
          <IoMdClose />
        </button>
        <div className="video-wrapper">
          <iframe
          
            src="https://www.youtube.com/embed/JJMPKgyCoSY"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </ReactModal>
    </div>
  );
};

export default VideoHome;
