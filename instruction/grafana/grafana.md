# Grafana Cloud

Grafana is...

-   They have open-source services for logging, metrics, alerts, tracing and more.
-   They are best known for creating dashboards in which you can visualize this data.
-   They provide a cloud service with these services built in.
    -   There is a generous free version, which we will use in this course for observing the Pizza Server.

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
