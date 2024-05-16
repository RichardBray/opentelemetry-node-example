import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import mongoose from 'mongoose';
import opentelemetry from '@opentelemetry/api';
import { Person } from './model';

mongoose.connect('mongodb://localhost:27017/people');

const app = new Hono();

app.use(async (c, next) => {
  const httpTracer = opentelemetry.trace.getTracer('http-server');
  const queryParams = c.req.query();
  const span = httpTracer.startSpan('http-request', {
    kind: 1,
    attributes: { key: JSON.stringify(queryParams) },
  });
  await next();
  span.end();
});

app.get('/', (c) => {
  return c.text('Welcome to the person all');
});

app.get('/person', async (c) => {
  const people = await Person.find();
  return c.json(people, 200);
});

app.post('/person', async (c) => {
  const data = await c.req.json();

  const person = await Person.create({
    name: data.name,
    age: data.age,
    occupation: data.occupation,
  });
  return c.json(person, 201);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
