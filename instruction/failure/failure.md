# Failure

🔑 **Key points**

- Failure is inevitable; the goal is to plan for it and mitigate its impact.
- Failure can occur at multiple levels, from hardware to software.
- Effective failure management utilizes both proactive and reactive strategies.

---

Failure is inevitable. It cannot be entirely avoided; it can only be anticipated. Success lies in preparing contingencies to mitigate the impact of failure so that customer disruption is minimal or non-existent.

Failure management is generally categorized into two approaches: **proactive** and **reactive**.

Being **proactive** involves an upfront investment to theorize, design, and implement failure management systems before issues occur. When executed correctly, this approach decreases customer frustration and preserves the company's reputation.

Being **reactive** is a viable solution if you can respond before the failure causes significant impact. This requires significant investment in system observability, rapid automation, and the ability to quickly revert problematic deployments or configuration changes.

Effective DevOps engineers utilize a combination of both proactive and reactive approaches. Proactive strategies are essential when the cost of repair is high, such as the loss of vital customer data. Reactive strategies are effective when a failure can be easily isolated, allowing the system to automatically remove a faulty component and redeploy a replacement. Once isolated, the faulty component is analyzed to improve the system and prevent recurrence.

## Levels of failure

Failure can occur at any level of the stack. Working for a software company does not mean you can ignore hardware or network-level risks. You must evaluate the possibility and impact of failure at every level.

| Level    | Considerations                                                      | Mitigation Strategies                                                                                 |
| -------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Hardware | Physical infrastructure including servers, storage, and memory.      | Failover to redundant hardware; implement resource quotas to prevent exhaustion.                       |
| Network  | Internal and external communication channels.                       | Implement redundant network paths; scale bandwidth; limit per-user consumption (rate limiting).       |
| Service  | Internal and external service dependencies (APIs, databases).       | Implement fallbacks to secondary services; deploy additional service capacity.                        |
| Software | Bugs, version incompatibilities, or logic errors.                   | Roll back to previous versions; implement "graceful degradation" (limited functionality).             |
| Device   | Incompatibility with customer hardware or OS updates.               | Root cause identification and rapid deployment of software patches or updates.                        |

## Failure considerations

Building a "perfect" system is rarely possible or cost-effective. Instead, you should evaluate the impact of potential failures across several dimensions to prioritize your efforts.

| Dimension               | Description                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Immediate monetary cost | The direct cost of the failure, including lost revenue, increased operating bills, or the resources required for resolution.                          |
| Customer impact         | The effect on user retention and trust. Could customers lose data or be harmed financially, socially, or physically?                                  |
| Legal impact            | The risk of criminal or civil fines, breach of contract, or lawsuits.                                                                                 |
| Performance impact      | The degree to which system performance degrades, potentially rendering the system unusable or hindering observability.                                |
| Complexity              | The difficulty of diagnosing and replacing the failed component, and the risk of mitigation causing cascading effects.                                |
| Image                   | The damage to the company’s reputation (e.g., being perceived as technically inept, insecure, or indifferent).                                        |
| Prevention cost         | The total investment (time, money, and complexity) required to prevent the failure.                                                                   |
| Likelihood              | The statistical probability of the failure occurring.                                                                                                 |

You can simplify these factors into three main variables: **Impact**, **Likelihood**, and **Prevention Cost**. Use these to determine where to focus your mitigation efforts using the following priority equation:

![priority equation](priorityEquation.png)

## Load failure

Startups often focus on functionality and proof-of-concept before realizing the impact of exponential success. Unless a system is designed for scalability, sudden popularity can cause crashes that destroy the application's traction. While some overloaded systems occasionally gain a "publicity bonus" because of high demand (e.g., the early days of ChatGPT), this is short-lived; customers quickly become frustrated. It is far better to provide a seamless experience from the start and let that success drive growth.

Modern cloud infrastructure makes it easier to build scalability into an application from the beginning. Utilizing services like AWS EC2, S3, RDS, ALB, ECS, and CloudFront provides a strong foundation. What once required a large team of IT specialists and years of planning can now be deployed and maintained by a single capable DevOps engineer in a matter of hours.

## Security failure

Failure is not always the result of internal shortcomings; external bad actors may actively seek to profit from your system's vulnerabilities. Security failures—including DDoS (Distributed Denial of Service) attacks, ransomware, intellectual property theft, or identity theft—have destroyed otherwise successful companies. You must assume that a security event is not a matter of *if*, but *when*.

Defend against security failures by implementing these best practices:

1. **Education**: Every team member must understand that they are a potential source of failure. This includes the code they write, the features they request, and the communications they handle. Training the team on social engineering and common attack vectors is a foundational element of defense.
2. **Layering**: Never rely on a single security measure. Implement "defense in depth" by forcing attackers to penetrate multiple layers. This increases the chance of detecting a threat before it escalates.
3. **Isolation**: Place critical resources in isolated environments accessible only to the parties or automated processes that require them. By isolating production, billing, and logging environments, you ensure that even if one area is compromised, the entire system is not at risk.
4. **Observability**: Instrument your system to ensure security breaches are discovered quickly. This includes automated notifications and responses to unusual behavior. Ensure your logging data is immutable so that attackers cannot hide their tracks.
5. **Testing**: Regular penetration testing is vital. You cannot be confident in your security posture until it has been tested against earnest attack simulations.
6. **Audits**: Automate audits of network access controls, open ports, credential management, encryption, and configurations. While annual manual audits are common, automated checks prevent insecure practices from being deployed in the first place.

## A bit of fun

![XKCD](bugReport.png)

> _source: [XKCD](https://xkcd.com/1822/)_