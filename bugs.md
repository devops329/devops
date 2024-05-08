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
1. Doesn't delete cookie on logout
   - Fixed: res.clearCookie('token');
1. Reveals config `server: Express`
1. If you use the same name for creating a franchise it will leak the SQL error
1. Returns code stack with error
1. Docs page has the demo data user's email and password
1. Does not secure cookies
   - `res.cookie('token', token, { secure: true, httpOnly: true, sameSite: 'strict' });`
