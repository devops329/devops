# Security

They will will have to implement the Roles for the stack

- Talk about IAM

This needs to be sprinkled throughout the class.

- Logging/Metrics - Immutable logging for forensic and suspicious usage patterns alerting
- Cloud deployment - Credential management, roles, firewalls, security groups
- Load testing - DDos attack management
- Playbooks - Recovery plan for penetration isolation and management
- Penetration testing

## Dependency security

This repo

```
https://github.com/miketako3/cloki
```

Looks like it will make logging easier to do.

What does the alternative actually look like? Whenever you pull in some random package you are introducing a security risk. The source for this project is only 160 lines long.

https://github.com/miketako3/cloki/blob/main/src/logger.ts

It is probably safer to just pull in the lines of code. Review each one and skip the dependency.

This would be a great discussion for the course about security.
