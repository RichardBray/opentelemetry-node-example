# Opentelemetry Node Example

This is a simple HTTP server that provides a dice roll service. It's built with TypeScript and uses the Hono server library. It also includes OpenTelemetry instrumentation for **metrics** and **tracing**.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (Note: OpenTelemetry currently does not support Bun and Deno)
- npm
- Docker

### Installing

1. Clone the repository

```sh
git clone https://github.com/yourusername/dice-roll-service.git
```

2. Navigate into the cloned repository

```sh
cd dice-roll-service
```
3. Install the dependencies

```sh
npm install
```

4. Start the development server

```sh
npm run dev
```

5. Run docker-compose to start Prometheus and Jaeger servers

```sh
docker-compose up
```


Now, the server is running at `http://localhost:3000`.

## Usage

- `GET /`: Returns a welcome message.
- `GET /roll?rolls=<number>`: Returns the result of rolling a dice the specified number of times.

## Metrics and Tracing

This project uses OpenTelemetry to collect metrics and traces. It exports metrics to a Prometheus server and traces to a Jaeger server.

You can start a Prometheus and Jaeger server using the provided Docker Compose file. Run `docker-compose up` to start the servers.

Prometheus will be available at `http://localhost:9090` and Jaeger at `http://localhost:16686`.
