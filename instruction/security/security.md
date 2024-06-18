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

## Common attacks

- Phishing: Attempting to acquire sensitive information such as usernames, passwords, and credit card details by masquerading as a trustworthy entity in electronic communications.
- Malware: Malicious software designed to harm, exploit, or otherwise compromise computer systems. Types of malware include viruses, worms, Trojans, ransomware, and spyware.
- Ransomware: A type of malware that encrypts the victim's files and demands a ransom payment to restore access to the data.
- Denial of Service (DoS) and Distributed Denial of Service (DDoS): Attacks aimed at making a system, service, or network resource unavailable to its intended users by overwhelming it with a flood of illegitimate requests.
- Man-in-the-Middle (MitM): An attacker intercepts and possibly alters the communication between two parties who believe they are directly communicating with each other.
- SQL Injection: A code injection technique that exploits a security vulnerability in a website's software by injecting malicious SQL statements into an entry field for execution.
- Cross-Site Scripting (XSS): A security vulnerability typically found in web applications that allows attackers to inject malicious scripts into webpages viewed by other users.
- Password Attacks: Attempts to obtain or guess passwords through various methods, including brute force, dictionary attacks, and credential stuffing.
- Zero-Day Exploit: An attack that targets a previously unknown vulnerability in software or hardware, which has not yet been patched or disclosed.
- Insider Threats: Attacks originating from within the organization, carried out by employees, contractors, or others with internal access.
- Social Engineering: Manipulating individuals into divulging confidential information or performing actions that compromise security, often through deception and psychological manipulation.
- Advanced Persistent Threat (APT): A prolonged and targeted cyberattack in which an intruder gains access to a network and remains undetected for an extended period.
- Drive-by Download: The unintentional download of malicious software onto a user’s computer when they visit a compromised or malicious website.
- Eavesdropping: Intercepting and listening to private communications, such as network traffic, without the consent of the communicating parties.
- Session Hijacking: Taking over a user session by obtaining or predicting the session ID, enabling the attacker to assume the identity of the user.

## Non-software security concerns

In addition to securing your software application, it is important that your organization if familiar with non-software associated attacks. This includes:

- **Social engineering attacks**: Human subversion of security controls and practices based on emotional appeal.
- **Insider threats**: Insufficient hiring practices, periodic reviews of internal staff, automated auditing controls, restriction of access to least privilege, or consensus access controls (where multiple independent parties are required to provide credentials for access).
- **Physical security**: Insufficient physical controls to sensitive infrastructure or workspaces.
- **Improper data management**: Allowing confidential data to be accessed without authorization or to be transported outside the security parameter.
- **Insecure network typography**: Allowing non-authorized, or insecure devices, within the security parameter.
