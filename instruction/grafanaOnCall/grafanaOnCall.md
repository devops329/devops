# Grafana OnCall

[Introduction](https://grafana.com/docs/oncall/latest/)

Follow these steps:

1. Set up your user profile

-   OnCall -> Users -> Edit (your user)
-   Set default and important notification method to SMS / call (whichever you prefer)
-   Add and verify your phone number

1. Create a Contact Point
    - Note - The Contact Point is the bridge between an alert and the OnCall integration

-   Alerting -> Contact Points -> Add Contact Point
-   Give it a name (I named mine after myself)
-   Select Grafana OnCall for Integration

2. Create an Escalation Chain

-   OnCall -> Escalation Chains -> New Escalation Chain
-   Give it a name
-   Add escalation step to notify users
-   Select notification style, yourself as the user

3. Create an integration

-   OnCall -> Integrations -> New Integration
-   Choose Grafana Alerting
-   Name it
-   Choose Grafana as the alert manager
-   Add your contact point

4. Create an Alert Rule

-   Give it a name
-   Create query (I queried requests per minute)
-   Reduce can stay same, threshold whatever you want it
-   Store and evaluate in Pizza Server
-   No labels, add contact point

Alert rule:

-   Metrics, when requests_per_minute exceeds 10
    Contact Point - Name (you), integration (OnCall)
    Integrations - Connect a contact point, add a default route that triggers escalation chain
    Users - verify preferred contact methods (Phone)

Escalation chains options
I have it send a single text to my phone.
I could get it to text every minute until resolved, call me, send an email, whatever.
Escalation chain = chain of actions to escalate the alert.
