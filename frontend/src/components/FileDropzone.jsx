import { useState, useRef } from 'react';

export default function FileDropzone({ onFilesSelected, multiple = false, accept = ".pdf,.docx,.txt" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    // Filter by allowed types if needed, though 'accept' attribute handles it for dialog
    const validFiles = multiple ? files : [files[0]];
    setSelectedFiles(validFiles);
    onFilesSelected(multiple ? validFiles : validFiles[0]);
  };

  return (
    <div 
      className={`dropzone ${isDragging ? 'dragging' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden-input"
        style={{ display: 'none' }}
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
      />
      
      <div className="dropzone-icon">
        {selectedFiles.length > 0 ? '📄' : '📁'}
      </div>
      
      <div className="dropzone-text">
        {selectedFiles.length > 0 ? (
          <span><strong>{selectedFiles.length}</strong> file{selectedFiles.length !== 1 ? 's' : ''} selected</span>
        ) : (
          <span>Drag & drop files here or <strong>browse</strong></span>
        )}
      </div>
      
      <div className="dropzone-hint">
        Supported formats: PDF, DOCX, TXT
      </div>

      {selectedFiles.length > 0 && (
        <div className="dropzone-file-list" onClick={(e) => e.stopPropagation()}>
          {selectedFiles.map((f, i) => (
            <div key={i} className="dropzone-file-item">
              <span className="dropzone-file-name" title={f.name}>{f.name}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                {(f.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
