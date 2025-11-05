"use client"

import { createCategory } from "@/service/admin/category.service";
import { uploadImages } from "@/service/upload.service"
import { useState } from "react"

export default function TestPage() {
  const [image, setImage] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImage(files);
    }
  }

  const handleUpload = async () => {
    const formData = new FormData();
    image.forEach((file) => {
      formData.append('files', file);
    });
    const urls = await uploadImages(formData);
    setUploadedUrls(urls);
  }

  const handleCreateCategory = async () => {
    const response = await createCategory({
      title: "Test Category"
    })
    console.log("Create Category Response:", response);
  }

  return (
    <>
      <input type="file" multiple accept="image/*"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
      >
        Upload
      </button>

      {uploadedUrls.length > 0 && (
        <div>
          <h3>Uploaded Image URLs:</h3>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleCreateCategory}>Create test category</button>
    </>
  )
}