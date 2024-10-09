# Notes

## Boundary Permission

In the BYU AWS account you have to give permissions boundary to any role you create if it is going to assume other roles. Add: `iamRolePermissionBoundary`

## Testing user

- byucsstudent (CS email)

## Image manipulation

### Resize image

```sh
ffmpeg -i $imageFile -vf scale=$size:-1 -q 1 $newImageFile
```

### Resize png image without loosing transparency

```sh
ffmpeg -i x.png -vf scale=75:-1 -pred mixed -y -pix_fmt rgba caddyLogoS.png
```

### Animated gif creation

```sh
ffmpeg -i x.mov -filter_complex "[0:v] fps=6,scale=480:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" x.gif
```

### Launch multiple OBS

```sh
open -n -a OBS.app
```

Display properties crop 2500, 1400

### Multi-cam editing in DaVinci

    https://www.youtube.com/watch?v=ZzPZe36RdkU

## AutoGrader

Allow impersonation. ✅

Fix the deliverable steps to reflect the AutoGrader usage.

Change instruction for when they fork, add ta as collaborator ✅

- ☑ 🟢 [⓵ Manual deployment: JWT Pizza](deliverable1ManualDeploy/deliverable1ManualDeploy.md) ✅

  - fetch webpage and regex jwt pizza
  - dig to check dns for github pages

- ☑ 🟢 [⓶ Automated deployment: JWT Pizza](deliverable2AutomatedDeploy/deliverable2AutomatedDeploy.md)

  - Run workflow
  - Rerun d1 grader
  - latest github action, check for actions/deploy-pages

- ☑ 🟢 [⓷ Unit testing CI](deliverable3UnitTestingCi/deliverable3UnitTestingCi.md)

  - Run workflow
  - Check lint ran
  - Check coverage ran > 80%
  - Check test succeed
  - Version increase

- ☑ 🟢 [⓸ User interface testing: JWT Pizza](deliverable4UiTesting/deliverable4UiTesting.md)

  - Run workflow
  - Check coverage ran > 80%
  - Check test succeed
  - Version increase

- ☑ 🟢 [⓹ CDN deployment: JWT Pizza](deliverable5CdnDeploy/deliverable5CdnDeploy.md)

  - Run workflow
  - DNS is cloudfront
  - Check for 404 not returned on path url
  - check for s3 push

- ☑ 🟢 [⓺ Scalable deployment: JWT Pizza Service](deliverable6ScalableDeploy/deliverable6ScalableDeploy.md)

  - Run workflow
  - check for ecr and ecs in actions workflow
  - DNS on jwt-pizza-service URL (jwt-pizza-service-123456789.us-east-1.elb.amazonaws.com.)
  - check that .env.production contains their service url (VITE_PIZZA_SERVICE_URL=https://pizza-service.byucsstudent.click)
  - Use curl to create a user and then login in as the user

- ☑ 🟢 [⓻ Metrics: JWT Pizza Service](deliverable7Metrics/deliverable7Metrics.md)

  - Not autograded

- ☑ 🟢 [⓼ Logging: JWT Pizza Service](deliverable8Logging/deliverable8Logging.md)

  - Not autograded

- 🔵 [⓽ Load testing: JWT Pizza Service](deliverable10LoadTesting/deliverable10LoadTesting.md)

  - Not autograded

- ☑ 🟢 [⓾ Chaos testing: JWT Pizza](deliverable11ChaosTesting/deliverable11ChaosTesting.md)

  - Learner ready action for next 48 hours - waits random 0 - 6 hours after 8 AM to trigger
    - Provide grader resolve URL
  - They 24 hours from trigger time to resolve.
    - When they resolve with grader, the grader calls the factory and it stop chaos. If 200 returned they fixed the problem.
  - Grader grades.

- ☑ 🟢 [⓫ Penetration testing: JWT Pizza](deliverable11PenetrationTesting/deliverable11PenetrationTesting.md)

  - no autograde
  - partners are assigned

## Dates

- Stephen gone may 1-18
- Lee gone apr 29 - may 3, July 11-20

| Date   | Owner   | Action                                                                                 |
| ------ | ------- | -------------------------------------------------------------------------------------- |
| Apr 18 |         | Start work                                                                             |
| May 2  | Stephen | Grafana Research complete                                                              |
| May 17 | Lee     | Research complete                                                                      |
| May 22 | Lee     | Assignment definition complete                                                         |
| May 24 | Lee     | Pizza Shop code complete                                                               |
| May 24 | Stephen | AutoGrader design                                                                      |
| May x  | x       | Course repo definition complete                                                        |
| May x  | Lee     | Student example Phase 1 - UI Testing, Deploy to GitHub pages, with and without actions |
| May x  | Lee     | Student example Phase 2 - Cloudfront deploy with version increment                     |
| May x  | Lee     | Student example Phase 3 - Backend testing                                              |
| May x  | Lee     | Student example Phase 4 - Container lambda deployment, aurora setup                    |
| May x  | Lee     | Student example Phase 5 - Deployment strategies                                        |
| May 29 | Stephen | Student example Phase 6 - Logging, metrics, and load repo complete                     |
| May 31 | Stephen | Student example Phase 7 - load repo complete                                           |
| Jun x  | Lee     | Student example Phase 8 - Chaos injection                                              |
| Jun x  | Lee     | Student example Phase 9 - Pen testing                                                  |
| Jun x  | x       | Canvas creation complete                                                               |
| Jun x  | x       | Course repo complete                                                                   |
| Aug 28 | Lee     | Instruction written                                                                    |
| Sept 4 | Lee     | Slides written                                                                         |
| Sept 4 | Lee     | Videos created                                                                         |
| Aug 28 | Stephen | AutoGrader complete                                                                    |
| Sept 4 | All     | Go Live                                                                                |

## Stephen's Core Responsibilities

- [ ] K6, Grafana for logging and metrics
- [ ] AutoGrader
- [ ] Student solutions for all assignments
- [ ] Fix all of Professor Jensen's logic, grammar, and spelling errors

## Lee's Core Responsibilities

- [x] Pizza Shop code
- [x] Set up course version of backend server (ClassBE)
- [x] Set up JWT generation service (ClassJWT)
- [ ] Set up Chaos injection
- [ ] Instruction
- [ ] Videos
- [ ] Canvas
- [ ] Course repos
- [ ] Setup discord server

## PizzaShop

### Frontend sitemap

This should be enough complexity to demonstrate testing, coverage, and security.

```mermaid
graph TB;
    Home-->History
    Home-->About
    Home-->AdminDashboard
    AdminDashboard-->CreateFranchise
    AdminDashboard-->RefundFranchise
    Home-->FranchiseDashboard
    FranchiseDashboard-->CreateStore
    FranchiseDashboard-->Register/Login
    Home-->DinnerDashboard
    DinnerDashboard-->Register/Login
    DinnerDashboard-->Payment
    Home-->Order
    Order-->Payment
    Order-->Register/Login
    Home-->Register/Login
```

### System architecture

- **PizzaShopUI**: The client app. Course provides all the code. The student deploys, writes tests, adds metric instrumentation, and logging.
- **StudentDB**: Student deploys a DB backend.
- **StudentBE**: Course provides all the code. The student deploys, writes tests, adds metric instrumentation, and logging.
- **ClassJWT**: Course provided JWT demonstrates what backend is asking for pizza JWT. This also allows for chaos injection.
  - Slow down how quickly it responds
  - Send a response that the Backend driver code uses to delete the database, or delete the DB data.
  - Return a failure saying that they need to request a new V2 Client token.
- **ClassBE**: Course provided Backend until the student deploys their own.
- **ClassDB**: Course provided DB until the student deploys their own.

```mermaid
graph LR;
    subgraph class provided
    ClassBE-->ClassDB
    ClassBE-->ClassJWT
    end
    subgraph student provided
    PizzaShopUI-->ClassBE
    PizzaShopUI-->StudentBE
    StudentBE-->ClassJWT
    StudentBE-->StudentDB
    end
```

## AutoGrader

- Hook into CAS
- Has DB for storing student info
- connection to canvas to adjust grades
- Simple UI to trigger grading
- Admin triggers for chaos injection
- TA GitHub account that the students must let be admin on their repo
- Late day calculation

```mermaid
graph LR;
    subgraph class AutoGrader
    AutoGrader-->|get version/JWT|PizzaShopUI
    AutoGrader-->|trigger deployment|GitHubAction
    AutoGrader-->|get coverage|GitHub
    AutoGrader-->|inject chaos|ClassBE
    AutoGrader-->|record grade|Canvas
    AutoGrader-->|auth|ByuCas
    AutoGrader-->DB
    end
```

## Changes made for coursework

### GitHub

- Creation of junk account
- fork of jwt-pizza and jwt-pizza-service repos
- Creation of github pages deployment
- Creation of Actions workflows

### AWS

- CloudFront distribution
- IAM Roles and policies for OIDC connection to GitHub
- Bucket for frontend
- Route 53 domain
- Certificate Manager for domain
- Bucket for ECR images
- ECR repository with associated image uploads
- ECS cluster with associated task definitions, services, security groups, and deployments
- EC2 ALB for cluster
- Bucket for cloudformation templates
- CloudFormation deployment stack

## Grafana

- Creation of junk account

## Setting the upstream user and password

I had to set the upstream to contain a password since it was the student account. This is really valuable since I can set it on a repo instead of an account.

```sh
git remote set-url origin https://byucsstudent:xxxx@github.com/byucsstudent/jwt-pizza.git
```

You can specify the upstream for the fork to the original repository with:

```sh
git remote add upstream https://github.com/devops329/jwt-pizza.git
```

You can see what the remotes are with

```sh
git remote show origin
git config --get remote.origin.url
git config --get remote.upstream.url
```

To remove the upstream

```sh
git remote remove upstream
```

## Handling a merge conflict with the remote

```sh
git remote add upstream https://github.com/devops329/jwt-pizza-service.git
git fetch upstream
git checkout main
git merge upstream/main
```

## Triggering chaos

You trigger an injection for a learner with a call like:

```sh
curl -X PUT http://localhost:4000/api/admin/vendor/111111 -H "Content-Type:application/json" -H "authorization:Bearer xxxx" -d '{"chaos":{"type":"badjwt|fail|throttle"}}' | jq '.'
```

This will cause a `reportUrl` field to start appearing on pizza order requests. The location of the field will differ depending on the injection type. However, it always shows up and if they debug or have good logs they should be able to find it easily.

```sh
{
    "order": {
        "items": [
            {
                "menuId": 1,
                "description": "Veggie",
                "price": 0.0038
            }
        ],
        "storeId": "2",
        "franchiseId": 1,
        "id": 155
    },
    "jwt": "jwthere",
    "reportUrl": "http://pizza-factory.cs329.click/api/support/1111111/report/22222222"
}
```

The learner the calls that url and the problem goes away. In the factory I track when the chaos was injected and when it was resolved.

```json
{
  "chaos": {
    "type": "none",
    "errorDate": "2024-06-07T22:28:40.174Z",
    "fixDate": "2024-06-07T22:28:40.170Z"
  }
}
```

## Creating a Pizza Factory vendor

```sh
curl -X POST https://pizza-factory.cs329.click/api/admin/vendor -H 'authorization: Bearer 9s32@352.kfdi(l4;' -H 'Content-Type:application/json' -d '{"id":"byucsstudent", "name":"BYU student"}'

{"apiKey":"b819cdd10d3f8d6fe49358e2c77e393e","vendor":{"id":"byucsstudent","name":"BYU student","created":"2024-07-01T19:12:45.187Z","validUntil":"2025-01-01T19:12:45.187Z"}}
```

### Three chaos injections

1. Fail responses
1. Bad JWT
1. Throttled responses.

They have 24 hours to correct. Every hour after the first 24 hours deducts 5%.

## Vulnerabilities

- Identification and Authentication Failures
  - Weak passwords
  - You can register the same user multiple times. Only the first one's password is used.
- Broken Access Control
  - URL bypass (docs) (robots.txt)
  - delete franchise
- Security Misconfiguration
  - stack in errors,
  - jwt-pizza-service: `X-Powered-By: Express`
  - Didn't change default password (admin)
  - Containers have a public IP address
- Injection
  - Update user
  ```sh
  curl -X PUT $host/api/auth/4 -d '{"email":"f@jwt.com'\'' WHERE id=3333; select 1+1; -- "}' -H 'Content-Type: application/json' -H "Authorization: bearer $token" | jq '.'
  ```

## Known security violations

1. Inject on order description
1. Escalation on add user with a given role
1. Reveals config `server: Express`
1. If you use the same name for creating a franchise it will leak the SQL error
1. Returns code stack with error
1. Docs page has the demo data user's email and password
1. Does not use cookies
1. The default jwtSecret is not changed in their `config.js` file.
1. Deployment will log db credentials when a connection failure happens.
1. There is a default admin user with an email and password displayed in the docs

GitHub Copilot: - **ClassDiscord**: Course provides Discord server for communication and collaboration among students and instructors.

- **Canvas**: Course utilizes Canvas as the learning management system for delivering course materials, assignments, and grades.
- **Course Repos**: Course requires students to create and maintain individual repositories for their assignments and projects.
- **Setup Discord Server**: Lee is responsible for setting up the Discord server for the course, ensuring proper channels, roles, and permissions are configured.
- **Instruction**: Lee is responsible for creating instructional materials, including lecture slides, code examples, and step-by-step guides.
- **Videos**: Lee is responsible for creating video tutorials and demonstrations to supplement the course content.
- **Canvas Creation**: Lee is responsible for setting up the course on Canvas, creating modules, assignments, and quizzes.
- **Course Repo Complete**: Lee ensures that all course repositories are properly set up and organized, with clear documentation and instructions for students.
- **AutoGrader Complete**: Stephen is responsible for developing and maintaining the AutoGrader tool, which automates the grading process for assignments and provides feedback to students.
- **Go Live**: All team members collaborate to ensure a successful launch of the course, including testing all components, resolving any issues, and making necessary adjustments.
- **K6, Grafana for Logging and Metrics**: Stephen is responsible for implementing K6 and Grafana to monitor and analyze the performance and behavior of the Pizza Shop application.
- **Student Solutions for All Assignments**: Stephen ensures that all student assignments are properly submitted, graded, and recorded in the AutoGrader system.
- **Fix all of Professor Jensen's Logic, Grammar, and Spelling Errors**: Stephen reviews and corrects any logic, grammar, and spelling errors in Professor Jensen's course materials, ensuring clarity and accuracy.
- **Set up JWT Generation Service (ClassJWT)**: Lee sets up the JWT generation service, which provides authentication and authorization for the Pizza Shop application.
- **Set up Chaos Injection**: Lee is responsible for implementing chaos injection techniques to test the resilience and fault tolerance of the Pizza Shop application.
- **Videos Created**: Lee creates instructional videos to supplement the course materials, providing visual explanations and demonstrations of key concepts and techniques.
- **Canvas Complete**: Lee ensures that all course materials, assignments, and grades are properly organized and accessible on the Canvas platform.
- **AutoGrader**: Stephen develops and maintains the AutoGrader tool, which automates the grading process for assignments and provides feedback to students.
- **Set up Course Version of Backend Server (ClassBE)**: Lee sets up the course version of the backend server, which serves as the foundation for the Pizza Shop application.
- **Student Example Phase 1 - UI Testing, Deploy to GitHub Pages, with and without actions**: Lee provides a student example demonstrating UI testing and deployment of the Pizza Shop application to GitHub Pages, both with and without GitHub Actions.
- **Student Example Phase 2 - Cloudfront Deploy with Version Increment**: Lee provides a student example demonstrating the deployment of the Pizza Shop application to CloudFront with version incrementation.
- **Student Example Phase 3 - Backend Testing**: Lee provides a student example demonstrating backend testing techniques for the Pizza Shop application.
- **Student Example Phase 4 - Container Lambda Deployment, Aurora Setup**: Lee provides a student example demonstrating the deployment of the Pizza Shop application using containerized Lambda functions and setting up Aurora database.
- **Student Example Phase 5 - Deployment Strategies**: Lee provides a student example demonstrating different deployment strategies for the Pizza Shop application, such as blue-green deployment and canary deployment.
- **Student Example Phase 6 - Logging, Metrics, and Load Repo Complete**: Stephen ensures that the student example for logging, metrics, and load repository is complete, providing students with hands-on experience in monitoring and optimizing the Pizza Shop application.
- **Student Example Phase 7 - Load Repo Complete**: Stephen ensures that the student example for the load repository is complete, allowing students to simulate and analyze the performance of the Pizza Shop application under different load conditions.
- **Student Example Phase 8 - Chaos Injection**: Lee provides a student example demonstrating chaos injection techniques to test the resilience and fault tolerance of the Pizza Shop application.
- **Student Example Phase 9 - Pen Testing**: Lee provides a student example demonstrating penetration testing techniques to identify and address security vulnerabilities in the Pizza Shop application.
- **Instruction Written**: Lee completes the writing of instructional materials, including lecture notes, code explanations, and step-by-step guides.
- **Slides Written**: Lee creates and finalizes the lecture slides for the course, ensuring they are clear, concise, and visually appealing.
- **Videos Created**: Lee records and edits video tutorials and demonstrations to supplement the course content, providing additional learning resources for students.
- **AutoGrader Complete**: Stephen finishes the development and testing of the AutoGrader tool, ensuring it is fully functional and ready for use in grading student assignments.
- **Go Live**: All team members collaborate to ensure a smooth and successful launch of the course, addressing any last-minute issues and providing support to students as needed.- **ClassDiscord**: Course provides Discord server for communication and collaboration among students and instructors.
- **Canvas**: Course utilizes Canvas as the learning management system for delivering course materials, assignments, and grades.
- **Course Repos**: Course requires students to create and maintain individual repositories for their assignments and projects.
- **Setup Discord Server**: Lee is responsible for setting up the Discord server for the course, ensuring proper channels, roles, and permissions are configured.
- **Instruction**: Lee is responsible for creating instructional materials, including lecture slides, code examples, and step-by-step guides.
- **Videos**: Lee is responsible for creating video tutorials and demonstrations to supplement the course content.
- **Canvas Creation**: Lee is responsible for setting up the course on Canvas, creating modules, assignments, and quizzes.
- **Course Repo Complete**: Lee ensures that all course repositories are properly set up and organized, with clear documentation and instructions for students.
- **AutoGrader Complete**: Stephen is responsible for developing and maintaining the AutoGrader tool, which automates the grading process for assignments and provides feedback to students.
- **Go Live**: All team members collaborate to ensure a successful launch of the course, including testing all components, resolving any issues, and making necessary adjustments.
- **K6, Grafana for Logging and Metrics**: Stephen is responsible for implementing K6 and Grafana to monitor and analyze the performance and behavior of the Pizza Shop application.
- **Student Solutions for All Assignments**: Stephen ensures that all student assignments are properly submitted, graded, and recorded in the AutoGrader system.
- **Fix all of Professor Jensen's Logic, Grammar, and Spelling Errors**: Stephen reviews and corrects any logic, grammar, and spelling errors in Professor Jensen's course materials, ensuring clarity and accuracy.
- **Set up JWT Generation Service (ClassJWT)**: Lee sets up the JWT generation service, which provides authentication and authorization for the Pizza Shop application.
- **Set up Chaos Injection**: Lee is responsible for implementing chaos injection techniques to test the resilience and fault tolerance of the Pizza Shop application.
- **Videos Created**: Lee creates instructional videos to supplement the course materials, providing visual explanations and demonstrations of key concepts and techniques.
- **Canvas Complete**: Lee ensures that all course materials, assignments, and grades are properly organized and accessible on the Canvas platform.
- **AutoGrader**: Stephen develops and maintains the AutoGrader tool, which automates the grading process for assignments and provides feedback to students.
- **Set up Course Version of Backend Server (ClassBE)**: Lee sets up the course version of the backend server, which serves as the foundation for the Pizza Shop application.
- **Student Example Phase 1 - UI Testing, Deploy to GitHub Pages, with and without actions**: Lee provides a student example demonstrating UI testing and deployment of the Pizza Shop application to GitHub Pages, both with and without GitHub Actions.
- **Student Example Phase 2 - Cloudfront Deploy with Version Increment**: Lee provides a student example demonstrating the deployment of the Pizza Shop application to CloudFront with version incrementation.
- **Student Example Phase 3 - Backend Testing**: Lee provides a student example demonstrating backend testing techniques for the Pizza Shop application.
- **Student Example Phase 4 - Container Lambda Deployment, Aurora Setup**: Lee provides a student example demonstrating the deployment of the Pizza Shop application using containerized Lambda functions and setting up Aurora database.
- **Student Example Phase 5 - Deployment Strategies**: Lee provides a student example demonstrating different deployment strategies for the Pizza Shop application, such as blue-green deployment and canary deployment.
- **Student Example Phase 6 - Logging, Metrics, and Load Repo Complete**: Stephen ensures that the student example for logging, metrics, and load repository is complete, providing students with hands-on experience in monitoring and optimizing the Pizza Shop application.
- **Student Example Phase 7 - Load Repo Complete**: Stephen ensures that the student example for the load repository is complete, allowing students to simulate and analyze the performance of the Pizza Shop application under different load conditions.
- **Student Example Phase 8 - Chaos Injection**: Lee provides a student example demonstrating chaos injection techniques to test the resilience and fault tolerance of the Pizza Shop application.
- **Student Example Phase 9 - Pen Testing**: Lee provides a student example demonstrating penetration testing techniques to identify and address security vulnerabilities in the Pizza Shop application.
- **Instruction Written**: Lee completes the writing of instructional materials, including lecture notes, code explanations, and step-by-step guides.
- **Slides Written**: Lee creates and finalizes the lecture slides for the course, ensuring they are clear, concise, and visually appealing.
- **Videos Created**: Lee records and edits video tutorials and demonstrations to supplement the course content, providing additional learning resources for students.
- **AutoGrader Complete**: Stephen finishes the development and testing of the AutoGrader tool, ensuring it is fully functional and ready for use in grading student assignments.
- **Go Live**: All team members collaborate to ensure a smooth and successful launch of the course, addressing any last-minute issues and providing support to students as needed.

leesjensen: insert some more markdown content that complements the existing content

- **Lee's Core Responsibilities**

- [ ] Set up Chaos injection
- [ ] Instruction
- [ ] Videos
- [ ] Canvas
- [ ] Course repos
- [ ] Setup discord server

## Chaos Injection

- Implement chaos injection strategies to test the resilience and fault tolerance of the PizzaShop application.
- Use tools like Chaos Monkey or Gremlin to simulate various failure scenarios such as network failures, service disruptions, and resource exhaustion.
- Document the results of the chaos injection experiments and provide recommendations for improving the system's resilience.

## Instruction

- Develop clear and concise instructions for the students on how to complete each phase of the project.
- Include step-by-step guides, code snippets, and explanations to help students understand the concepts and tasks involved.
- Provide examples and best practices to guide students in implementing the required functionality.

## Videos

- Create instructional videos that walk students through the different phases of the project.
- Demonstrate the expected outcomes, explain the code implementation, and provide tips and tricks for troubleshooting and debugging.
- Make the videos engaging and interactive to enhance the learning experience.

## Canvas

- Set up a Canvas course to manage the course materials, assignments, and grades.
- Create modules and organize the content in a logical and structured manner.
- Upload the instructional videos, written instructions, and other relevant resources to the Canvas course.

## Course Repos

- Create separate repositories for each phase of the project to allow students to work on their assignments.
- Set up the necessary branches, permissions, and collaboration settings to facilitate the development process.
- Provide clear guidelines on how to clone, commit, and push changes to the course repositories.

## Setup Discord Server

- Create a Discord server for the course to facilitate communication and collaboration among students and instructors.
- Set up different channels for general discussions, Q&A sessions, and project-specific discussions.
- Encourage students to join the Discord server and actively participate in the community.
