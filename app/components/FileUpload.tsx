"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-react";
import "remixicon/fonts/remixicon.css";

// ✅ Define UploadResponse type based on typical ImageKit response
type UploadResponse = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  height?: number;
  width?: number;
  size?: number;
  filePath?: string;
  isPrivateFile?: boolean;
  [key: string]: unknown;
};

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string; help?: string; code?: string }) => {
    console.error("Upload error:", err);
    setError(err.message);
    setUploading(false);
  };

  const handleSuccess = (res: UploadResponse) => {
    console.log("Upload success:", res);
    setUploading(false);
    setError(null);
    onSuccess(res);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };

  const handleStartUpload = () => {
    setUploading(true);
    setError(null);
  };

  const validateFile = (file: File): boolean => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less than 100 MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid file (JPEG, PNG, WebP)");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5 MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={`${fileType}-${Date.now()}`}
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        onUploadProgress={handleProgress}
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="file-input file-input-bordered w-full"
        validateFile={validateFile}
        useUniqueFileName={true}
        folder={fileType === "video" ? "/videos" : "/images"}
        transformation={{
          pre: "l-text,i-Imagekit,fs-50,l-end",
          post: [{ type: "transformation", value: "w-100" }],
        }}
      />

      {uploading && (
        <div className="flex items-center gap-2 text-blue-500 text-sm">
          <i className="ri-loader-4-line animate-spin text-xl" />
          Uploading...
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FileUpload;
