# Failure

Failure happens. There is no way to avoid it. You can only anticipate and prepare for contingencies to mitigate the impact of the failure so that the customer impact is minimal or even non-existent. You can either be proactive or reactive to your failure management. Being proactive requires you to pay an upfront cost to theorize, design, and implement a failure management system. However, if done correctly, it will decrease customer frustration and preserve the reputation of your company's offerings.

Being reactive works as a viable failure management solution, if you can react quickly before the failure has any significant impact. This usually means that you have invested significantly in the observability of the system, system automation that can be deployed quickly, or that you can quickly revert problematic deploy or configuration changes.

Usually a successful DevOps engineer with use both proactive and reactive approaches then designing a system. Proactive approaches are attractive when the cost of repair is high, such as losing vital customer data or deploying the system to an completely different environment. Reactive approaches are attractive when the failure can easily be isolated and it is sufficient to simply automatically pull out a bad component and redeploy a replacement. The bad component is then analyzed and the system improved to avoid future failure.

## Levels of failure

Failure can happen at any level. Just because you work for a software company does not mean that you can ignore the possibility of failure at the hardware or network level. You need to evaluate the possibility and impact of each level.

| Level    | Considerations                                                      | Mitigation                                                                                            |
| -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Hardware | System hardware including servers, storage, and memory.             | Redirect to redundant hardware. Throttle single user consumption until resolution.                    |
| Network  | Internal and external communication networks.                       | Redirect to redundant networks. Deploy additional bandwidth. Limit single user bandwidth consumption. |
| Service  | Internal and external service dependencies.                         | Fallback on secondary services. Deploy additional service capacity.                                   |
| Software | Bugs, incompatibilities, changes in assumptions.                    | Rollback to previous version. Fallback to limited functionality.                                      |
| Device   | Incompatibility with customer devices or operating system upgrades. | Identification of root cause and automatic deployment of corrected version.                           |

## Failure considerations

Building the perfect system is usually not possible or desired due to cost and resource constraints. However, you should consider the impact of each possible failure along the following dimensions. Create a rating scale of 1 to 5 and come up with a formula that helps you prioritize which failures you want to address immediately and which ones can wait until it can be mitigated appropriately.

| Dimension               | Description                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Immediate monetary cost | How much will the failure cost your company? Will it put you out of business, incur higher a operating bill, or require significant resources to resolve? |
| Customer impact         | Will the customer be so dissatisfied that they retention decreases? Will the customer lose data, harmed monetarily, socially, or physically?              |
| Legal impact            | Does the failure create the possibility of criminal or civil fines and/or lawsuits?                                                                       |
| Performance impact      | Is the performance of the system degrade such that it becomes unusable or that observability becomes hampered?                                            |
| Complexity              | Is the failure is a part of the system that is difficult ot diagnose, replace, or is so fragile that a mitigation might have a cascading effect.          |
| Image                   | Will the failure damage the reputation for the company either as technically inept, unsecure, or uncaring?                                                |

## Load failure

It is common for startup companies to focus on functionality and proof of concepts before the realize the impact of exponential success. Unless your system is designed with a path for scalability you will immediately destroy any traction your application gains, with a system that immediately crashes when it has significant load. Sometimes a popular overloaded system can make the news and gain a publicity bonus because everyone want to use the greatest new application (e.g. ChatGPT), but that will only last a short time as customers become upset and dissuaded about the reality of your offering. It is much better to give your customer a phenomenal experience from the start and let the viral effect of their success drive your growth.

With today's cloud infrastructure it is not difficult to design your application with scalability built in from the beginning. Utilizing AWS EC2, S3, RDS, ALB, ECS, and CloudFront services is a great place to start. What used to take an entire team of IT specialists years of planning to build, can be spun up and maintained by a single capable DevOps engineer.

## Security failure

Sometimes failures has nothing to do with any inherit internal shortcoming. There are bad actors who will profit from your failure and they must be considered in your failure management and mitigation strategy. This can include things like DDos, ransomware, intellectual property theft, or identity theft failures. These types of failures have taken down companies with solid business and technical ability. To avoid these types of failures you much be aware of and actively preventing common and developing threats. As with any type of failure, it is not a matter of if a security failure will happen, but when. Make sure you prevent against security failures with some of these best practices:

1. **Education**: Every team member must be aware that they are a potential source of failure. This includes the code they write, the features they request, or the phone calls and emails they respond to. Educating the team concerning common attacks is a foundational piece of denying attacks.
1. **Layering**: Never relay on a single layer of security. Slow down an attacker by forcing them to penetrate multiple levels before they gain any value. This will allow you to detect the threat before it escalates out of control.
1. **Isolation**: Put important resources in isolated environments that are inaccessible only to parties (hopefully automated ones) that have the need to access them. This makes it difficult to manually manage a system, but automated observability and correction should be the focus of critical system, not that a rogue developer can SSH into any servers and tweak a setting. By completely isolating your production, billing, and logging environment you gain confidence by knowing that your inability to access the system makes it more difficult for a nefarious party to gain access.
1. **Observability**: You cannot prevent security failure, but you can instrument the system such that it is discovered quickly. This includes automatic notifications and automated responses to detected intrusions or unusual behavior. You must also make sure that your observability data is immutable. This keeps an attacker from hiding their tracks.
1. **Testing**: Regular, component, penetration testing is a vital part of preventing security failure. You cannot be confident in your security until you know that ernest attempts have failed.
1. **Audits**: Automated audits of network access control, open ports, credential management, encryption, components, and configuration are essential to keeping you system in compliance. It is common to manually audit your system once a year, only to discover that security holes have developed since the last audit. It is much better to automate the checks and disallow bad security practices from being deployed in the first place.
