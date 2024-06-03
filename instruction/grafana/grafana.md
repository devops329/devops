# Grafana

Grafana is a company known for data visualization, allowing you to monitor observability data through customizable dashboards. It supports various data sources and integrations, including popular monitoring tools like Prometheus, Graphite, and Elasticsearch.
They provide a free cloud service for application observability. The parts of Grafana we will use are as follows:

- Visualization: Dashboards
- Logging: Loki
- Metrics: Mimir
- Tracing: Tempo
- Alerts: Alert Rules and OnCall (Alert Escalation)
- Load Testing: K6

## Grafana Cloud

Grafana Cloud Free Tier
10k series Prometheus metrics
50GB logs, 50GB traces, 50GB profiles
500VUh k6 testing
20+ Enterprise data source plugins
100+ pre-built solutions

### Create a Grafana Cloud account

- Go to [the Grafana website](https://grafana.com/)
- Create free account
- Sign in with Github

### Create a Dashboard for Pizza Server

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
