# Synthetic testing

🔑 **Key points**

- Grafana supports synthetic testing from multiple global locations.
- Create a synthetic test for the JWT Pizza application.

---

Synthetic testing, sometimes called _end-user testing_, exercises an application from the user's perspective. It serves as a valuable smoke test that helps you discover problems before your customers notice or report them. This is critical because every time a customer discovers an issue, it erodes their confidence and encourages them to look elsewhere for a more stable solution.

In one sense, synthetic testing is the most authentic form of testing because it uses the actual production environment that your customers use. If your synthetic tests fail, it almost certainly means that your users are currently experiencing problems.

A robust synthetic testing system seeks to recreate real-world usage. This means it must simulate requests from different devices and various geographical locations. This exercises factors that are usually outside the control of the application developer—such as hardware, bandwidth, and network connectivity—but are just as vital to the application's utility as functional correctness and database resilience.

## Grafana synthetic testing

Grafana Cloud provides significant synthetic testing functionality with the following capabilities:

1. **Global request origins:** Test from every populated continent.
2. **Multiple protocols:** Support for ICMP (ping), HTTP, DNS, Traceroute, and TCP.
3. **Multi-step interactions:** Execute a series of HTTP requests simulating actual user workflows.
4. **Frequency control:** Define how often tests run.
5. **Advanced validation:** Validate responses using HTTP status codes and regular expressions against headers and bodies.
6. **Automated alerts:** Notify the team immediately when tests fail.

The Grafana synthetic testing dashboard provides a high-level overview of application health.

![Synthetic testing dashboard](syntheticTestingDashboard.png)

This dashboard includes graphs showing request latency, the locations from which requests are probed, and general statistics for uptime, reachability, and SSL certificate validity.

## Creating a synthetic test

> [!NOTE]
>
> This requires your application to be currently running. If it is not, please deploy it before proceeding.

To create a Grafana synthetic test, follow these steps:

1. Open your Grafana Cloud Dashboard.
1. Open the home menu and navigate to **Testing & synthetics** > **Synthetics** > **Checks**.
1. Click on **New check**.
1. Select the check type. These represent the types of network requests you can perform. Select **Create API Endpoint check** to create a single request that ensures your application resource is available.

   ![Check type](checkType.png)

1. Define the check:
   1. Enter `jwt-pizza` as the **Job name**.
   2. Enter the URL of your JWT Pizza application as the **Request target**.

   ![Define check](defineCheck.png)

1. Click **→ Define uptime** from the left side menu. This allows you to define the expected response.
   1. Choose **200** as the **Valid status code**.
   2. Select **Probe fails if SSL is not present** under **SSL options**.

   ![Define uptime step](defineUptimeStep.png)

1. Click **→ Execution** from the left side menu to define the frequency and origin of the requests.
   1. Choose three different locations from the **Probe locations** (e.g., **London**, **Seoul**, and **Ohio**).
   2. Set the **Frequency** to **2 minutes**.

   ![Execution step](executionStep.png)

1. Click the **Test** button. After a few seconds, this should return a successful response.

   ![Test run](testRun.png)

1. Click the **Save** button.

## Viewing the results

It will take a few minutes for the results of your test to begin recording. Once they do, you will see a summary displayed on the Checks page.

![Check summary](checkSummary.png)

Click on the **View dashboard** link to see the detailed metrics of the test.

![Check dashboard](checkDashboard.png)

## Configuring alerts

Running tests is only valuable if you can react to the results. For synthetic testing, you should define an alert that contacts the responsible parties when results require attention.

In a later section, you will learn how to define rules for triggering alerts and the methods for contacting the responsible team members. You can then write a rule that triggers an alert as soon as an anomaly is detected by your synthetic checks.

## Reducing cost

Grafana Cloud provides a limited number of free synthetic testing checks. Once you have finished experimenting with this functionality, you should reduce the frequency of your checks to ensure you stay within the free tier.

To reduce the number of checks:
1. Edit the check you just created.
2. Navigate to the **Execution** view.
3. Change the **Frequency** to **60 minutes**.
4. Click **Save**.

## ☑ Exercise

1. Follow the instructions above to create a synthetic test for your JWT Pizza deployment.
1. Observe the metrics over a short period of time to ensure they are recording correctly.
1. Decrease the frequency of the tests to once per hour to conserve your Grafana Cloud credits.