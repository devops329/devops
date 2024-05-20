# Alerting

What's the first step in resolving an issue with an application?

-   Knowing that something has gone wrong.

Setting up logging and metrics has allowed us to monitor an application.
We can use these to identify problems ranging from small to critical by setting up an alert system.

There are 4 steps to alerting:

-   Alert Rules
    -   These determine the conditions under which an alert fires.
-   Escalation Chains
    -   The sequence of actions to notify team members when an alert fires.
-   Acknowledgement
    -   Indicate that you are working to resolve the issue.
-   Resolution
    -   Indicate that the issue has been resolved.

We will use Grafana Alerting to create alert rules and Grafana OnCall to handle escalation and resolution.
