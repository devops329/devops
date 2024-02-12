# Continuous Delivery & Deployment

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
