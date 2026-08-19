# Bloggr — AWS Deployment Guide (EC2, Docker, GitHub Actions, GHCR)

Step-by-step guide to deploy Bloggr on AWS with a small budget (~$10 credit).
Everything runs on **ONE** EC2 instance. The build happens in GitHub Actions (no heavy compilation or git clone on the EC2 server).

---

## Architecture (what we build)

```
                    GitHub (github.com/Nithin0620/Bloggr)
                       │  git push to main
                       ▼
             GitHub Actions (CI/CD)
              ├── 1. Build Backend & Frontend Docker images
              ├── 2. Push images to GitHub Container Registry (ghcr.io)
              └── 3. SSH into EC2 Server
                       │
                       ▼
                  EC2 Instance (Docker + Docker Compose)
                       ├── Pulls images from ghcr.io (No git clone needed on EC2)
                       │
                       ├── bloggr-backend  (Express + Socket.IO, :4000)
                       ├── bloggr-frontend (React build via nginx, :3000)
                       ├── redis           (queues, caching, :6379)
                       └── qdrant          (vector DB, RAG, :6333)

    Mongo = MongoDB Atlas Free Tier (external, free forever)
```

---

## Phase 0 — Pre-flight code fixes (MUST DO FIRST)

Your production frontend build hardcodes the OLD Render URL. On EC2 it will
keep calling `https://bloggr-y7gx.onrender.com` and your deployed app will be
broken. Fix these two things:

### 1. Frontend: make the API URL configurable

In these files, `BASE_URL` is hardcoded to Render in production:
`frontend/src/store/` → `AuthStore.jsx`, `ChatStore.jsx`, `PostStore.jsx`,
`ProfileStore.jsx`, `SettingsStore.jsx`, `IntractionStore.jsx`

In each, change:

```js
const BASE_URL = process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "https://bloggr-y7gx.onrender.com/api/v1";
```

to:

```js
const BASE_URL = process.env.REACT_APP_BASE_URL || (process.env.REACT_APP_MODE === "development" ? "http://localhost:4000/api/v1" : "https://bloggr-y7gx.onrender.com/api/v1");
```

Same for the **Socket.IO** lines in `AuthStore.jsx` and `ChatStore.jsx`:

```js
const socket = io(`${process.env.REACT_APP_BASE_URL || (process.env.REACT_APP_MODE === "development" ? "http://localhost:4000" : "https://bloggr-y7gx.onrender.com")}`, { ... });
```

### 2. Backend: allow your EC2 in CORS

In `backend/index.js`, add your EC2 public IP to the origin list:

```js
origin: [
  "http://localhost:3000",
  "https://bloggr-y7gx.onrender.com",
  "https://bloggrplatform.pages.dev",
  "http://YOUR_EC2_PUBLIC_IP:3000",   // ← add this
],
```

---

## Phase 1 — Create and Configure the EC2 Instance

You do **not** need to git clone the source code on EC2. EC2 only hosts the `.env` file and `docker-compose.yml`, pulling pre-built Docker images directly from GitHub Container Registry (`ghcr.io`).

### 1. Launch EC2

1. AWS Console → **EC2 → Launch Instance**.
2. Name: `bloggr-prod`. AMI: **Ubuntu 22.04 LTS**. Instance type: **t2.micro** (free tier eligible).
3. **Key pair**: create or select your key pair (e.g. `bloggr-key.pem` — keep it safe).
4. **Network settings** → edit security group, open these inbound ports:

   | Port | From | Why |
   |------|------|-----|
   | 22   | 0.0.0.0/0 (or Your IP + GitHub Actions) | SSH for deployment |
   | 3000 | 0.0.0.0/0 | Bloggr frontend |
   | 4000 | 0.0.0.0/0 | Bloggr backend API |

   Do **not** open 6379 (Redis) or 6333 (Qdrant) to the internet.
5. Storage: default 8 GB gp2/gp3 is fine. Launch.

### 2. SSH in + install Docker

On your local machine:
```bash
chmod 400 bloggr-key.pem
ssh -i bloggr-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

On the EC2 server:
```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker ubuntu
sudo systemctl enable --now docker
exit   # Re-login so docker group permissions apply
```

### 3. Setup Project Directory & `docker-compose.yml` on EC2

SSH back into EC2:
```bash
ssh -i bloggr-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
mkdir -p ~/bloggr
cd ~/bloggr
```

Create `docker-compose.yml` (e.g. using `nano docker-compose.yml`):

```yaml
services:
  backend:
    image: ghcr.io/nithin0620/bloggr-backend:latest
    container_name: bloggr-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    env_file:
      - .env
    environment:
      - ENVIRONMENT=production
    depends_on:
      - redis
      - qdrant
    networks:
      - bloggr-net

  frontend:
    image: ghcr.io/nithin0620/bloggr-frontend:latest
    container_name: bloggr-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - bloggr-net

  redis:
    image: redis:7-alpine
    container_name: bloggr-redis
    restart: unless-stopped
    networks:
      - bloggr-net

  qdrant:
    image: qdrant/qdrant:latest
    container_name: bloggr-qdrant
    restart: unless-stopped
    volumes:
      - qdrant_storage:/qdrant/storage
    networks:
      - bloggr-net

networks:
  bloggr-net:
    driver: bridge

volumes:
  qdrant_storage:
```

### 4. Create `.env` on EC2

In `~/bloggr/`, create `.env` (`nano .env`):

```env
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/Bloggr
PORT=4000
ENVIRONMENT=production
JWT_SECRET=<long-random-string>
REDIS_URL=redis://redis:6379
QDRANT_URL=http://qdrant:6333
FRONTEND_URL=http://YOUR_EC2_PUBLIC_IP:3000
BACKEND_URL=http://YOUR_EC2_PUBLIC_IP:4000
# Add your Cloudinary, GROQ_API_KEY, MAIL credentials, OAuth keys here
```

### 5. GHCR Authentication on EC2

If your GitHub packages are private, log into GHCR on the EC2 server once:
```bash
# Create a GitHub PAT (Personal Access Token) with 'read:packages' permission
echo "<YOUR_GITHUB_PAT>" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
```
*(If the package visibility is set to Public under GitHub Profile → Packages → Package Settings, `docker pull` will work without login).*

---

## Phase 2 — Setup GitHub Actions CI/CD (Build, GHCR Push & SSH Deploy)

### 1. Add Repository Secrets in GitHub

Go to your repository on GitHub: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Value |
|-------------|-------|
| `EC2_HOST` | Your EC2 Public IP (e.g. `54.x.x.x`) |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Entire content of your `bloggr-key.pem` private key file |
| `REACT_APP_BASE_URL` | `http://YOUR_EC2_PUBLIC_IP:4000/api/v1` |

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

The workflow automatically:
1. Builds the backend & frontend images on GitHub runners.
2. Pushes them to GitHub Container Registry (`ghcr.io`).
3. SSHes into your EC2 instance and restarts Docker Compose with the latest images.

```yaml
name: Build, Push to GHCR & Deploy to EC2

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  BACKEND_IMAGE: ghcr.io/${{ github.repository_owner }}/bloggr-backend
  FRONTEND_IMAGE: ghcr.io/${{ github.repository_owner }}/bloggr-frontend

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Convert repo owner to lowercase
        run: |
          echo "REPO_OWNER=$(echo ${{ github.repository_owner }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV

      - name: Build & Push Backend Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: backend/Dockerfile
          push: true
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/bloggr-backend:latest
            ghcr.io/${{ env.REPO_OWNER }}/bloggr-backend:${{ github.sha }}

      - name: Build & Push Frontend Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: frontend/Dockerfile
          build-args: |
            REACT_APP_MODE=production
            REACT_APP_BASE_URL=${{ secrets.REACT_APP_BASE_URL }}
          push: true
          tags: |
            ghcr.io/${{ env.REPO_OWNER }}/bloggr-frontend:latest
            ghcr.io/${{ env.REPO_OWNER }}/bloggr-frontend:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: SSH into EC2 and Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/bloggr
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

---

## Phase 3 — Verify & Test Deployment

1. **Verify Services Running on EC2**:
   ```bash
   ssh -i bloggr-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
   cd ~/bloggr
   docker compose ps
   ```
   All 4 services (`bloggr-backend`, `bloggr-frontend`, `bloggr-redis`, `bloggr-qdrant`) should show status "Up".

2. **Verify Frontend**:
   Open `http://YOUR_EC2_PUBLIC_IP:3000` in your browser.

3. **Verify Backend Health**:
   ```bash
   curl http://YOUR_EC2_PUBLIC_IP:4000/health
   ```
   Should return `{"status":"ok", ...}` or `200 OK`.

4. **Check Logs**:
   ```bash
   docker compose logs -f backend
   docker compose logs -f frontend
   ```

---

## Phase 4 — SonarQube (optional, code quality)

Run on the same EC2:

```bash
docker run -d --name sonarqube --restart=unless-stopped \
  -p 9000:9000 \
  -v sonarqube_data:/opt/sonarqube/data \
  sonarqube:lts-community
```

- Open `http://YOUR_EC2_PUBLIC_IP:9000`, login `admin` / `admin`, create a token + project key `Bloggr`.
- In Jenkins **Manage Jenkins → SonarQube Servers**: add `sonarqubeServer` with that token.
- Your Jenkinsfile already has the `sonar-scanner` stage wired to `sonarqubeServer`.

> Your pipeline's current order: Checkout → Install → Trivy FS → SonarQube → Build Frontend → Docker → Trivy Image → Push. Note the Docker stage uses `backend/Dockerfile` only — the frontend is built separately and the backend container serves the SPA too, so this is fine.

---

## Phase 5 — Monitoring: Prometheus + Grafana (optional)

Skip if you're out of time — this is pure polish. Both run as containers:

```bash
docker run -d --name prometheus --restart=unless-stopped -p 9090:9090 prom/prometheus
docker run -d --name grafana --restart=unless-stopped -p 3001:3000 grafana/grafana
```

- Grafana: `http://YOUR_EC2_PUBLIC_IP:3001`, login `admin`/`admin`.
- Add Prometheus (`http://<server-ip>:9090`) as a data source, add a node-exporter dashboard.
- To monitor **container** metrics you'd swap in cAdvisor + node-exporter as targets — not required for the demo.

---

## Phase 6 — Terraform (optional, infrastructure-as-code)

Terraform provisions the AWS infra; Jenkins deploys the app. Create `terraform/` in your repo:

```hcl
provider "aws" { region = "us-east-1" }

resource "aws_security_group" "bloggr_sg" {
  name = "bloggr-sg"
  ingress {
    from_port = 22; to_port = 22;   protocol = "tcp"; cidr_blocks = ["<YOUR_IP>/32"]
  }
  ingress {
    from_port = 3000; to_port = 3000; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 4000; to_port = 4000; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 8080; to_port = 8080; protocol = "tcp"; cidr_blocks = ["0.0.0.0/0"]
  }
  egress { from_port = 0; to_port = 0; protocol = "-1"; cidr_blocks = ["0.0.0.0/0"] }
}

resource "aws_instance" "bloggr" {
  ami           = "ami-0aebec5b6f8c33b3b"   # Ubuntu 22.04 (verify for your region)
  instance_type = "t2.micro"
  key_name      = "bloggr-key"
  vpc_security_group_ids = [aws_security_group.bloggr_sg.id]
  tags = { Name = "bloggr-prod" }
}

resource "aws_ecr_repository" "bloggr" {
  name = "bloggr"
}

output "ec2_ip"    { value = aws_instance.bloggr.public_ip }
output "ecr_uri"   { value = aws_ecr_repository.bloggr.repository_url }
```

```bash
terraform init && terraform plan && terraform apply
```

> ⚠️ `terraform destroy` when done — otherwise it keeps billing you. Same infra that Phase 1–2 created by hand.

---

## Phase 7 — Kubernetes / EKS (DO NOT DO ON $10)

EKS control plane alone ≈ $72/month. Your `deployment-service.yml` (Deployment + LoadBalancer Service in `webapps` ns) is already written and works — you can demonstrate it on a **local Minikube/k3s** or a future paid sandbox. Don't create EKS with this budget.

---

## Phase 8 — Cleanup (VERY IMPORTANT with $10)

```bash
# From your laptop, or just delete in the console:
terraform destroy                      # if you used Terraform
# EC2 → terminate instance bloggr-prod
# ECR → delete bloggr repo
# Elastic IPs / Load Balancers / NAT Gateways → release/delete (they bill even stopped)
```

**Never leave running overnight**: EC2 + public IPv4 charges burn a $10 credit in days.

---

## Troubleshooting (why it failed before, likely)

| Symptom | Cause | Fix |
|---------|-------|-----|
| Site loads but API calls fail / login broken | Frontend build still points to Render (Phase 0 not done) | Fix store files, set `REACT_APP_BASE_URL`, rebuild |
| Browser console: `CORS blocked` | EC2 origin not in backend CORS list | Add `http://<IP>:3000` in `backend/index.js` |
| Backend container exits/crashes | `backend/.env` missing or bad `DATABASE_URL` | Check `docker compose logs backend`, fix `.env` |
| `MongoNetworkError` | Atlas IP not allowlisted | Atlas → Network Access → allow `0.0.0.0/0` |
| Queues/workers down | No Redis | Add `redis` service to compose |
| Port 4000 not reachable | Security group | Open 4000 in SG |
| OAuth login broken | `BACKEND_URL`/callback not pointing at EC2 | Set `BACKEND_URL=http://<IP>:4000` |

---

## Cost notes (TL;DR)

- ✅ Free/cheap: t2.micro (free tier), MongoDB Atlas M0 (free), ECR (free for 1 repo), GitHub.
- ❌ Expensive: EKS (~$72/mo), NAT Gateway (~$32/mo), Elastic IP, large EBS, anything left running.
- Total realistic spend for a 4–5 h session: **under $1** if you terminate everything after.
