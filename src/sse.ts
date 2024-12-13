import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createChannel, createSession, Session } from "better-sse";
import { ticker } from "./tools/ticker";
import { corsOptions as corsOpt } from "./server";
import { Snowflake } from "@sapphire/snowflake";
import { PubSub } from "./tools/pubsub";
import { CustomEvent } from "../client/src/custom-event";
/**
 * Needed to make TypeScript recognize the Session object attached to the response object.
 */
declare module "express-serve-static-core" {
  interface Response {
    sse: Session;
  }
}

const snowflake = new Snowflake(0n);

const pubsub = new PubSub();
export const setupSSE = (app: Application, corsOptions: typeof corsOpt) => {
  app.get("/sse", cors(corsOptions), async (req: Request, res: Response) => {
    const userId = req.query.userId || snowflake.generate();
    console.log("was sent from user", req.query.userId);
    const session = await createSession(req, res, {
      state: {
        userId,
      },
    });

    ticker.register(session);

    session.push(session.state.userId.toString(), CustomEvent.USER_ID);
    pubsub.subscribe(session, userId.toString());
    pubsub.publish("Trigger Test Event to User", userId.toString());

    // res.sse = session;

    //  <   // Clean up when the connection is closed
    //     req.on("close", () => {
    //       console.log("Connection closed");
    //       //clearInterval(intervalId);
    //     });>
  });
};
