# Integration testing

We previously briefly introduced the concept of integration testing. Let's take a bit of a deeper a look at what integration testing means and the tradeoffs that it presents.

- Making sure all your components work with each other.
- With unit testing you test a component in isolation. Usually with mocking out dependencies
- If your mock is wrong your test is wrong.
- You have to maintain your mock to match your components. 2X the dev effort.
- Integration testing makes you more confident that your code actually works
- Requires that your components are fast
- Requires that the dependent components are actually implemented. Not always possible when you have different teams building different parts. But you can have each team build a stubbed part of the application.

## JWT Pizza integration testing

![component overview](componentOverview.png)

An obvious candidate for integration testing is to assure the quality of the integration between the `jwt-pizza` and `jwt-pizza-service` code. Here are some of the options:

1. **None** - Don't do integration testing. This has some appeal. It means the frontend and backend teams can develop the application completely independent of each other. The frontend can build functionality that is still in the design phase on the backend. The test setup is easier in the sense that you don't need to run a backend at all. However, the benefits probably don't outweigh the advantages. Additionally, just because we mock out the coupling between the frontend and backend doesn't mean that you have removed the coupling. You have just hidden a whole class of bugs that the mocks may be hiding.
1. **jwt-pizza and jwt-pizza-service** - Integrate the testing of the frontend and the backend, but mock out the pizza factory service and the database seems like an obvious choice. With a mocked out database, the performance characteristics of the integration test should be excellent and we get a more realistic representation of the performance of the frontend/backend communication. We also will immediately know if we introduce any bugs in the service endpoints.
1. **jwt-pizza-service and database** - Integrate the testing of the backend and the database makes a lot of sense as long as we can initialize the database with sufficient testing data as well as be confident that the performance of the database in a development environment will not discourage the execution of tests.
1. **jwt-pizza, jwt-pizza-service, and database** - Integrate everything but the pizza factory. Since the pizza factory is outside of the codebase for the product it seems logical to exclude it. However, even testing this much of the application actually goes beyond integration testing and enters the realm of end-to-end testing. Additionally, the testing configuration of the database is going to be coupled to the tests that you run on the frontend. This might result in complex and brittle tests, or tests that require a significant amount of setup.
