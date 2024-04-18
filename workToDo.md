## Dates

- Stephen gone may 1-18
- Lee gone apr 29 - may 3

- Apr 18 - Start work
- May 2 - Stephen - Research complete
- May 17 - Lee - Research complete
- May 22 - Lee - Assignment definition complete
- May Pizza Shop code complete
- Student example Phase 6 - Logging, metrics, and load repo complete
- Student example Phase 7 - load repo complete
- May 24 - Stephen - Autograder design
- Course repo definition complete
- Canvas creation complete
- Course repo complete
- Aug 7 - Instruction written
- Sept 4 - Slides written
- Sept 4 - Videos created
- Aug 28 - Stephen - Autograder complete
- Sept 4 - Go Live

## Stephen

- K6, Grafana for logging and metrics
- Autograder

## Autograder

- Hook into CAS
- Has DB for storing student info
- connection to canvas to adjust grades
- Simple UI to trigger grading
- Admin triggers for chaos injection
- TA Github account that the students must let be admin on their repo
- Late day calculation

## Phases

Phase 1 - Pizza shop UI calling Provided Backend (Lambda) - order pizza return JWTs.
Frontend UI Testing
Deployment GitHub Pages
Assignment - Hit the github.io page and check for token
GitHub Actions deployment (Simple CI) - Increment a version number - Token
**Assignment** - student autograder trigger run. Hit the github.io page and check for version increment

Phase 2 - Cloud Deployment
S3/ CloudFront
GitHub Actions deployment (CI with cloud)
**Assignment** - student autograder trigger run. Hit the cloudfront page and check for version increment

Phase 3 - Backend Unit Testing, Integration Testing, Lint, coverage on server code
**Assignment** - student autograder trigger run. Hit the github repo and check coverage info

Phase 4 - Deploy Pizza shop backend
Backend
Container
**Assignment** - student autograder trigger run. Hit the Compute (lambda/container) the JWT should have a different signature than the class backend
Lambda
**Assignment** - student autograder trigger run. Hit the Compute (lambda/container) the JWT should have a different signature than the class backend

Phase 5 - Deployment strategies - versioning (CI with keeping the system running)
**Assignment** - student autograder run. Autograder trigger multiple deployments. Check that service is not disrupted. Version increasing. For A/B on param I get different versions. Canary - 5% given version A.

Phase 6 - Metrics (Grafana)
Logging
**Assignment** - student autograder trigger run. Make automated requests and make sure logs and metrics show up.

Phase 7 - E2E, end user testing, load testing (K6)
**Assignment** - student autograder trigger run. Run their K6 tests from the autograder and make sure logs and metrics show up.

Phase 8 - Chaos, alerts
**Assignment** - autograder randomly starts triggers slowdown and failure. Monitor when the system comes back up.

Phase 9 - Team penetration testing
**Assignment** - Autograder auto assigning partners. attack each other's sites and write a report.
