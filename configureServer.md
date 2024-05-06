# Creating a cs329 web server from scratch

First we want to configure AWS and rent the server using AWS EC2. Using the AWS browser console do the following.

- Open the AWS EC2 Browser Console
- Create security group (one time action)
  - `cs329-webserver`
  - HTTP, HTTPS from everywhere
  - SSH from BYU `128.187.0.0/16`
  - Outbound to anywhere
  - Tag with Owner:cs329
- Create EC2 instance
  - Select Ubuntu
  - Named `cs329-webserver`
  - Tag with Owner:cs329
  - t3.micro
  - Create key pair (one time action) `cs329`
  - Select security group: `cs329-webserver`
  - Enabled Credit `specification:Unlimited` in advanced details
- Store key pair in development environment and restrict the rights
  - chmod 600 ~/keys/cs329/cs329.pem

Now we can install Caddy, NVM, Node, and PM2

- Shell into server
  - `ssh -i ~/keys/cs329/cs329.pem ubuntu@0.0.0.0` (substitute IP address)
- Install Caddy

  ```sh
  sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
  sudo apt update
  sudo apt install caddy
  ```

  - Test. `curl localhost` should display caddy HTML. You should also be able to hit if from your development environment in your browser using the instance's IP address

  - Allow the ubuntu user to modify the public_html static files and Caddyfile
    - `sudo chown -R ubuntu /usr/share/caddy`
    - `sudo chown -R ubuntu /etc/caddy/Caddyfile`
  - Create symlink for Caddyfile and Caddy static content directory
    - `ln -s /etc/caddy/Caddyfile Caddyfile`
    - `ln -s /usr/share/caddy public_html`

- Replace default Caddy static files with file found in the webprogramming329 repo
  - `scp -i ~/keys/cs329/cs329.pem webServerDefault.html ubuntu@0.0.0.0:public_html/index.html`
  - Hitting the server from the browser should now display the course default page.
- Install node.js
  - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
  - `. ~/.nvm/nvm.sh`
  - `nvm install --lts` (this installed version 20.12.2)
- Set up PM2
  - npm install pm2 -g
- Add service directory
  - Create the services directories `mkdir -p ~/services`
- Deploy JWT-pizza-factory
  ```sh
  cd jwt-pizza-factory
  ./deployService.sh -k ~/keys/cs329/cs329.pem -h 3.235.158.123
  ```
- Test that they work with `node` and `curl`
  - `cd ~/services/jwt-pizza-factory`
  - `node index.js 4000`
  - `curl -v http://localhost:4000`
  - Stop the server
- Register each service with PM2
  - `cd ~/services/jwt-pizza-factory && pm2 start index.js -n jwt-pizza-factory -- 4000`
  - `pm2 save`
  - `pm2 startup` will show you the command daemonize PM2. Run that command.
- Test that they work
  - `curl http://localhost:3000`
- Configure Caddy to run services
  - edit Caddyfile `sudo vi ~/Caddyfile`
  - replace the contents of the Caddyfile with `Caddyfile-base` found in devops329 repo.
  - save and restart Caddy `sudo service caddy restart`
