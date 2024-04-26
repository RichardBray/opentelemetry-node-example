import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { rollTheDice } from './dice';
import opentelemetry from '@opentelemetry/api';

const app = new Hono();

app.use(async (c, next) => {
  const tracer = opentelemetry.trace.getTracer('http-server');
  const queryParams = c.req.query();
  const span = tracer.startSpan('http-request', {
    kind: 1,
    attributes: { key: JSON.stringify(queryParams) },
  });
  span.addEvent('invoking http-request');

  await next();

  span.end();
});

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
