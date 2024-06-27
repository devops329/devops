# Self healing

Fargate automatic replacement and multiple data centers.

ALB automatically redirects traffic

Route 53 has health checks with automatic redirection of DNS records

S3 has massive redundancy. You can also deploy and mirror to multiple regions.

CloudFront is global and provides regional redundancy

You can also deploy to multiple data centers and even regions.

Redundancy / fallbacks?

Availability zone scaling
Regional scaling

I was just reading the line in the status reporting instruction about 'circuit breakers', or fallbacks. What would fallbacks / redundancy look like in the context of JWT Pizza?

Professor Jensen — Today at 11:13 AM
For example, the factory pizza order might fail. The pizza service would then store the order in a database for later processing and report to the customer that they will be notified when the order is complete (with a coupon or discount), or give them a chance to cancel the order altogether.

Redundancy would mean that you have a secondary factory, perhaps in a different region, that might not be able to process the order as quickly, but will get the job done while the primary factory is not responding.

Feel free to add content like this if you think it will help.
The idea is to never say something like:

Error (500): looks like we are lame

Stephen Amos — Today at 11:15 AM
Haha yeah makes sense. So we won't actively build fallbacks into our app, but it would be good to discuss with them

Professor Jensen — Today at 11:16 AM
I don't think I built any.

Stephen Amos — Today at 11:16 AM
Would that maybe be in self healing?

Professor Jensen — Today at 11:17 AM
Self healing would actually automatically fix the nonresponsive factory service. For example, the metric might trigger an automated action that spins up a new factory service and replace it.

We actually do this for the pizza service. The ALB monitors the health of the container. If it fails, it will spin up a new container.

Stephen Amos — Today at 11:18 AM
Ok. I'm just not sure where we would talk about redundancy.
Also should the status instruction be in the failure management section, instead of load testing section?

- We need a discussion on scalability, bottlenecks, and auto adjustment. This should tie into SLO.
