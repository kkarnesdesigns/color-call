import { useState, useRef } from 'react';
import './ImageUpload.css';

export default function ImageUpload({ onImageLoad, image, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageLoad(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-upload-container">
      {/* Film sprocket holes - left */}
      <div className="sprocket-holes sprocket-left">
        {[...Array(8)].map((_, i) => (
          <div key={`left-${i}`} className="sprocket-hole" />
        ))}
      </div>

      {/* Main upload area */}
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${image ? 'has-image' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        {image ? (
          <img src={image} alt="Uploaded movie still" className="preview-image" />
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="12" stroke="currentColor" strokeWidth="1" />
                <circle cx="32" cy="32" r="4" fill="currentColor" />
              </svg>
            </div>
            <p className="upload-text">Drop a movie still or click to upload</p>
            <p className="upload-formats">PNG, JPG, or WEBP</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="file-input"
          disabled={disabled}
        />
      </div>

      {/* Film sprocket holes - right */}
      <div className="sprocket-holes sprocket-right">
        {[...Array(8)].map((_, i) => (
          <div key={`right-${i}`} className="sprocket-hole" />
        ))}
      </div>
    </div>
  );
}
