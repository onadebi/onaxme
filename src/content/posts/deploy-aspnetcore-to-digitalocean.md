---
layout:  ../../layouts/MarkdownPostLayout.astro
title: 'Deployment of AspNetCore on Digital Ocean'
pubDate: 2025-03-30
description: 'A practical guide to deploying an ASP.NET Core application to DigitalOcean.'
author: 'Onadebi'
image: {url: 'https://plus.unsplash.com/premium_photo-1687119905599-09fe40700389?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt:'Deployment'}
tags: ["blogging","journaling"]
---
# Deploy ASP.NET Core on DigitalOcean

Published on: 2025-03-30

Deploying a web application to a remote server can feel intimidating at first, especially when you are moving from localhost to a production environment. In this post, I’ll walk through the process of deploying an ASP.NET Core app to DigitalOcean in a simple, practical way.

## Why deploy to DigitalOcean?

DigitalOcean gives developers a straightforward and affordable way to host web applications. It is especially useful for small teams, personal projects, and learning environments where you want full control without the complexity of a larger cloud platform.

For ASP.NET Core apps, the process usually includes:

1. Preparing the application for production.
2. Creating a server on DigitalOcean.
3. Installing the required runtime and dependencies.
4. Publishing the app.
5. Configuring a process manager and reverse proxy.
6. Serving the application securely over HTTPS.

## Step 1: Publish the ASP.NET Core app

Before you upload anything, publish the application in Release mode.

```bash
dotnet publish -c Release
```

This produces a publish folder containing the compiled app and its dependencies. The output is what you will deploy to your server.

## Step 2: Create a DigitalOcean droplet

From the DigitalOcean dashboard:

- Create a new droplet
- Choose a Linux distribution such as Ubuntu
- Select a size that fits your app needs
- Set up SSH access using your public key

Once the droplet is created, connect to it via SSH.

```bash
ssh root@your_server_ip
```

## Step 3: Install .NET runtime

If the runtime is not already installed, install the required ASP.NET Core runtime on the server.

```bash
sudo apt-get update
sudo apt-get install -y aspnetcore-runtime-8.0
```

You may need to match the runtime version of your application.

## Step 4: Upload the published files

Use SCP or another file transfer method to copy the published app to the server.

```bash
scp -r ./bin/Release/net8.0/publish/* root@your_server_ip:/var/www/myapp
```

This keeps the app files organized in a dedicated directory.

## Step 5: Run the app as a service

For production, it is better to run the app using a service manager like `systemd`.

Create a service file:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Add the following contents:

```ini
[Unit]
Description=ASP.NET Core Web App

[Service]
WorkingDirectory=/var/www/myapp
ExecStart=/usr/share/dotnet/dotnet /var/www/myapp/MyApp.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=myapp
User=root
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_ROOT=/usr/share/dotnet

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
```

## Step 6: Configure Nginx as a reverse proxy

To expose the app on port 80 and handle HTTP traffic properly, configure Nginx.

Install Nginx:

```bash
sudo apt-get install -y nginx
```

Then create a site config:

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Example:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Secure with HTTPS

For production, it is recommended to use a domain and Let’s Encrypt certificate.

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

This automatically configures SSL for your site and updates the Nginx settings.

## What I learned

The transition from a local development environment to a live deployment is one of the biggest steps in building software. The process is much less mysterious once you separate it into clear stages: publish, transfer, run as a service, and proxy traffic.

The main lesson is that deployment is not just copying files to a server. It is about making the app run reliably, stay alive, and be served securely.

## Final thoughts

Deploying ASP.NET Core to DigitalOcean is a practical and approachable workflow once you know the standard steps. With a publish folder, a Linux server, a service manager, and a reverse proxy, your application can be made available to the world in a clean and manageable way.

This is one of those skills that becomes much easier after the first successful deployment, and from there it becomes a repeatable part of your development process.