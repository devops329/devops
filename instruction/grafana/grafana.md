# Grafana Cloud

## Application Observability

The "three pillars of observability" are logging, metrics and tracing.

Grafana gives an explanation of these:

> Each observability signal plays a unique role in providing insights into your systems. Metrics act as the high-level indicators of system health. They alert you that something is wrong or deviating from the norm. Logs then help you understand what exactly is going wrong, for example, the nature or cause of the elevated error rates you’re seeing in your metrics. Traces illustrate where in the sequence of events something is going wrong. They let you pinpoint which service in the many services that any given request traverses is the source of the delay or the error.

## Grafana

Grafana is a company known for data visualization, allowing you to monitor observability data through customizable dashboards. It supports various data sources and integrations, including popular monitoring tools like Prometheus, Graphite, and Elasticsearch.
They provide a free cloud service for application observability. The parts of Grafana we will use are as follows:

- Visualization: Dashboards
- Logging: Loki
- Metrics: Mimir
- Tracing: Tempo
- Alerts: Alert Rules and OnCall (Alert Escalation)
- Load Testing: K6

## Create a Grafana Cloud account

- Go to [the Grafana website](https://grafana.com/)
- Create free account
- Sign in with Github

## Create a Dashboard for Pizza Server

- Go to Grafana Cloud
- Go to Dashboards - New Dashboard
- Add visualization
  - We will start by adding two for metrics and one for logs.
  - Add Data Source
    - grafanacloud-username-prom
    - Change the visualization title to 'Requests per Minute'
  - Repeat with:
    - grafanacloud-username-prom
    - Title: 'Requests per Minute'
    - grafanacloud-username-logs
    - Title: 'Logs'
