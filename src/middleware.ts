import { Context, Env, Next } from 'hono';
import opentelemetry from '@opentelemetry/api';

export async function incrementHttpRequestCounter(c: Context<Env, never, {}>, next: Next) {
  const meter = opentelemetry.metrics.getMeter('http-server');
  const queryParams = c.req.query();
  const requestCounter = meter.createCounter('http_requests', {
    description: 'Count of all HTTP requests',
  });
  const label = { route: `${c.req.path}=${JSON.stringify(queryParams)}` };
  requestCounter.add(1, label);
  await next();
}
