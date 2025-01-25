import React, { useRef } from "react";
import "./SingleUploader.css";
import { domain } from "../../config/api-urls";

const SingleUploader = ({ image, onChange }) => {
  const uploadRef = useRef();

  const handleBrowse = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  const handleClickContainer = () => {
    uploadRef.current.click();
  };

  const getImgUrl = (img) => {
    if (typeof img === "string") {
      return domain + img
    } else {
      return URL.createObjectURL(img)
    }
  }

  return (
    <div className="singleUploader">
      <div className="upload-container">
        <div className="single-preview-container" onClick={handleClickContainer}>
          {image ? (
            <img
              src={getImgUrl(image)}
              alt="Preview"
              className="preview-image"
            />
          ) : (
            <div className="placeholder-image">+</div>
          )}
        </div>
        <div className="edit-cont">
          <input
            type="file"
            accept="image/*"
            onChange={handleBrowse}
            style={{ display: "none" }}
            ref={uploadRef}
          />
          <button
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering file input dialog
              handleClickContainer();
            }}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
};
export default SingleUploader;
