/// npm install express body-parser @types/express typescript ts-node

import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware: Verarbeitet Rohdaten mit dem MIME-Type "application/pdf"
app.use(express.raw({ type: "application/pdf", limit: "10mb" }));

// Typen für den Endpunkt
interface UploadRequest extends Request {
  body: Buffer; // Rohdaten des PDF als Buffer
}

// Upload-Endpunkt
app.post("/upload", (req: UploadRequest, res: Response): void => {
  try {
    const pdfBuffer: Buffer = req.body; // Binäre Daten des hochgeladenen PDFs
    if (!pdfBuffer || pdfBuffer.length === 0) {
      res.status(400).send("Keine Datei hochgeladen.");
      return;
    }

    // Speicherpfad für die hochgeladene Datei
    const uploadPath: string = path.join(
      __dirname,
      "../uploads",
      `upload-${Date.now()}.pdf`
    );

    // Speichert die Datei lokal
    fs.writeFileSync(uploadPath, pdfBuffer);

    console.log(`Datei erfolgreich gespeichert: ${uploadPath}`);
    res.status(200).send("PDF erfolgreich hochgeladen!");
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Datei:", error);
    res.status(500).send("Fehler beim Hochladen der Datei.");
  }
});

export function startServer() {
  return app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
  });
}
