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

On easy way to populate your data is to use curl commands like the following. Note that you will need a POSIX compliant command console in order to use these commands. These commands rely on a program called **`jq`** (Json Query) which can be [installed easily](https://jqlang.github.io/jq/download/) for any common machine.

### Specifying the target host

First you need to assign the host that you are wanting to drive traffic against. If you are running in your development environment then it will look like this:

```sh
host=http://localhost:3000
```

If you are hitting your production system then you will set it to something like:

```sh
host=https://pizza-service.byucsstudent.click
```

### Login as admin

```sh
response=$(curl -s -X PUT $host/api/auth -d '{"email":"a@jwt.com", "password":"admin"}' -H 'Content-Type: application/json')
token=$(echo $response | jq -r '.token')
echo $response
```

### Add users

```sh
curl -X POST $host/api/auth -d '{"name":"pizza diner", "email":"d@jwt.com", "password":"diner"}' -H 'Content-Type: application/json'

curl -X POST $host/api/auth -d '{"name":"pizza franchisee", "email":"f@jwt.com", "password":"franchisee"}' -H 'Content-Type: application/json'
```

### Add menu

```sh
curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Veggie", "description": "A garden of delight", "image":"pizza1.png", "price": 0.0038 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Pepperoni", "description": "Spicy treat", "image":"pizza2.png", "price": 0.0042 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Margarita", "description": "Essential classic", "image":"pizza3.png", "price": 0.0042 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Crusty", "description": "A dry mouthed favorite", "image":"pizza4.png", "price": 0.0028 }'  -H "Authorization: Bearer $token"

curl -X PUT $host/api/order/menu -H 'Content-Type: application/json' -d '{ "title":"Charred Leopard", "description": "For those with a darker side", "image":"pizza5.png", "price": 0.0099 }'  -H "Authorization: Bearer $token"
```

### Add franchise and store

```sh
curl -X POST $host/api/franchise -H 'Content-Type: application/json' -d '{"name": "pizzaPocket", "admins": [{"email": "f@jwt.com"}]}'  -H "Authorization: Bearer $token"

# Add store
curl -X POST $host/api/franchise/1/store -H 'Content-Type: application/json' -d '{"franchiseId": 1, "name":"SLC"}'  -H "Authorization: Bearer $token"
```
