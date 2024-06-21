# Deployment strategies

There are many different deployment strategies you can use when deploying your application. Each of the different strategies address a specific system complexities. All strategies require some concept of a version and they usually requires some level of compatibility between deployed versions.

## Branches

Git branches can serve as a foundational piece of your deployment strategy. It is very common for teams to use either the main branch or a production branch as the sole source for all production releases. New features and fixes are done on separate branches that are named after the feature, or as the anticipated next version number. All testing happens on the feature branch and changes are only merged to the main branch once they have been thoroughly tested.

You can also use branches as the source for different deployment environments. For example, the `main` branch goes to production, the `next` branch goes to staging, and the `experimental` branch goes to the research team environment.

## Rollback

You must also consider the possibility that you need to roll your application back as well as rolling forward. This happens when a bug has slipped through the quality assurance process. When it is necessary to rollback a deployment it is usually critical to do it quickly. You cannot wait to rebuild an older version from your Git commit chain, or for significant resources to be allocated in order to support the unexpected deployment.

## Version compatibility

An important consideration for deploying a new version, is its compatibility with previous and future versions. In an ideal world all versions of the software would be compatible with all other versions. In reality that is hard to deliver. Database schemas change, old features are dropped, and new ones added. Parameters for endpoints also change. If you are not careful this can trigger significant failures and even destroy customer or application data.

A common strategy is to keep N-1 compatibility. This means that the new version is always compatible with the previous version. The new version can add new functionality, but it always has code that handles how things were done previously. In the most problematic cases this code usually takes the form of a conditional that creates a shim for the old functionality that makes it appear like the new functionality.

![N - 1 compatible](n-1compatible.png)

Once you have deployed the new version, the next version can remove the shims because version N+1 does not have to be compatible with version N-1.

The danger with this strategy is that if you discover a problem after you have rolled multiple versions ahead, you will not simply be able to rollback to the stable version since that may introduce data corruption. However, assuming that your release cycles are something around a week apart, the likelihood of multi-version rollback becomes small.

## Deployment resources

An important consideration of application deployment is the required resources. Common strategies include:

- **In situ**: Replace the old application on existing resources as each one is temporarily taken off line.
- **Rolling**: Allocate a small percentage of new resources, take the same percentage offline and replace it with the new version. Then use the old resources that were just removed to be the next replacement block.
- **Immutable**: Allocate up entirely new resources, switch, and then throw away the old resources.

With the advent of cloud computing, it is so easy and cheap to spin up new resources that the **immutable** strategy is very attractive. This is especially true since it is closely related to strategies for increasing elasticity due to changes in customer demand. It is also easy to rollback as long as you keep the old version's resources around until you are confident that the system is stable.

## Strategies

The following is a list of common deployment strategies. There is not perfect strategy that works for all situations and you can even combine strategies into hybrids to handle complex architectures that have multiple levels of deployment concerns.

### Reboot

Stop, delete, replace, and restart everything. This has the advantage of being very simple and removing all possible dependencies between versions. It also requires a minimum of resources since you simply reuse everything that was already deployed. However, for anything but development or prototype deployments, this is usually a poor solution. Your customers will be interrupted, it is difficult to rollback, and it leaves your application dead if it fails to restart.

### Canary

This strategy is called a canary because, like the coal mines of old, a canary is used to see if there is a looming failure before you expose everyone to the new version. You start by exposing the new version to a small number of users. You can make the requests sticky so that a specific customer only sees one version, or allow all the customers to bounce back and forth in order to determine that the versions are compatible with each other. If all of your observability metrics show that things are going well with the canary, you can increase the number of customers on the new version. When a significant percentage of customers are successfully using the canary, you switch everyone over.

### Rolling

The rolling strategy partitions the resources into equal parts. Each partition is then successively taken offline and replaced with the new version and put back online. As the process continues a greater percentage of the application is running the new version.

### Blue/Green

With the blue/green strategy you allocate two equal sets of resources. The green set represents the new version and the blue represents the old version. You then drain all users off from teh blue version and move them to the green version. If there is problem then you simply switch the load back. With this strategy you can allocate an entirely new

### A/B testing

Filter on loadbalancer, or by cookies, who gets the A and who gets the B. Metrics report on success.

### Continuous

goes automatically. Differentiate from Continuous Delivery which might have a manual gate.

### Feature switched

(URL parameter, user setting, or subdomain)

### Serverless
