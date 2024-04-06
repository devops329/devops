# Continuous Delivery & Deployment

- Automation is the mantra of DevOps
- Automating the process of validating the state of the next application and preparing it for deployment is continuous delivery.
- Common CI items include
  - Build
  - Test
  - Lint
  - Version assignment
  - Bundle, deployment package building
- Automating the actual deployment (CD) takes things to the next level. To make this successful you want to make sure you have massive automated testing and metric analysis for the production system. Which is probably a good thing to have anyway.
- Without CD there is often a manual button someone has to push to do the deployment from a CI version.

This is all general, but will we will demonstrate it with GitHub actions in the next instruction.

## Workflows

- Build and test
- Deployments - If the tests pass then build a release candidate
- Releases - I think you can create releases from previous steps. It would be good to tag the version and other stuff. You may want to make this a manual process.

[Triggers](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

- push commit
- release published
- label creation
- Schedule triggered by cron job.
- Deployment

## Reusing workflows

[Reusing workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
