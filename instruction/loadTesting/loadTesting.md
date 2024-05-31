# Load Testing

You don't want to wait until you have success to realize your system can't handle success

## Comparison to other types of testing

Load testing is similar to integration or end-to-end testing in that you can test how well pieces of the application work together. The main difference is that load testing measures the performance of these systems under load. For example, in the JWT Pizza application you may want to test the ability of the server to handle concurrent pizza orders.

## Why load testing?

Load testing can identify performance bottlenecks in your application. If you are expecting 1000 users to be using your server concurrently, but your server can only handle 100, it's helpful to know this before you start using your application. Even with using the automatic scaling of resources that AWS provides, it's good to know whether your services can handle a sudden spike in users or whether it can handle a large number of requests over a long period of time. This is where different forms of load testing come in useful.

## Types of testing

There are several types of load testing:

- Smoke testing - low load

- Load testing - normal load

- Stress testing - higher than normal load

- Spike testing - sudden increase in load

- Soak testing - extended time, normal load
