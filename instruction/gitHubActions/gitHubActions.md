# GitHub Actions

- [Quick Start](https://docs.github.com/en/actions/quickstart)
- [GitHub Token](https://dev.to/github/the-githubtoken-in-github-actions-how-it-works-change-permissions-customizations-3cgp)
- [Actions Tutorial](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Article similar to what I did](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [Docs Pages from actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#creating-a-custom-github-actions-workflow-to-publish-your-site)
- add build.yml
- I got a good deployment script to work with just actions owned by github. But it only deploys to the [pizzashop repo](https://softwaredeliverymanagement329.github.io/pizzashop/). I need to figure out how to get it on a URL without a path.

You define a workflow that is triggered by events and runs jobs that have steps that do actions. A step is either a shell script or an action to run.

Jobs run in parallel. They can be dependent on each other.

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    name: build and test
  job2:
    name: lint and security analysis
    needs: job1
  job3:
    name: deploy
    if: ${{ success() }}
    needs: [job1, job2]
```

[Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)
[GitHubActionsHero](https://github-actions-hero.vercel.app/)
[Pluralsight GitHub Actions](https://app.pluralsight.com/library/courses/github-actions-getting-started/table-of-contents)

- Created actions-demo repo
- Edit repo settings. Removed wiki, project, issues,
- Added Branches/Branch protection. Set on main, require pull requests with one approver, don't allow bypass
- I enabled auto delete and suggest merge on pull requests
- Created a TA team
- Added actions-demo repo to TA team so they can maintain it
- cloned the repo locally, added vanilla vite app, and pushed
- Added Branches/Branch protection on main don't allow bypass
- Made a change to the code in dev.
- Tried to push, got this error now because even the admin can bypass
  ```sh
  git push
      Enumerating objects: 5, done.
      Counting objects: 100% (5/5), done.
      Delta compression using up to 8 threads
      Compressing objects: 100% (3/3), done.
      Writing objects: 100% (3/3), 359 bytes | 359.00 KiB/s, done.
      Total 3 (delta 1), reused 0 (delta 0), pack-reused 0
      remote: Resolving deltas: 100% (1/1), completed with 1 local object.
      remote: error: GH006: Protected branch update failed for refs/heads/main.
      remote: error: Changes must be made through a pull request.
      To https://github.com/softwaredeliverymanagement329/actions-demo.git
      ! [remote rejected] main -> main (protected branch hook declined)
      error: failed to push some refs to 'https://github.com/softwaredeliverymanagement329/actions-demo.git'
  ```
- Created a `phase1` branch and pushed.
  ```sh
  git branch phase1
  git push origin phase1
  ```
- Now I have two branches for the repo
- Went to GitHub and viewed the `phase` branch. Created a pull request.
- Got the warning that at least on reviewer is required before merge.
- Couldn't review, because I can't review my own pull request. Arrrgh! So I change the admin bypass restriction back. Now an admin can make changes.
- However, I want to test this and so I create a student account.
- Created a new github user account and invited user
  - byucsstudent
  - lee@cs.byu.edu
- I create a Team called students and add the byucsstudent to the team.
- I give the students team the ability to write, but that requires them to write using a pull request.
- The student then goes to their github account, views the actions-demo repo and makes a change. When they commit it says they must create a branch and use a pull request. Nice!
- The pull request shows that it is block on a review before it can merge.
- As an admin I can review the pull request and approve it. Now it is ready to merge and so I do that.
- I can also delete the student submitted branch so that we keep things clean.
- As an admin I can also create a branch and pull request. The student can then review it and merge it in.
- Love this. It should definitely be an assignment so that they learn how to work as a team. We can have them talk to someone in class has have them act as the reviewer. Or have a TA act as a reviewer. However, that would require that they get invited to their repo. Maybe at the beginning of class we should have a partner. If that partner fails we can replace them with a TA.

# GitHub Actions Docs

> The following was taken directly from the GitHub documentation.

## Workflows

A workflow is a configurable automated process that will run one or more jobs. Workflows are defined by a YAML file checked in to your repository and will run when triggered by an event in your repository, or they can be triggered manually, or at a defined schedule.

Workflows are defined in the .github/workflows directory in a repository, and a repository can have multiple workflows, each of which can perform a different set of tasks. For example, you can have one workflow to build and test pull requests, another workflow to deploy your application every time a release is created, and still another workflow that adds a label every time someone opens a new issue.

You can reference a workflow within another workflow. For more information, see "Reusing workflows."

For more information about workflows, see "Using workflows."

Events
An event is a specific activity in a repository that triggers a workflow run. For example, activity can originate from GitHub when someone creates a pull request, opens an issue, or pushes a commit to a repository. You can also trigger a workflow to run on a schedule, by posting to a REST API, or manually.

For a complete list of events that can be used to trigger workflows, see Events that trigger workflows.

## Jobs

A job is a set of steps in a workflow that is executed on the same runner. Each step is either a shell script that will be executed, or an action that will be run. Steps are executed in order and are dependent on each other. Since each step is executed on the same runner, you can share data from one step to another. For example, you can have a step that builds your application followed by a step that tests the application that was built.

You can configure a job's dependencies with other jobs; by default, jobs have no dependencies and run in parallel with each other. When a job takes a dependency on another job, it will wait for the dependent job to complete before it can run. For example, you may have multiple build jobs for different architectures that have no dependencies, and a packaging job that is dependent on those jobs. The build jobs will run in parallel, and when they have all completed successfully, the packaging job will run.

For more information about jobs, see "Using jobs."

## Actions

An action is a custom application for the GitHub Actions platform that performs a complex but frequently repeated task. Use an action to help reduce the amount of repetitive code that you write in your workflow files. An action can pull your git repository from GitHub, set up the correct toolchain for your build environment, or set up the authentication to your cloud provider.

You can write your own actions, or you can find actions to use in your workflows in the GitHub Marketplace.

For more information, see "Creating actions."

## Runners

A runner is a server that runs your workflows when they're triggered. Each runner can run a single job at a time. GitHub provides Ubuntu Linux, Microsoft Windows, and macOS runners to run your workflows; each workflow run executes in a fresh, newly-provisioned virtual machine. GitHub also offers larger runners, which are available in larger configurations. For more information, see "About larger runners." If you need a different operating system or require a specific hardware configuration, you can host your own runners. For more information about self-hosted runners, see "Hosting your own runners."
