# Containers

![container overview](containerOverview.png)

**OCI** - Open Container Initiative - What the open source name specification for all things docker.

- Image spec
- Runtime spec
- Distribution spec (registries)

https://www.docker.com/resources/what-container/

![containers and vms](contianersAndVms.png)

## Installation

On windows and Mac you have to install a virtual machine so that you can run Linux and thus have docker.

The easiest way to do this is to install docker desktop from the docker website.

https://docs.docker.com/get-docker/
![docker installation](dockerInstallation.png)

![docker sign up](dockerSignUp.png)

After installing Docker Desktop there are some simple tutorials that you can run through.

You create an image and then you create a container to host the image. You can start and stop the container.

## Building an image

I ran `docker init` in a directory. This set up the Dockerfile and a compose.yaml file.

Then I went and build a simple node.js express app. I then build the image and pushed it to dockerhub using my leesjensen account.

```sh
docker image build -t leesjensen/cs329:v2 .
docker push leesjensen/cs329:v2
```

## DockerHub

Cloud repository for images. I created my account `leesjensen` and a repo `cs239`

I created a tag in my local repository and then pushed it up to docker hub

```sh
docker tag docktest-server:latest leesjensen/cs329:v1
docker push leesjensen/cs329:v1
```

You can build, set the OS version, and push to dockerhub all in one command.

```sh
docker buildx build --platform linux/arm64/v8 --push --tag leesjensen/server:v2 .
```

I can then delete the local image, pull it down again, are start it running as a container.

```sh
docker image rm leesjensen/cs329:v2
docker container run -d --name server -p 4000:3000 leesjensen/cs329:v2
```

`-d` means to run it in the background, `--name` is the name to run the container under. `-p` is the port mapping, and then the registry/repo:tag that I want to pull down and run.

## Containers

I can list the running containers with

```sh
docker container ls
```

I can stop and start the container with

```sh
docker container stop 867eff82a98e
docker container start 867eff82a98e
```

Delete the container 867eff82a98e

```sh
docker container rm
```

I can also use the name that I provided, `server`, when I created the container to run these commands.

```sh
docker container run -d --name server -p 4000:3000 leesjensen/cs329:v2
docker container stop server
```

### Running a container interactively

Run the standard `linux` container and start a shell. The last parameter is the process to run. Since we specified sh, the shell starts. We could also run `ls`.

```sh
docker container run -it --name demo alpine sh
```

To stop the container and exit the interactive shell just type `exit`, or to leave it running press `CTRL+P+Q`.

To remove a container use

```sh
docker container rm demo
```

Normally you would have to stop a container before you remove it, but you can use the force `-f` flag to both stop and remove it.

![vm and containers](vmAndContainers.png)

You can think of virtual machines as virtual devices that run on top of the hardware level.
You can think of containers as virtual machines that run on top of the operating system level.

## Docker CLI Reference

```sh
docker ps
docker ps --all
docker images
docker start <container id>
docker stop <container id>
docker exec <container id> ls -la # runs a command on the container
docker compose up   # build an image and started a container
docker kill <container id> # kills the container
```

```txt
docker

Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Common Commands:
  run         Create and run a new container from an image
  exec        Execute a command in a running container
  ps          List containers
  build       Build an image from a Dockerfile
  pull        Download an image from a registry
  push        Upload an image to a registry
  images      List images
  login       Log in to a registry
  logout      Log out from a registry
  search      Search Docker Hub for images
  version     Show the Docker version information
  info        Display system-wide information


Commands:
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  import      Import the contents from a tarball to create a filesystem image
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes

Management Commands:
  builder     Manage builds
  buildx*     Docker Buildx (Docker Inc., v0.12.1-desktop.4)
  compose*    Docker Compose (Docker Inc., v2.24.5-desktop.1)
  container   Manage containers
  context     Manage contexts
  debug*      Get a shell into any image or container. (Docker Inc., 0.0.24)
  dev*        Docker Dev Environments (Docker Inc., v0.1.0)
  extension*  Manages Docker extensions (Docker Inc., v0.2.21)
  feedback*   Provide feedback, right in your terminal! (Docker Inc., v1.0.4)
  image       Manage images
  init*       Creates Docker-related starter files for your project (Docker Inc., v1.0.0)
  manifest    Manage Docker image manifests and manifest lists
  network     Manage networks
  plugin      Manage plugins
  sbom*       View the packaged-based Software Bill Of Materials (SBOM) for an image (Anchore Inc., 0.6.0)
  scout*      Docker Scout (Docker Inc., v1.4.1)
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

```

## Building a container

I then ran `docker init`

```ps
docker init

Welcome to the Docker Init CLI!

This utility will walk you through creating the following files with sensible defaults for your project:
  - .dockerignore
  - Dockerfile
  - compose.yaml
  - README.Docker.md

Let's get started!

? What application platform does your project use? Node
? What version of Node do you want to use? 20.10.0
? Which package manager do you want to use? npm
X Sorry, your reply was invalid: Value is required
? What command do you want to use to start the app? npm run start
? What port does your server listen on? 3000

CREATED: .dockerignore
CREATED: Dockerfile
CREATED: compose.yaml
CREATED: README.Docker.md

✔ Your Docker files are ready!
```

Then I went and build a simple node.js express app.

And ran `docker compose up`. I think this ran `docker build .` and then started a container with the resulting image. I was able to then open the browser and see my website.
