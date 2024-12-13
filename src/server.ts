import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { setupSSE } from "./sse";

const app = express();
const PORT = process.env.PORT || 3000;

export const corsOptions = {
  origin: ["http://localhost:8080", /\.teamitgroup\.fi$/],
  optionsSuccessStatus: 200,
};

// Middleware: Processes raw data with the MIME-Type "application/json"
app.use(express.json({ limit: "10mb" }));
app.options(`/upload`, cors(corsOptions));

// Types for the endpoint
interface PdfUploadRequest extends Request {
  body: {
    question: string;
    file: Buffer; // Buffer type for the file
  };
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Upload endpoint
app.post(
  "/upload",
  cors(corsOptions),
  (req: PdfUploadRequest, res: Response): void => {
    console.log("Upload endpoint called");
    try {
      const { question, file } = req.body;
      if (!file || file.length === 0) {
        res.status(400).send("No file uploaded.");
        return;
      }

      const pdfBuffer: Buffer = Buffer.from(file); // Convert to Buffer if necessary
      console.log("Question:", question);

      // Speicherpfad für die hochgeladene Datei
      const uploadPath: string = path.join(
        __dirname,
        "../uploads",
        `upload-${Date.now()}.pdf`,
      );
      fs.writeFileSync(uploadPath, pdfBuffer);
      res.status(200).send("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("Internal Server Error.");
    }
  },
);
setupSSE(app, corsOptions);
export function startServer() {
  return app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
  });
}
