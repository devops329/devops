# Lambda

Lambda added the ability to associate a URL, and optionally authentication, with a function. That sounds great! Maybe I won't have to use API gateway.

## Function URL

A function URL is a dedicated HTTP(S) endpoint for your function. When your function URL is configured, you can use it to invoke your function through a browser, curl, Postman, or any HTTP client. When you configure a function URL from the main function page, Lambda assigns the function URL to the $LATEST unpublished version of your function. You cannot assign a function URL to any other function version, but you can assign a function URL to any function alias.

To secure your function URL, you can choose between IAM authorization (AWS_IAM) or no authorization (NONE). If you decide not to use IAM authorization, you should implement your own authorization logic in your function. Function URLs can support JWT/OIDC/OAuth2 authentication methods.

To control access to your function URL from other origins, you can also configure Cross-Origin Resource Sharing (CORS).

I used this to create a URL that is publicly available. It just returns a hard coded store object.

```sh
https://l4jzevaddlpr53lxtup5sy3ve40geiyy.lambda-url.us-east-1.on.aws/
```

## Attaching a DB

Now I need to hook it into a database so that the function can actually load up the data dynamically.

Lambda has a wizard that will launch the db and configure all the security. Hummm.

https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/lambda-rds-connect.html
