# Deployment environments

- Usually you have multiple deployment environments
  - Development
  - Staging
  - QA
  - Sales demos (sneak peak)
  - Partners (both hosted and on-prem)
  - Production (this may also have A/B deployments)
- You must trade off how complete each of these environments are against how expensive it is to host the environment
- The closer they are the more realistic picture they paint.
- Issues
  - Hosting PII in non-production environments.
  - Costs for hosting lost of data
  - Need for a reproducible testing environment where you can run standardized tests
  - If the hardware is different then the system will behave differently
- It is nice to be able to create environments on demand. This also proves your automation for disaster recovery

## Security consideration

- You want to divide your dev from your prod. With very significant walls. PCI or SOC compliance will require you to not let your dev team access the production environment.
