# PizzaShop

Demo the pizzashop running in a way that demonstrates the need for QA Deployment and Management. This is our companies application.

Show it crashing somehow or security problems we need to fix it.

As a development team we fix it, but we deploy it by manually copying files over to prod.

It doesn't actually fix the problem.

Go around again

Prod doesn't scale automatically.

The system crashes under load

## QA

We need automated quality assurance to protect our production deployment

## DevOps

We need automated CI/CD to protect our production deployment

## Life in a PizzaShop

### Course provided stuff

1. A pizzashop application
   1. V1 - Simple static web page version
   1. V2 - Lambda version that has backend support for endpoints that store database data
   1. V3 - Container version that has backend support for endpoints that store database data
   1. V4 - Container version with serious bugs in it. This is used to prove they can roll back
1. We have a AWS lambda function that creates a digital signature (JWT) for a pizza.
1. In V3 & V4 We also have a NPM library that will do the chaos injection. This will require that the Docker container have rights to use Aurora. It will slow down requests and delete the Aurora database.

### Deployment phases

1. D1 - Static pages in Dev. This calls the course lambda to get the digitally signed pizza. They write tests, linting, and coverage testing. This gets ran in their dev environment.
1. D2 - Static pages Hosted. This is deployed to GitHub Pages manually
1. D3 - Static pages CI. This is deployed to GitHub Pages with Actions. Runs tests, linting, coverage.
1. D4 - Deploy static pages to AWS S3 using Actions
1. D5 - Deploy V2 with Lambda
1. D6 - Logging and metrics
1. D7 - Performance testing
1. D8 - Deploy V3 with Containers
1. D9 - Performance testing
1. D10 - Deploy V4
1. D11 - Failure management (this should trigger a rollback, triage, and playbook execution)

## Automated testing

1. We need an app that can read canvas, get their gitHub URL and cloudfront domain name. Then use this to automatically assign grades and inject chaos.
