# Deliverable ⓵ Development deployment: JWT Pizza

🔑 **Key points**

- Deploy JWT Pizza to GitHub Pages.

[🎥 Video overview](https://youtu.be/oKXmatAJRyU)

---

![course overview](../sharedImages/courseOverview.png)

## Prerequisites

Before you start work on this deliverable make sure you have read all of the proceeding instruction topics and have completed all of the dependant exercises (topics marked with a ☑). This includes:

- ☑ [JWT Pizza Service](jwtPizzaService/jwtPizzaService.md)
- ☑ [JWT Pizza data](jwtPizzaData/jwtPizzaData.md)
- ☑ [JWT Pizza Client](jwtPizzaClient/jwtPizzaClient.md)

Failing to do this will likely slow you down as you will not have the required knowledge to complete the deliverable.

## Getting started

You now have everything you need to complete the first deliverable of the course. In this deliverable you will demonstrate that you have spent the time necessary to completely understand the JWT Pizza application front and backend code.

You can now point your browser to the GitHub pages site for your repository and see the index.html page you just created. Note that sometimes you need to wait a couple of minutes before GitHub will refresh its internal cache before you will see your change.

```sh
curl https://youaccountnamehere.github.io/jwt-pizza/

Hello GitHub Pages
```

## Assigning a custom domain

The JWT Pizza frontend doesn't work correctly unless it is hosted on the root path of the domain. By default, GitHub Pages hosts the static deployment on a path called `jwt-pizza`. To get around this you must associate a custom domain with your GitHub Pages deployment.

> [!NOTE]
> If you do not already own a DNS hostname, you will need to go lease one now. You will use your hostname for all of your DevOps deployment tasks. You can lease a domain from AWS using Route53 or use a different provider if you are familiar with an alternative.

Using your domain name take the following steps in order to associate it to your GitHub Pages.

1. Add a `CNAME` record to your domain name DNS records that points to the GitHub Pages hostname. For example, if your GitHub account name was `byucsstudent`, you owned a domain named `byucsstudent.click`, and you wanted to associate the static deployment of JWT Pizza with the subdomain of `pizza.byucsstudent.click` you would create the following DNS record.
   ```txt
   record name: pizza.byucsstudent.click
   record type: CNAME
   record value: byucsstudent.github.io
   ```
1. Wait for the newly created record to propagate. You can use `nslookup` or `dig` to verify that it is available.
1. Open the GitHub Pages settings for the fork of your jwt-pizza repository.
1. Put your subdomain name in the `Custom domain` edit box and press `Save`.
   > ![Custom domain entry](customDomain.png)
1. Check the box to `Enforce HTTPS`. It is interesting to consider how GitHub is able to generate a certificate for your domain.
1. After the check completes you can navigate your browser to your subdomain and verify that "Hello GitHub Pages" is still being displayed.

   ```sh
   curl https://pizza.youdomainhere

   Hello GitHub Pages
   ```

   The previous `youraccountnamehere.github.io/jwt-pages` URL should now redirect you with an HTTP `301` response to your new domain.

## Deploying JWT Pizza

Now you are ready to actually deploy the JWT Pizza frontend. Open your development environment command console and run the following commands.

1. On the `main` branch, make sure we have the correct dependencies, and use Vite to bundle the frontend into a directory named `dist`.
   ```sh
   git checkout main
   npm ci
   npm run build
   ```
1. You also need to make a fix related to how GitHub Pages handles unknown requests. The problem is that the React Router used by the frontend relies on the HTTP file server to redirect back to `index.html` if an unknown path is requested. GitHub Pages attempts to serve a file named `404.html` when it can't find a requested file. So if you copy `index.html` over to `404.html` it will basically redirect all unknown requests back to `index.html` and the React Router will correctly interpret the path.
   ```sh
   cp dist/index.html dist/404.html
   ```
1. Change to the `gh-pages` branch, delete the old deployment, and copy the bundled version into its place.
   ```sh
   git checkout gh-pages
   rm -r assets *.html *.jpg *.png
   cp -r dist/* .
   ```
1. Add the files to git, commit, and push.
   ```sh
   git add .
   git commit -m "deploy(v1)"
   git push
   ```
   That should do it. You can verify that it all worked by opening your browser and start ordering pizzas.

![JWT Pizza](../jwtPizzaClient/jwtPizzaPhone.png)

## ⭐ Deliverable

Complete the steps outlined above with your own fork of the jwt-pizza repository and your custom domain name.

Once JWT Pizza is live on your domain, go to the [AutoGrader](https://cs329.cs.byu.edu) and submit your work for the deliverable.

### Rubric

| Percent | Item                                                                                        |
| ------- | ------------------------------------------------------------------------------------------- |
| 70%     | Successful manual deployment of JWT Pizza to GitHub Pages using a `gh-pages` branch         |
| 30%     | Completely functional JWT Pizza deployed with GitHub Pages accessible on custom domain name |
