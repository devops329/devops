# Blue Green deployment

This is the one I think we will use because it is supported both by lambda and Fargate.

- Blue current stable (prod)
- Green next version (staging)

Have two complete systems. swap when the staging becomes stable. Allow for rollback until new features are deployed to Green.
