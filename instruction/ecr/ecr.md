# AWS Elastic Container Registry (ECR)

Using ECR console I created a new repository called test329. I believe you can also create one with the AWS CLI

```sh
aws ecr create-repository --region us-east-1 --repository-name test329
```

- **Registory**: contains one or more repositories
- **Repository**: contains tags that differentiate between versions of an image

The format of images are:

```sh
registry/repository[:tag]

# examples
leesjensen/server:v2  # DockerHub registry
test329/server:v2     # ECR registry
```

Note that both of these are in my local registry, but I want the names to match my target and source registries.

I have an image in my local repository and I want to copy it to ECR.

```sh
docker image ls --all
REPOSITORY         TAG       IMAGE ID       CREATED      SIZE
leesjensen/cs329   v2        c991dea0fffd   9 days ago   137MB
```

I then created a new tag on the image so that it is associated with my ECR repository.

```sh
docker tag leesjensen/cs329:v2 public.ecr.aws/r5d4e2p2/test329:latest

docker image ls --all
REPOSITORY                        TAG       IMAGE ID       CREATED      SIZE
leesjensen/cs329                  v2        c991dea0fffd   9 days ago   137MB
public.ecr.aws/r5d4e2p2/test329   latest    c991dea0fffd   9 days ago   137MB
```

I need to authenticate with ECR. First I to authenticate with AWS. I did this using a temporary AWS authorization token. Then I ran:

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/r5d4e2p2
```

I can then push to ECR.

```sh
docker push public.ecr.aws/r5d4e2p2/test329:latest
```

Tada! The image is now in ECR.
