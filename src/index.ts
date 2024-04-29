import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { rollTheDice } from './dice';
import { incrementHttpRequestCounter, addHttpRequestTraces } from './middleware';

const app = new Hono();

app.use(incrementHttpRequestCounter);
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
