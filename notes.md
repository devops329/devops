## GitHub Pages

- [Instructions](https://pages.github.com/)
- Create a repo with the same name as the account and a `.github.io` suffix.
- Add a `index.html` file
- Go to `https://accountname.github.io`

## GitHub Actions

- [GitHub Token](https://dev.to/github/the-githubtoken-in-github-actions-how-it-works-change-permissions-customizations-3cgp)
- [Actions Tutorial](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Article similar to what i did](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [Docs Pages from actions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#creating-a-custom-github-actions-workflow-to-publish-your-site)
- add build.yml
- I got a good deployment script to work with just actions owned by github. But it only deploys to the [pizzashop repo](https://softwaredeliverymanagement329.github.io/pizzashop/). I need to figure out how to get it on a URL without a path.

## GitHub Projects

- I think we can make use of this.

## More GitHub Actions

Pull this into the content after merge.

[Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)
[GitHubActionsHero](https://github-actions-hero.vercel.app/)
[Pluralsight GitHub Actions](https://app.pluralsight.com/library/courses/github-actions-getting-started/table-of-contents)

- Created actions-demo repo
- Edit repo settings. Removed wiki, project, issues,
- Added Branches/Branch protection. Set on main, require pull requests with one approver, don't allow bypass
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

## Pull requests template

.github/pull_request_template.md

This shows up in the body of a pull request. Kinda of cool, I guess.
