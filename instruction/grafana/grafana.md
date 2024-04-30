# Grafana Cloud

Grafana is a company known for data visualization, allowing you to monitor and analyze metrics and logs through customizable dashboards. It supports various data sources and integrations, including popular monitoring tools like Prometheus, Graphite, and Elasticsearch.
They have their own open-source tools, which they provide in a cloud instance for which they offer a free version that we will use in this course. We will use their tools to meet the following needs:

-   Visualization: Dashboards
-   Logging: Loki
-   Metrics: Grafana Cloud Metrics
-   Tracing: Tempo
-   Alerts: Alert Rules and OnCall (Alert Escalation)
-   Load Testing: K6

## Create a Grafana Cloud account

-   Go to [the Grafana website](https://grafana.com/)
-   Create free account
-   Sign in with Github

## Create a Dashboard for Pizza Server

-   Go to Grafana Cloud
-   Go to Dashboards - New Dashboard
-   Add visualization
    -   We will start by adding one for metrics and one for logs.
-   Add Data Source
    -   grafanacloud-username-prom
    -   Change the visualization title to 'Metrics'
-   Repeat with:
    -   grafanacloud-username-logs
    -   Title: 'Logs'
