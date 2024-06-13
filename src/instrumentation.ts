const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { SEMRESATTRS_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const { Resource } = require("@opentelemetry/resources");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { LoggerProvider, SimpleLogRecordProcessor, ConsoleLogRecordExporter } = require("@opentelemetry/sdk-logs");

const loggerProvider = new LoggerProvider();

loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()));

const logger = loggerProvider.getLogger("default");

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  metricReader: new PrometheusExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
  views: [],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: "dice-roll",
  }),
});

sdk.start();

module.exports = {
  logger,
};
