import React, { useState } from "react";
import { uploadFile } from "../action/uploadFile";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setUploadResult(result);
    } catch (err) {
      console.error(err);
      setUploadResult({ error: "Failed to upload file." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {uploadResult && (
        <div>
          {uploadResult.submission ? (
            <div>
              <p>Upload successful!</p>
              <a href={uploadResult.submission} target="_blank" rel="noreferrer">
                View File
              </a>
            </div>
          ) : (
            <p>Error: {uploadResult.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
