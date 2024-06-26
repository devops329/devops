# Security

Now that you are moving to deploy your application with a cloud service provider it is important that we take a moment to discuss security. Security should be a foundational piece of your application design. An application that is not secure is an application that will eventually do more harm than good. It doesn't matter that you application provides hours of entertainment, increases your customer's financial wealth, or obtains world peace if it eventually leads to compromised credentials, the loss of personal information, or monetary theft.

You should seriously consider that God has given you talents that are meant to do eternal good. That includes watching out for those who have been entrusted to your care. Providing for their security is an important part of the responsibility.

## Security minded development

There are four major themes that you should consider when building a secure application.

1. **Education**: Becoming familiar with common and current attacks. Know industry best practices. Help educate all the members of your team.
1. **Prevention**: Instrument your code to reduce the attack surface area, secure credentials, encrypt data, authorize access, harden configurations, validate dependencies, and prevent injections.
1. **Detection**: Log usage, track metrics, and alert on anomalies.
1. **Remediation**: Deploy corrections quickly, notify impacted customers, report penetrations, and share attack vectors and vulnerabilities.

The important thing is that you are constantly including these themes in your design discussion and implementing them in your architectures. Hopefully you will see these themes repeatedly occurring trough out this course.

In order to make the concept of security more concrete, let's go ahead and review some specific topics.

## Roles

Identifying a user is called **Authentication**, defining what they can do is called **Authorization**. A role serves to formally define what a user's authorization is. Without that formal definition, the role is usually scattered across the application code. That makes it easy for an attacker to exploit subtle inconsistencies in the code.

### JWT Pizza Roles

The JWT Pizza Service does a reasonable job of defining roles in the database. It follows a `subject/predicate/object` pattern where a specific user is given a role for a specific object.

```sql
  `CREATE TABLE IF NOT EXISTS userRole (
    userId INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    objectId INT NOT NULL
  )`,
```

Specific roles are then defined in the code base.

```js
const Role = {
  Diner: 'diner',
  Franchisee: 'franchisee',
  Admin: 'admin',
};
```

This helps to formalize the definition of the possible roles. All of the secure endpoints then use the express middleware `setAuthUser` and `authenticateToken` to validate that a user is authenticated.

```js
async function setAuthUser(req, res, next) {
  const token = readAuthToken(req);
  if (token) {
    if (await DB.isLoggedIn(token)) {
      req.user = jwt.verify(token, config.jwtSecret);
      req.user.isRole = (role) => !!req.user.roles.find((r) => r.role === role);
    }
  }
  next();
}

authRouter.authenticateToken = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ message: 'unauthorized' });
  }
  next();
};
```

However, it is then left to the endpoint to actually check a role before authorizing access.

```js
if (!req.user.isRole(Role.Admin)) {
  // protected resource
}
```

While this makes it flexible for the endpoint to granularly provide access, it tends to sprinkle the enforcement throughout the code. It would be much better if an endpoint declaration contained the required role. That way it would be easy to audit all of the endpoints in one place and less likely that a programmer would forget a single `if` or `else` statement.

⚠️ It is important to note that the JWT Service enforces the roles and not the frontend client. The frontend should limit the views exposed to the customer, but in the end it must be the service that restricts access.

### AWS roles

The AWS IAM service has an extremely powerful authorization model. Roles are assumed by entities (users or services) to gain temporary permissions defined by an attached policy. Policies are defined by the following elements:

- **Effect**: Specifies whether the statement allows or denies access (either "Allow" or "Deny").
- **Action**: Specifies the actions that are allowed or denied. These are usually AWS service operations (e.g., s3:PutObject, ec2:StartInstances).
- **Resource**: Specifies the AWS resources to which the actions apply. Resources are identified using Amazon Resource Names (ARNs).
- **Condition** (Optional): Specifies conditions that must be met for the policy to apply. Conditions use keys, values, and operators (e.g., StringEquals, IpAddress).

The key harden the policy so that it only contains what the role actually needs. This is called the **Principle of Least Privilege** (PoLP). The following is a blatant violation of PoLP for a role that only needs to copy objects to a specific S3 bucket from a specific IP address.

```json
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}
```

A better policy would be:

```json
{
  "Effect": "Allow",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::example-bucket/*",
  "Condition": {
    "IpAddress": {
      "aws:SourceIp": "203.0.113.0/24"
    }
  }
}
```

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
