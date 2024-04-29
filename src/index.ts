import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { rollTheDice } from './dice';
import { addHttpRequestTraces } from './middleware';
import opentelemetry from '@opentelemetry/api';

const app = new Hono();

app.use(async (c, next) => {
  const meter = opentelemetry.metrics.getMeter('http-server');
  const queryParams = c.req.query();
  const requestCounter = meter.createCounter('http_requests', {
    description: 'Count of all HTTP requests',
  });
  const label = { route: `${c.req.path}=${JSON.stringify(queryParams)}` };

  requestCounter.add(1, label);

  await next();
});

app.use(addHttpRequestTraces);

app.get('/', (c) => {
  return c.text('Welcome to dice roll');
});

app.get('/roll', (c) => {
  const rolls = Number(c.req.query('rolls'));
  if (isNaN(rolls)) {
    return c.json({ error: "'rolls' is missing or not a number." }, 400);
  }
  return c.json({ result: JSON.stringify(rollTheDice(rolls)) }, 200);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
