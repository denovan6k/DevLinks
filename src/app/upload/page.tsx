"use client";

import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imagedb } from "../../../firebase";
import { v4 as uuidv4 } from 'uuid';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [uploading, setUploading] = useState<boolean>(false); // State to indicate the upload status
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // State to store the uploaded image URL

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Set the selected file
    }
  };

  const handleUpload = async () => {
    if (!file) return; // Return if no file is selected

    setUploading(true); // Set uploading state to true
    const uniqueFileName = `${uuidv4()}-${file.name}`; // Create a unique file name using UUID
    const storageRef = ref(imagedb, `images/${uniqueFileName}`); // Create a reference to the file in Firebase Storage

    try {
      await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
      const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
      setUploadedUrl(url); // Set the uploaded image URL
      console.log("File Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading the file", error);
    } finally {
      setUploading(false); // Set uploading state to false
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} /> {/* File input to select the image */}
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Image"} {/* Button to upload the image */}
      </button>
      {uploadedUrl && (
        <div>
          <p>Uploaded image:</p>
          <div style={{ position: "relative", width: "100%", height: "300px" }}>
            <Image
              src={uploadedUrl}
              alt="Uploaded image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
