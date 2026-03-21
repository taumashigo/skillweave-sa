"use client";

import { useState } from "react";

interface UploadResult {
  success: boolean;
  path: string;
  url: string;
  name: string;
  size: number;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, purpose = "general"): Promise<UploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("purpose", purpose);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Upload failed");
        setUploading(false);
        return null;
      }

      const result = await response.json();
      setUploading(false);
      return result as UploadResult;
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploading(false);
      return null;
    }
  };

  return { upload, uploading, error };
}
