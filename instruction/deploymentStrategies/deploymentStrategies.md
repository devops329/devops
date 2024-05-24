# Deployment strategies

There are many different deployment strategies. Each address different system complexities and needs. All strategies require some concept of a version. Usually N-1 compatibility is required unless you do `Reboot`.

An important consideration is how your compute is structured. Is it a fixed set, or can you allocate new resources temporarily during deployment.

- Reboot - Kill, replace, and restart everything. Current customer interactions disrupted. Easy to implement. But may fail to restart.
- Canary - Allow a small percentage of users to see the new version. Metrics verify it is good. If good flip all users.
- Rolling deployment - Like canary, but you keep going until 100%. Usually you have a fixed set of compute resources and you move one at a time.
- Blue/Green - Have two sets of compute resources. One is stage and one is prod. You flip which is which on the load balancer. The old prod become the new stage and you start deploying candidate features there.
- A/B testing - Filter on loadbalancer, or by cookies, who gets the A and who gets the B. Metrics report on success.
- Continuous Deployment - goes automatically. Differentiate from Continuous Delivery which might have a manual gate.
- Feature switch (URL parameter, user setting, or subdomain)

## Branches

Consider creating a production branch. They you have scripts that do the testing on every commit, but only a prop branch commit would push to production.
