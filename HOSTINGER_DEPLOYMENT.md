# Hostinger VPS Deployment Guide

**Domain:** pronovacrypto.tech
**Network:** BSC Testnet (Chain ID: 97)

---

## Prerequisites on Your VPS

SSH into your Hostinger VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## Step 1: Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Run these SQL commands:
CREATE USER pronova_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';
CREATE DATABASE pronova_db OWNER pronova_user;
GRANT ALL PRIVILEGES ON DATABASE pronova_db TO pronova_user;
\q
```

**Remember:** Replace `YOUR_SECURE_PASSWORD` with a strong password.

---

## Step 2: Clone and Setup Project

```bash
# Create web directory
sudo mkdir -p /var/www/pronova
sudo chown -R $USER:$USER /var/www/pronova

# Clone repository (or upload files via SFTP)
cd /var/www/pronova
git clone YOUR_REPO_URL .

# Or if uploading manually, upload all files to /var/www/pronova
```

---

## Step 3: Setup Backend

```bash
cd /var/www/pronova/backend

# Install dependencies
npm install

# Copy production environment file
cp .env.production .env

# Edit .env with your actual values
nano .env
```

**Important:** Update these values in `.env`:
- `DATABASE_URL` - Use the password you set for PostgreSQL
- `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `JWT_REFRESH_SECRET` - Generate another one

```bash
# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# Build TypeScript
npm run build

# Test if it works
npm start
# Press Ctrl+C to stop

# Start with PM2 (production)
pm2 start dist/server.js --name "pronova-api"
pm2 save
pm2 startup
```

---

## Step 4: Build Frontend

```bash
cd /var/www/pronova

# Copy production environment
cp .env.production .env

# Install dependencies
npm install

# Build for production
npm run build

# The build folder now contains the production frontend
```

---

## Step 5: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/pronovacrypto.tech
```

Paste this configuration:

```nginx
# Frontend - pronovacrypto.tech
server {
    listen 80;
    server_name pronovacrypto.tech www.pronovacrypto.tech;
    root /var/www/pronova/build;
    index index.html;

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API - api.pronovacrypto.tech
server {
    listen 80;
    server_name api.pronovacrypto.tech;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pronovacrypto.tech /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 6: Setup DNS Records

In your Hostinger DNS panel (or domain registrar), add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 3600 |
| A | www | YOUR_VPS_IP | 3600 |
| A | api | YOUR_VPS_IP | 3600 |

Replace `YOUR_VPS_IP` with your Hostinger VPS IP address.

---

## Step 7: Setup SSL (HTTPS)

```bash
# Get SSL certificate for all domains
sudo certbot --nginx -d pronovacrypto.tech -d www.pronovacrypto.tech -d api.pronovacrypto.tech

# Follow the prompts:
# - Enter email for renewal notices
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## Step 8: Firewall Setup

```bash
# Allow necessary ports
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw enable

# Check status
sudo ufw status
```

---

## Verification Checklist

After deployment, verify:

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql

# Test backend API
curl http://localhost:5000/api/health

# Check logs if issues
pm2 logs pronova-api
sudo tail -f /var/log/nginx/error.log
```

**URLs to test:**
- https://pronovacrypto.tech - Frontend
- https://api.pronovacrypto.tech - Backend API
- https://api.pronovacrypto.tech/api/health - Health check

---

## Quick Commands Reference

```bash
# Restart backend
pm2 restart pronova-api

# View logs
pm2 logs pronova-api

# Rebuild frontend after changes
cd /var/www/pronova && npm run build

# Restart Nginx
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory
free -m
```

---

## Updating the Site

When you have updates:

```bash
cd /var/www/pronova

# Pull latest changes
git pull

# Frontend update
npm install
npm run build

# Backend update
cd backend
npm install
npm run build
pm2 restart pronova-api
```
