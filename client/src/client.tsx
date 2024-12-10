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
      setUploadStatus("Bitte wähle eine PDF-Datei aus und gib eine Frage ein.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      const response = await axios.post(
        `http://localhost:${process.env.PORT}/updateAndQuestion`,
        {
          question: question,
          file: Array.from(new Uint8Array(arrayBuffer)), // Konvertiert Buffer in JSON-kompatibles Format
        }
      );

      if (response.status === 200) {
        setUploadStatus("Datei und Frage erfolgreich hochgeladen!");
      } else {
        setUploadStatus("Fehler beim Upload.");
      }
    } catch (error) {
      console.error("Upload-Fehler:", error);
      setUploadStatus("Fehler beim Upload.");
    }
  };

  return (
    <div>
      <h1>PDF-Upload mit Frage</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Deine Frage eingeben"
        value={question}
        onChange={handleQuestionChange}
      />
      <button onClick={handleUpload}>Upload mit Frage</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

