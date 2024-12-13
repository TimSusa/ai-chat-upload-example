import React, { useEffect, useState } from "react";
import { CustomEvent } from "./custom-event";

interface SSEClientProps {
  url: string; // URL of the SSE endpoint
  title?: string; // Optional title for the message list
}

type SSEData = {
  message: string;
  timestamp: string;
};

const SSEClient: React.FC<SSEClientProps> = ({
  url,
  title = "Server-Sent Events",
}) => {
  const [messages, setMessages] = useState<SSEData[]>([]);
  const localUserId = localStorage.getItem(CustomEvent.USER_ID) || "";
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Create a new EventSource instance
    console.log(`${url}?userId=${userId}`);
    const eventSource = new EventSource(
      localUserId.length > 0 ? `${url}?userId=${localUserId}` : new URL(url),
    );

    // Listen for incoming messages
    eventSource.onmessage = (event) => {
      const newMessage: SSEData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    eventSource.addEventListener(CustomEvent.TICKER, ({ data }) => {
      console.log(`The clock has ticked! The count is now ${data}.`);
    });

    eventSource.addEventListener(CustomEvent.SESSION_COUNT, ({ data }) => {
      console.log(
        `There are ${data} person(s) watching this pointless number.`,
      );
    });

    eventSource.addEventListener(CustomEvent.USER_ID, ({ data }) => {
      const tmpUserId = JSON.parse(data);
      setUserId(tmpUserId);
      console.log(`User ID: ${tmpUserId}`);
      if (localUserId.length === 0) {
        console.log("set new id to local storage");
        localStorage.setItem(CustomEvent.USER_ID, tmpUserId);
      }
    });

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close(); // Close the connection if there's an error
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>{title}</h2>
      <ul>
        {messages.map((data, index) => {
          const { message, timestamp } = data || { message: "", timestamp: "" };
          return (
            <li key={index}>
              <strong>Message:</strong> {message}, <strong>Time:</strong>{" "}
              {timestamp}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SSEClient;
