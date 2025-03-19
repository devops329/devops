# Synthetic testing

🔑 **Key points**

- Grafana supports synthetic testing from multiple global locations.
- Create a synthetic test for JWT Pizza.

---

Synthetic testing, sometimes called _end user testing_, exercises the application from the user's perspective. It serves as a valuable smoke test that helps you discover problems before your customers notice and report them. This is important because anytime a customer discovers a problem, it erodes their confidence and encourages them to look elsewhere for a more stable solution.

In one sense, synthetic testing is the most authentic testing because it uses the actual environment that your customers are using. If your synthetic tests fail, then it probably means that your users are currently experiencing problems.

A good synthetic testing system seeks to recreate real world usage. This means it needs to simulate requests on different devices and from different places in the world. This exercises things that are usually out of the control of the application developer, such as hardware, bandwidth and network connectivity, but that are just as vital to the usefulness of the application as functional correctness and database resilience.

## Grafana synthetic testing

Grafana Cloud provides significant synthetic testing functionality with the following capabilities.

1. Global request origin locations from every populated continent.
1. Multiple types of request protocols including ICMP (ping), HTTP, DNS, Traceroute, and TCP.
1. The ability to execute a series of HTTP requests simulating actual user interactions.
1. Control over frequency of requests.
1. Advanced validation of responses by HTTP status codes and regular expressions against headers and bodies.
1. Automated alerts for when the tests fail.

Grafana's synthetic testing dashboard looks like the following.

![Synthetic testing dashboard](syntheticTestingDashboard.png)

This includes graphs that show the latency of requests, locations that requests are probed from, and general statistics for uptime, reachability, and web certificate currency.

## Creating a synthetic test

> [!NOTE]
>
> This will require that your application is currently running. If it is not, then go and deploy it now.

To create a Grafana synthetic test do the following:

1. Open the Grafana Cloud Dashboard.
1. Open the home menu and click on `Testing & synthetics` > `Synthetics` > `Checks`.
1. Click on `New check`.
1. Select the check type. These represent the types of network requests that you can make. Select `Create API Endpoint check` in order to make a single request that assures that your application resource is available.

   ![Check type](checkType.png)

1. Define the check.

   1. Provide `jwt-pizza` as the **Job name**.
   1. Provide the URL of your JWT Pizza application as the **Request target**.

   ![Define check](defineCheck.png)

1. Click `→ Define uptime` from the left side menu. This allows you to define what response is expected from the HTTP request.

   1. Choose **200** as the `Valid status code`.
   1. Choose **Probe fails if SSL is not present** as the `SSL options`.

   ![alt text](defineUptimeStep.png)

1. Click the `→ Execution` from the left side menu to define the frequency and location where request originate.

   1. Choose three different locations from the `Probe locations`. For example, as **London**, **Seoul**, and **Ohio**.
   1. Set the `Frequency` to two minutes.

   ![Execution step](executionStep.png)

1. Press the `Test` button. After a few seconds this should return a successful response.

   ![Test run](testRun.png)

1. Press the `Save` button.

## Viewing the results

It will take a few minutes for the results of your test to start recording. Once they do, you will see the summary displayed.

![Check summary](checkSummary.png)

Click on the `View dashboard` link to see the details of the test.

![Check dashboard](checkDashboard.png)

## Configuring alerts

Running tests is only as valuable as your ability to react to the results. In the case of synthetic testing, you need to define an alert that will contact the responsible parties when results need attention.

In a later section you will learn how to define the rules for triggering alerts and the methods for contacting the responsible parties. You can then write a rule that triggers an alert when an anomaly is detected.

## Reducing cost

Grafana Cloud provides you with a limited number of free synthetic testing checks. Once you have experimented with this functionality, you want to reduce the number of checks that you make so that it falls within their free tier.

To reduce the number of checks, edit the check that you just created and navigate to the `Execution` view. Change the frequency to 60 minutes and press `Save`.

## ☑ Exercise

1. Follow the instruction given above to create a synthetic test of your JWT Pizza deployment.
1. Observe the metrics over a reasonable period of time.
1. Decrease the frequency of the tests to once an hour.
