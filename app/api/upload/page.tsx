"use client";

import React, { useState } from "react";
import FileUpload from "@/app/components/FileUpload";

const UploadVideoPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState<number | null>(null);

  const handleVideoUploadSuccess = (res: any) => {
    setVideoUrl(res.url);
  };

  const handlePublish = async () => {
    if (!title || !description || !videoUrl) {
      alert("Please fill in all fields and upload a video.");
      return;
    }

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, videoUrl }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to publish video");

      alert("Video published successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setProgress(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Video</h1>

      <label className="block font-medium mb-1">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered w-full mb-4"
        placeholder="Enter video title"
      />

      <label className="block font-medium mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered w-full mb-4"
        placeholder="Enter description"
      />

      <FileUpload
        fileType="video"
        onSuccess={handleVideoUploadSuccess}
        onProgress={(value) => setProgress(value)}
      />

      {progress !== null && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {videoUrl && (
        <button onClick={handlePublish} className="btn btn-primary w-full mt-4">
          Publish Video
        </button>
      )}
    </div>
  );
};

export default UploadVideoPage;
