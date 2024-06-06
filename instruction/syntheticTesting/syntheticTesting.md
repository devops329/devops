# Synthetic testing

Synthetic testing, sometimes called end user tests, exercises the application from the user's perspective. It serves as a valuable smoke test that helps you know that there are problems before your users start reporting them and lose confidence in your application.

A good synthetic testing system will simulate users from different places in the world. This also helps you understand how application size and network bandwidth impact the usability of your application.

In one sense, this is the most authentic testing that you can do because it uses the actual environment that your customers are using. If your synthetic tests fail, then it probably means that your users are experiencing problems.

## Grafana synthetic testing

Grafana Cloud provides great synthetic functionality with the following capabilities.

1. Global request origin locations from every populated continent.
1. Multiple types of supported request protocols including ICMP (ping), HTTP, DNS, Traceroute, and TCP.
1. A series of HTTP requests can be executed to validate actual user interactions.
1. Complete control over frequency of requests
1. Advanced validation of responses by HTTP status codes and regular expressions against headers and bodies.
1. Automated alerts for when the tests fail.

![Synthetic testing dashboard](syntheticTestingDashboard.png)
