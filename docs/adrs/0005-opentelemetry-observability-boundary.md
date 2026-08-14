---
id: adr-0005
title: OpenTelemetry is the application observability boundary
summary: Services emit backend-independent telemetry through OpenTelemetry and OTLP, with local routing owned by an OpenTelemetry Collector.
status: accepted
repository_paths:
  - docs/adrs/0005-opentelemetry-observability-boundary.md
---

# ADR-0005 — OpenTelemetry is the application observability boundary

## Status

Accepted

## Context

Application-level execution of architectural capabilities must be observable without coupling those
capabilities or their services to a particular telemetry backend. The local development environment
currently uses Zipkin for traces, while DCL observability policies also require metrics. Zipkin does
not provide a metrics backend.

## Decision

Applications shall use OpenTelemetry APIs and SDKs for instrumentation and export traces and metrics
using OTLP. Application configuration shall describe the OTLP destination and service identity, not
the downstream observability backend.

The local runtime shall use an OpenTelemetry Collector as the telemetry routing boundary. The
Collector forwards traces to Zipkin and exposes metrics in Prometheus format for local inspection.
Backend-specific exporters and endpoints belong to Collector configuration rather than application
code or domain behaviour.

Spans and metrics shall describe architectural capabilities, effects and outcomes. They shall not
include business payloads or potentially sensitive architectural content.

## Consequences

Zipkin can be replaced without changing application instrumentation. Trace and metric pipelines use
one standard ingestion protocol, and DCL observations can be implemented with native OpenTelemetry
instruments.

The local environment gains one operational component and its routing configuration. Production
deployments must provide an OTLP-compatible endpoint and choose suitable trace and metric backends.
Telemetry delivery remains non-functional behaviour: exporter failure must not change capability
outcomes or API error behaviour.
