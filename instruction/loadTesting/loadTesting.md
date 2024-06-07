# Load Testing

In the context of DevOps, load testing is the process of placing demands on an application and measuring its performance.

## Why load testing?

Load testing can identify performance bottlenecks in your application. If we are expecting 1000 users to be using our server at a time, but our server can only handle 100 concurrent requests, it's helpful to know this before we make it available to our users. We don't want to wait until we have success to realize our system can't handle success.

We have taken steps to create a scalable application, with AWS providing more resources as needed for our application to handle the demands placed on it. However, there may be some latency involved in deploying extra resources. What happens if an ad for our pizza is wildly successful, and the number of users suddenly spikes? Will the system scale up in time to handle the increased number of requests, or will our users be staring impatiently at their screen, waiting for their JWT Pizza to be delivered? Similarly, how well can the application handle a large number of requests over an extended period of time?

## Comparison to other types of testing

Load testing is similar to integration or end-to-end testing in that you can test how well pieces of the application work together. The main difference is that load testing measures the performance of these systems under load. For example, in the JWT Pizza application you may want to test the ability of the server to handle concurrent pizza orders.

## Types of testing

There are several varieties of load testing:

- Smoke testing - low load

- Load testing (yes, it has the same name) - normal load

- Stress testing - higher than normal load

- Spike testing - sudden increase in load

- Soak testing - normal load over an extended time period

## Load testing

In testing JWT Pizza, we will focus on load testing, or testing with a normal expected load. The next instructions will teach you to execute a load test using Grafana's open source load testing tool, K6.
