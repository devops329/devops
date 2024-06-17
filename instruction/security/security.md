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

## Encryption

at rest and in transit.
KMS.

## Network security

Public/ Private networks.
Security groups (firewalls).
ACLs.

## Package security

Do you know what source code is in all of the NPM packages you have downloaded?

We need to create a Pizza Factory Pizza maker NPM package that allows us to delete the database.

## Protecting credentials

Never let them get in logs.

Keep them out of code.

Best if you never have them at all.

Never store them in your dev environment.

Secrets manager.

## Layers

for example, consider the database.

1. Passwords are hashed
1. Database is encrypted
1. Server is on a private network
1. Only authorized devices can access the private network.
1. Those devices are only accessible over HTTPS through the ALB.

## Hardening

Reducing down the rights that the IAM roles have

## Removing default settings

Like the default DB admin user

## Store credentials with a third party

Passwords in GitHub actions.
Circle CI got hacked.

## Logging

Immutable, accessible, and searchable

## Alerts

You will get hacked, you need to be notified.

### Honeypots

## Non-software security concerns

In addition to securing your software application, it is important that your organization if familiar with non-software associated attacks. This includes:

- **Social engineering attacks**: Human subversion of security controls and practices based on emotional appeal.
- **Insider threats**: Insufficient hiring practices, periodic reviews of internal staff, automated auditing controls, restriction of access to least privilege, or consensus access controls (where multiple independent parties are required to provide credentials for access).
- **Physical security**: Insufficient physical controls to sensitive infrastructure or workspaces.
- **Improper data management**: Allowing confidential data to be accessed without authorization or to be transported outside the security parameter.
- **Insecure network typography**: Allowing non-authorized, or insecure devices, within the security parameter.
