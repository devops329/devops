# GitHub Pages

With our newly delivered JWT Pizza frontend and the understanding of what a static deployment looks like we can take the next step of deploying the frontend to the world.

One easy way to do this is to use `GitHub Pages`. At a basic level GitHub Pages is a simple HTTP file server that allows you to publish a set of files under a GitHub URL. You create a branch on your GitHub repository that contains static web files and then you modify the repository settings to indicate that you want to statically host that branch with the GitHub Pages HTTP file server.

## Create the gh-pages branch

To configure GitHub Pages to host a static deployment we need to first create a branch that has the files we want to host.

1. Open **your fork** of the `jwt-pizza` repository on GitHub.com.
1. Create a new branch of the code called `gh-pages` by navigating to the branch view by clicking on the branch navigation icon.
   > ![branch icon](branchNavigationIcon.png)
1. Press the `New Branch` button, supply the name `gh-pages`, and press the `Create new branch` button.
   > ![New Branch Modal](newBranchModal.png)
1. Next we need to associate our new branch with GitHub Pages by selecting the `Setting` option form the main navigation.
1. Select the `Pages` option from the left hand navigation.
1. Select the `Source` option and choose `Deploy from a branch`
   > ![GitHub Pages settings](gitHubPagesSettings.png)
1. This will cause a `Branch` option to become available. Press the branch dropdown, select the `gh-pages` branch, and press `Save`.
   > ![gh-pages branch selection](ghPagesBranchSelection.png)

This will make the branch available from a URL that references your repository. The GitHub Pages settings view will display the name of the URL, but it should be something like:

```txt
https://youraccountnamehere.github.io/jwt-pizza/
```

## Creating a static deployment

Now we can copy the branch to your development environment, set up some files, and push it back to GitHub so that it will be statically deployed.

1. Open a command console in your development environment.
1. Navigate to your cloned copy of `jwt-pizza`.
1. Run the following commands to copy the `gh-pages` branch locally.

   ```sh
   git fetch origin gh-pages
   git checkout -b gh-pages origin/gh-pages
   ```

   This branch should contain all of the files that represent the jwt-pizza frontend. However, since that is the frontend code we need to instead provide the bundled code that Vite creates. Before we do that let's deploy a simple Hello World page to make sure things are working.

1. Delete all of the code in the branch. Remember, that this branch is just to host a static deployment on GitHub Pages. We will never merge it back into `main`.
   ```sh
   rm -r * .env* .vscode
   print "hello GitHub pages" > index.html
   git add .
   git commit -m "initial(pages)"
   git push
   ```

You can now point your browser to the GitHub pages site for your repository and see the index.html page you just created.

```sh
curl https://youaccountnamehere.github.io/jwt-pizza/
Hello GitHub Pages
```

## Deploying JWT Pizza

Now we are ready to actually deploy the JWT Pizza frontend. In your development environment command console and run the following commands.

```sh
git checkout main
git npm run build
git checkout gh-pages
cp -r dist/* .
git add .
git commit -m "deploy(v1)"
git push
```

This runs Vite on the main branch in order to bundle the frontend into a directory named `dist`. We then change back into the deployment branch. Because the `dist` directory is not tracked thanks to the .gitignore entry it is visible in the `gh-pages` branch. We then copy the files over, add, commit, and push.

# Research

There is a major bug that I don't know how to fix. Any refresh on a subpath will cause a 404 since GitHub pages doesn't know how to resolve the React Router path.

This is discussed here:

https://stackoverflow.com/questions/46056414/getting-404-for-links-with-create-react-app-deployed-to-github-pages

THe solution is to move to HashHistory instead of browserHistory. I guess that would work.

You can also copy `index.html` to `404.html` and GitHub pages will serve that file up.

## gh-pages NPM package

This is created by the create-react-team, but it mostly works for Vite also. You just need to change the `-d build` param to be `-d dist`

https://create-react-app.dev/docs/deployment/#github-pages

```sh
npm -D install gh-pages
```

Modify package.json

```json
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://github.com/byucsstudent/jwt-pizza.git",
```

## Setting the upstream user and password

I had to set the upstream to contain a password since it was the student account. This is really valuable since I can set it on a repo instead of an account.

```sh
git remote set-url origin https://byucsstudent:xxxx@github.com/byucsstudent/jwt-pizza.git
```

## Fixing the JTW Pizza code

I had to change all the paths to be relative and add a vite config so that it doesn't put an absolute base path.

I had to also configure Vite to not prefix the base of the generated paths by adding a `vite.config.js` file.

**vite.config.js**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
});
```

## Publishing with a GitHub branch

https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#creating-a-custom-github-actions-workflow-to-publish-your-site

create the branch

```
git checkout -b gh-pages
npm install
npm run build
git add -f dist
git commit -am "version(1)"
git push https://github.com/byucsstudent/jwt-pizza.git
```

This created a branch in github with the dist dir, but I want only the dist dir to be there.

first time:

```sh
git pull
git branch pages
```

following times:

```sh
git checkout pages
npm run build

```

## Repo pages

This works by creating a branch of the `PizzaShop` repo that pages pulls from.

## Account pages

Might be nice to know how to create a pages for your account

Create a repo with the same name as the account and a `.github.io` suffix.

- Add a `index.html` file
- Go to `https://accountname.github.io`
