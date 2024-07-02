# GitHub Pages

🔑 **Key points**

- GitHub pages allow you to do an easy static deployment.

---

📖 **Deeper dive reading**: [GitHub Pages Quickstart](https://docs.github.com/en/pages/quickstart)

---

Now that you know how static deployment works, you can take the next step of selecting a tool that supports the static deployment model.

One easy way to do this is to use a service from `GitHub` called `GitHub Pages`. At a basic level, GitHub Pages is a simple HTTP file server that publishes a set of files under a GitHub URL. To use GitHub pages you do the following:

1. Create a branch on your GitHub repository. This branch is commonly called `gh-pages`.
1. Push your static deployment files to the branch.
1. Modify the repository settings to indicate that you want to statically host the newly created branch with the GitHub Pages HTTP file server.
1. (_Optionally_) Associate a DNS domain name to reference your static deployment.

Once you have completed these steps you can access your static deployment from anywhere in the world by either the default URL, `youraccountname.github.io/yourrepositoryname`, or from the custom domain name that you provide.

In future instruction you will use GitHub Pages to deploy the JWT Pizza frontend code.

## GitHub Pages at the account level

In addition to hosting a static deployment for a **repository** you can also do this for your **entire account**. However, in this case, instead of using a special branch, you create a special repository that follows the pattern: `youraccountnamehere.github.io`. In the example below, we created an account level static deployment for the account named `byucsstudent` by creating the `byucsstudent.github.io` repository and populating it with a simple [index.html](gitHubPagesExample/index.html) file.

![Create account GitHub pages](createAccountGitHubPages.png)

You can see an example of this hosted on [https://byucsstudent.github.io](https://byucsstudent.github.io).

## ☑ Assignment

Create an account level static deployment using GitHub Pages by doing the following:

1. Create a repository that follows the pattern: `youraccountnamehere.github.io`.
1. Adding an `index.html` to the root of the repository.

Once you are done, go over to Canvas and submit a screenshot of your account static website deployment. This should look something like this:

![Sample GitHub Pages site](sampleGitHubPagesSite.png)
