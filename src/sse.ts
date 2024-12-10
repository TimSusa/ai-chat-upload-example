import express, { Application, Request, Response } from "express";
import cors from "cors";
//import http from "http";

// const app = express();
// const server = http.createServer(app);

export const setupSSE = (app: Application, corsOptions) => {
  app.get("/sse", cors(corsOptions), (req: Request, res: Response) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const data = { message: "Hello from SSE!", timestamp: new Date() };
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    // Keep the connection open
    const intervalId = setInterval(() => {
      const data = {
        message: "Hello from111111212 SSE!",
        timestamp: new Date(),
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 30000);

    // Clean up when the connection is closed
    req.on("close", () => {
      clearInterval(intervalId);
    });
  });
};
