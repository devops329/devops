# Bugs and security

## Known bugs

1. Service: You can register a user with the same email multiple times.
   - Fix by making email unique on the db schema.
1. Service: MySQL connections never get closed
   - Fix by closing the connections in a finally block
1. Factory: If you have multi-byte unicode characters emoji in your name the generated JWT is invalid
   - Fix by add `Buffer.from` when creating the JWT `.update(Buffer.from(JSON.stringify(payload), 'utf8'))`

## Known security vulnerabilities

1. Inject on order description
1. Escalation on add user with a given role
1. Reveals config `server: Express`
1. If you use the same name for creating a franchise it will leak the SQL error
1. Returns code stack with error
1. Docs page has the demo data user's email and password
1. Does not use cookies
1. The default jwtSecret is not changed in their `config.js` file.
1. Deployment will log db credentials when a connection failure happens.
1. There is a default admin user with an email and password displayed in the docs
