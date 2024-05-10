# GitHub Pages

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

git remote set-url origin https://byucsstudent:xxxx@github.com/byucsstudent/jwt-pizza.git

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
