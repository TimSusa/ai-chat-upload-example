import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createSession, Session } from "better-sse";
import { ticker } from "./tools/ticker";
//import { metrics } from "./tools/metrics";
//import http from "http";

// const app = express();
// const server = http.createServer(app);
/**
 * Needed to make TypeScript recognize the Session object attached to the response object.
 */
declare module "express-serve-static-core" {
  interface Response {
    sse: Session;
  }
}
export const setupSSE = (app: Application, corsOptions) => {
  app.get("/sse", cors(corsOptions), async (req: Request, res: Response) => {
    //console.log("SSE endpoint called", JSON.stringify(req.headers));

    const session = await createSession(req, res);
    /**
     * Subscribe the session to all events broadcasted on the ticker channel.
     */
    ticker.register(session);
    //metrics.register(session);

    // res.writeHead(200, {
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache",
    //   Connection: "keep-alive",
    // });

    // const data = { message: "Hello from SSE!", timestamp: new Date() };
    // res.write(`data: ${JSON.stringify(data)}\n\n`);

    // // Keep the connection open
    // const intervalId = setInterval(() => {
    //   const data = {
    //     message: "Hello from111111212 SSE!",
    //     timestamp: new Date(),
    //   };
    //   res.write(`data: ${JSON.stringify(data)}\n\n`);
    // }, 30000);

    res.sse = session;

    //  <   // Clean up when the connection is closed
    //     req.on("close", () => {
    //       console.log("Connection closed");
    //       //clearInterval(intervalId);
    //     });>
  });
};
