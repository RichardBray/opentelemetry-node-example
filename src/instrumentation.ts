const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { SEMRESATTRS_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const { Resource } = require("@opentelemetry/resources");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations(), new MongoDBInstrumentation()],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "people-api",
  }),
});

sdk.start();
