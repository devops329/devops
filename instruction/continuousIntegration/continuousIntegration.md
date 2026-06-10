# Continuous integration

🔑 **Key points**

- Continuous integration (CI) is the practice of frequently merging code changes into a central repository to be validated by automated builds and tests.

---

If automation is the mantra of DevOps, then continuous integration (CI) is the engine that drives it. The goal of CI is to increase the speed and efficiency with which code moves from a developer's workstation to a shared codebase. This automated flow is known as a CI pipeline.

![Continuous integration](continuousIntegration.png)

A CI pipeline typically begins when a developer commits code to a repository. This commit triggers an automated sequence that includes code analysis (such as linting and coverage) and automated testing. If any of these steps fail, the pipeline aborts, and the commit is rejected until the issues are resolved.

Once a change passes all automated checks, it is bundled into a build artifact and stored in a version archive. At this stage, the code is a candidate for deployment to a production system. In a continuous delivery or deployment process, the version is often automatically deployed to a staging environment. In this environment, the pipeline may continue with more rigorous automation, such as integration, end-to-end, chaos, and penetration testing.

A CI pipeline involves many moving parts. If these were all manual steps, they would require constant oversight and could take weeks to fully validate a single change. By automating the pipeline with safety checks at every step, teams can confidently move code from development to a production-ready state in a matter of minutes.