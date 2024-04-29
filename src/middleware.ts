import { Context, Env, Next } from "hono";
import opentelemetry from "@opentelemetry/api";

export async function addHttpRequestTraces(c: Context<Env, never, {}>, next: Next) {
  const tracer = opentelemetry.trace.getTracer("http-server");
  const queryParams = c.req.query();
  const span = tracer.startSpan("http-request", {
    kind: 1,
    attributes: { key: JSON.stringify(queryParams) },
  });
  span.addEvent("invoking http-request");

  await next();

  span.end();
}
