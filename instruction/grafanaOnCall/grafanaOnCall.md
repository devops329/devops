# Grafana OnCall

[Introduction](https://grafana.com/docs/oncall/latest/)

The following steps will allow you to create an alerting system in Grafana:

1. Set up your user profile

-   OnCall -> Users -> Edit (your user)
-   Set default and important notification method to SMS / call (whichever you prefer)
-   Add and verify your phone number

1. Create a Contact Point
    - Note - The Contact Point is the bridge between an alert and the OnCall integration

-   Alerting -> Contact Points -> Add Contact Point
-   Give it a name (I named mine after myself)
-   Select Grafana OnCall for Integration

1. Create an Escalation Chain
- An escalation chain is a chain of actions to be taken to escalate the alert - notifying those who need to take action.

-   OnCall -> Escalation Chains -> New Escalation Chain
-   Give it a name
-   Add escalation step to notify users
    -   Options include:
        -   Send single notification (default or important)
        -   Do one of the above once every minute until the alert is acknowledged
-   Select notification style, yourself as the user

1. Create an integration

-   OnCall -> Integrations -> New Integration
-   Choose Grafana Alerting
-   Name it
-   Choose Grafana as the alert manager
-   Add your contact point
-   Send a test alert

1. Create an Alert Rule

-   Give it a name
-   Create query (I queried requests per minute)
-   Reduce can stay same, threshold whatever you want it
-   Store and evaluate in Pizza Server
-   No labels, add contact point

Escalation chains options
I have it send a single text to my phone.
I could get it to text every minute until resolved, call me, send an email, whatever.
