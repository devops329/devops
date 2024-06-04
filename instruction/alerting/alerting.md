# Alerting

What's the first step in resolving an issue with an application? Knowing that something has gone wrong.

Setting up logging and metrics has allowed us to monitor an application.
We can use these to identify problems ranging from small to critical by setting up an alert system.

## Alert Rules

Alerts rules are the conditions under which an alert is triggered. There are two main types of alert rules:

### Metrics-based alerts

These are alerts that are triggered based on the values of metrics.
Within this category, we can have alerts triggered by state conditions or metric thresholds. The state conditions are things like a container being down, or the number of instances being less than a certain number. The metric thresholds are things like the CPU being over 80% for more than 5 minutes.

### Logs-based alerts

These are alerts that are triggered based on the contents of logs. For example, if the logs contain the word "error" more than 10 times in a minute, then an alert is triggered.

## Handling alerts

The [Google SRE handbook](https://sre.google/sre-book/practical-alerting/) gives a basic structure for handling alerts.

- Critical alerts are sent to the On-Call team, a team who are scheduled to be available and responsible to handle alerts.
- Sub-critical but important alerts are sent to a ticketing system for team members to handle during normal working hours.
- All other alerts are retained as "informational data".

## Setting up an alert system

There are 4 steps to alerting:

- Alert Rules
  - These determine the conditions under which an alert fires.
- Escalation Chains
  - The sequence of actions to notify team members when an alert fires.
- Acknowledgement
  - Indicate that you are working to resolve the issue.
- Resolution
  - Indicate that the issue has been resolved.

We will use Grafana Alerting to create alert rules and Grafana OnCall to handle escalation and resolution.
