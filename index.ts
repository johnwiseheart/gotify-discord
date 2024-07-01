import WebSocket from "ws";

const GOTIFY_HOST = process.env.GOTIFY_HOST || "localhost";
const GOTIFY_TOKEN = process.env.GOTIFY_TOKEN;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

if (GOTIFY_TOKEN === undefined) {
  throw new Error("GOTIFY_TOKEN is required");
}

if (DISCORD_WEBHOOK === undefined) {
  throw new Error("DISCORD_WEBHOOK is required");
}

const transformMessage = (message: string) => {
  const json = JSON.parse(message);
  return `_from gotify:_\n# ${json.title}\n${json.message}`;
};

const runServer = (): void => {
  const ws = new WebSocket(`ws://${GOTIFY_HOST}/stream`, {
    headers: { "X-Gotify-Key": GOTIFY_TOKEN },
  });

  ws.on("open", () => {
    console.log("Connected to Gotify message stream");
  });

  ws.on("message", (message: string) => {
    console.log(`Received message from server: ${message}`);

    fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: transformMessage(message),
      }),
    });
  });

  ws.on("close", () => {
    console.log("Disconnected from server");
  });
};

runServer();
