# JWT Pizza data

🔑 **Key points**

- Use Curl to populate the JWT Pizza data when testing.

---

In order to use your JWT Pizza Service in any meaningful way you are going to need to populate it with some basic data such as menu items, franchises, stores, and users.

When you start up your JWT Pizza Service for the first time, it will initialize your database with all the required tables and create a single administrative user with the following defaults:

- **Name**: 常用名字
- **Email**: a@jwt.com
- **Password**: admin

You can use these credentials to populate your database with information that makes the JWT Pizza interesting to use.

## Using Curl to populate the data

One easy way to populate your data is to use curl commands like the following. Note that you will need a POSIX compliant command console in order to use these commands. These commands rely on a program called **`jq`** (Json Query) which can be [installed](https://jqlang.github.io/jq/download/) in your development environment. If you run into issues with `jq` on Windows, make sure the downloaded file is renamed to `jq.exe` (instead of e.g., `jq-win64.exe`) and is moved into a directory [in your system's PATH](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/).

### Specifying the target host

First you need to assign the host that you are wanting to drive traffic against. If you are running in your development environment then it will look like this:

```sh
host=http://localhost:3000
```

Later, once you get your pizza server running in a production cloud deployment environment, you will set host to the host name for your production pizza service. This will be something like:

```sh
host=https://pizza-service.yourdomainname.click
```

### Login as admin

This will log in as the default admin and capture the authentication token in a shell variable.

```sh
response=$(curl -s -X PUT $host/api/auth -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json')
token=$(echo $response | jq -r '.token')
echo $response
```

### Add users

This adds a diner and franchisee user. You will use the franchisee user again when you create a franchise and store.

```sh
curl -X POST $host/api/auth -d '{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json'

curl -X POST $host/api/auth -d '{"name":"pizza franchisee", "email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json'
```

### Add menu

This populates the menu with a variety of pizzas.

```sh
curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Veggie", "description": "A garden of delight", "image":"pizza1.png", "price": 0.0038 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Pepperoni", "description": "Spicy treat", "image":"pizza2.png", "price": 0.0042 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Margarita", "description": "Essential classic", "image":"pizza3.png", "price": 0.0042 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Crusty", "description": "A dry mouthed favorite", "image":"pizza4.png", "price": 0.0028 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Charred Leopard", "description": "For those with a darker side", "image":"pizza5.png", "price": 0.0099 }'  -H "Authorization: Bearer $token"
```

### Add franchise and store

This creates a franchise and a store so that you can purchase pizzas.

```sh
curl -X POST $host/api/franchise -H 'Content-Type: application/json' -d '{"name": "pizzaPocket", "admins": [{"email": "f@jwt.com"}]}'  -H "Authorization: Bearer $token"

curl -X POST $host/api/franchise/1/store -H 'Content-Type: application/json' -d '{"franchiseId": 1, "name":"SLC"}'  -H "Authorization: Bearer $token"
```

## Generating DB data script

Once you understand how the commands above function, it's helpful to have them combined into a single script to run them for you. Reducing toil is the name of the DevOps game, after all! The [generatePizzaData.sh](generatePizzaData.sh) provides an example of doing this.

You can run this script by providing the URL of the server you want to target. In the following example, make sure you replace the Headquarters pizza URL with `localhost:3000` if you are running against your development environment, or your production pizza service URL if you are trying to generate the dummy data there.

```sh
./generatePizzaData.sh https://pizza-service.yourdomainname.click
```

> [!NOTE]
>
> If you create your own `generatePizzaData.sh` file instead of using the exiting one, then you might need to set the execution mode of the file by running: `chmod +x generatePizzaData.sh`

## ☑ Exercise

Once you have the JWT Pizza Service running in your development environment, execute the above commands from your console command application.

Once you are done, you should be able to use `curl` to output the menu as follows:

```sh
curl -s localhost:3000/api/order/menu | jq '.[].description'

"A garden of delight"
"Spicy treat"
"Essential classic"
"A dry mouthed favorite"
"For those with a darker side"
```
