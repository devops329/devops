# GitHub Pages

🔑 **Key points**

- GitHub pages allow you to do an easy static deployment.

---

📖 **Deeper dive reading**: [GitHub Pages Quickstart](https://docs.github.com/en/pages/quickstart)

---

With our newly delivered JWT Pizza frontend and the understanding of what a static deployment looks like, we can take the next step of deploying the frontend to the world.

One easy way to do this is to use a service from `GitHub` called `GitHub Pages`. At a basic level, GitHub Pages is a simple HTTP file server that publishes a set of files under a GitHub URL. To use GitHub pages you do the following:

1. Create a branch on your GitHub repository. This branch is commonly called `gh-pages`.
1. Push your static deployment files to the branch.
1. Modify the repository settings to indicate that you want to statically host the newly created branch with the GitHub Pages HTTP file server.
1. (_Optionally_) Associate a DNS domain name to reference your static deployment.

Once you have completed these steps you can access your static deployment from anywhere in the world by either the default URL, `youraccountname.github.io/yourrepositoryname`, or from the custom domain name that you provide.

In the following instruction you will use GitHub Pages to deploy the JWT Pizza frontend code.

## GitHub Pages at the account level

In addition to hosting a static deployment for a repository you can also do this for your entire account. However, in this case, instead of using a special branch, you create a special repository named `youraccountnamehere.github.io`. In the example below, we created an account level static deployment for the account named `byucsstudent` by creating the `byucsstudent.github.io` repository and populating it with a simple `index.html` file.

![Create account GitHub pages](createAccountGitHubPages.png)

Once this is done deploying you can view the result at [https://byucsstudent.github.io](https://byucsstudent.github.io).

![Sample GitHub Pages site](sampleGitHubPagesSite.png)

You should try this out for your own GitHub repository.
