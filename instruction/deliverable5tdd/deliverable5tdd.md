# Deliverable ⓹ Test driven development: JWT Pizza

🔑 **Key points**

- Use TDD to create documentation
- Use TDD to improve code abstractions
- Use TDD to support refactoring

---

![course overview](../sharedImages/courseOverview.png)

## Prerequisites

Before you start work on this deliverable make sure you have read all of the preceding instruction topics and have completed all of the dependent exercises (topics marked with a ☑). This includes:

- ☑ [Test driven development (TDD)](tdd/tdd.md)

Failing to do this will likely slow you down as you will not have the required knowledge to complete the deliverable.

## Getting started

The JWT Pizza CEO wants to add a few new features to the application before we go live. This includes:

| Feature            | Description                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Change credentials | As a user I can change my email and password.                                                                                                                                                   |
| View users         | As an admin I can see a list of all users. Each user's name, email, and role is displayed. The list is paginated with a length of 10. The list can be filtered by email address, role, or name. |
| Modify user        | As an admin I can change any user's name, email, and roles.                                                                                                                                     |
| Delete user        | As an admin I can delete any user.                                                                                                                                                              |

## Design

### Wireframes

Change my email, name, or password from the user view.

![alt text](updateUserWireframe.png)

List, filter, modify, and delete users from the admin view.

![alt text](adminUsersWireframe.png)

### Endpoint definitions

| method | endpoint                           | request body                                                                        | response body                                                                                                                                                               |
| ------ | ---------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PUT    | /api/user/:userId                  | {"name":"bob","email":"a@jwt.com", "password":"admin", "roles":[{"role": "diner"}]} | {"email":"a@jwt.com", "roles":[{"role": "diner"}]}                                                                                                                          |
| DELETE | /api/user/:userId                  |                                                                                     |                                                                                                                                                                             |
| GET    | /api/user?email=\*&name=\*&role=\* |                                                                                     | {"users":[<br/>{"id":3,"name":"Kai Chen","email":"d@jwt.com","roles":[{"role":"diner"}]},<br/>{"id":5,"name":"Buddy","email":"b@jwt.com","roles":[{"role":"admin"}]}<br/>]} |

## ⭐ Deliverable

In order to demonstrate your mastery of the concepts for this deliverable, complete the following.

1. Create Playwright tests for `jwt-pizza` that provide at least 80% coverage.
1. Create a GitHub Actions workflow that executes the tests.
1. Add the configuration necessary so that the workflow fails if there is not 80% coverage.
1. Add the reporting of the coverage to the workflow by creating a coverage badge in the README.md file.

Once this is all working, go to the [AutoGrader](https://cs329.cs.byu.edu) and submit your work for the deliverable.

### Rubric

| Percent | Item                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| 30%     | Successful execution of GitHub Actions to run test on commit                       |
| 70%     | At least 80% line coverage as documented by workflow execution and README.md badge |
