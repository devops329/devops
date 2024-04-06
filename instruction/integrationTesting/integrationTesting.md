# Integration testing

- Making sure all your components work with each other.
- With unit testing you test a component in isolation. Usually with mocking out dependencies
- If you mock is wrong your test is wrong.
- You have to maintain your mock to match your components. 2X dev
- Integration testing makes you more confident that your code actually works
- Requires your components are fast
- Requires that the dependent components are actually implements. Not always possible when you have different teams building different parts. But you can have each team build a stubbed part of the application.
