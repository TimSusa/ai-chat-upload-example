import { ChangeEvent, useState } from "react";
import axios from "axios";

export const PdfUploaderWithQuestion = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !question) {
      setUploadStatus("Please select a PDF file and enter a question.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      const response = await axios.post(
        `http://localhost:${3001}/upload`,
        {
          question: question,
          file: Array.from(new Uint8Array(arrayBuffer)), // Converts Buffer to JSON-compatible format
        }
      );

      if (response.status === 200) {
        setUploadStatus("File and question uploaded successfully!");
      } else {
        setUploadStatus("Error during upload.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Error during upload.");
    }
  };

  return (
    <div>
      <h1>PDF Upload with Question</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter your question"
        value={question}
        onChange={handleQuestionChange}
      />
      <button onClick={handleUpload}>Upload with Question</button>
      <p>{uploadStatus}</p>
    </div>
  );
};
