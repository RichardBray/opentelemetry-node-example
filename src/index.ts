import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { LoggerProvider, SimpleLogRecordProcessor, ConsoleLogRecordExporter } from "@opentelemetry/sdk-logs";
import { SeverityNumber } from "@opentelemetry/api-logs";
import { rollTheDice } from "./dice.js";
import { incrementHttpRequestCounter, addHttpRequestTraces } from "./middleware.js";

const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()));

const logger = loggerProvider.getLogger("default");

const app = new Hono();

app.use(incrementHttpRequestCounter);
app.use(addHttpRequestTraces);

app.get("/", (c) => {
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: "This is a test message",
  });
  return c.text("Welcome to dice roll");
});

app.get("/roll", (c) => {
  const rolls = Number(c.req.query("rolls"));
  if (isNaN(rolls)) {
    logger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: "ERROR",
      body: "'rolls' is missing or not a number.",
    });
    return c.json({ error: "'rolls' is missing or not a number." }, 400);
  }
  logger.emit({
    severityNumber: SeverityNumber.INFO,
    severityText: "INFO",
    body: `No of dice rolls requested: ${rolls}`,
  });
  return c.json({ result: JSON.stringify(rollTheDice(rolls)) }, 200);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
