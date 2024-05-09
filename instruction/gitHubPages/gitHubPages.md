# GitHub Pages

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

I had to set the upstream to contain a password since it was the student account.

git remote set-url origin https://byucsstudent:xxxx@github.com/byucsstudent/jwt-pizza.git

I had to change all the paths to be relative and add a vite config so that it doesn't put an absolute base path.

- ☑ Deploy the static `PizzaShop` to github pages by manually updating the branch. This is a static manual deployment.

[GitHub Instructions](https://pages.github.com/)

## Repo pages

This works by creating a branch of the `PizzaShop` repo that pages pulls from.

## Account pages

Might be nice to know how to create a pages for your account

Create a repo with the same name as the account and a `.github.io` suffix.

- Add a `index.html` file
- Go to `https://accountname.github.io`
