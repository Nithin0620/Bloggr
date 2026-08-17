# Bloggr — AWS Deployment Guide (EC2, Docker, ECR, Jenkins)

Step-by-step guide to deploy Bloggr on AWS with a small budget (~$10 credit).
Everything runs on **ONE** EC2 instance. No EKS (it costs ~$72/month — skip it on this budget).

---

## Architecture (what we build)

```
                    GitHub (github.com/Nithin0620/Bloggr)
                       │  git push
                       ▼
                    Jenkins  ────  SonarQube (code quality)
                       │
          Docker build → ECR  →  EC2 (docker-compose)
                                      │
                                      ├── bloggr-backend  (Express + Socket.IO, :4000)
                                      ├── bloggr-frontend (React build via nginx, :3000)
                                      ├── redis           (queues, caching)
                                      └── qdrant          (vector DB, RAG)
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

## Phase 1 — Create the EC2 instance

1. AWS Console → **EC2 → Launch Instance**.
2. Name: `bloggr-prod`. AMI: **Ubuntu 22.04 LTS**. Instance type: **t2.micro** (free tier, enough for demo).
3. **Key pair**: create one (download the `.pem`, keep it safe — you'll SSH with it).
4. **Network settings** → edit security group, open these inbound ports:

   | Port | From | Why |
   |------|------|-----|
   | 22   | Your IP only | SSH |
   | 3000 | 0.0.0.0/0 | Bloggr frontend |
   | 4000 | 0.0.0.0/0 | Bloggr backend API |
   | 8080 | 0.0.0.0/0 | Jenkins (Phase 3) |

   Do **not** open 6379 (Redis) or 6333 (Qdrant) to the internet.
5. Storage: default 8 GB gp2 is fine. Launch.

> 💰 Free tier: t2.micro = 750 h/month free. It's cheap, but **stop/terminate it when done** (Phase 8).

### SSH in + install Docker

```bash
chmod 400 bloggr-key.pem
ssh -i bloggr-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

On the server:

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2 git
sudo usermod -aG docker ubuntu
sudo systemctl enable --now docker
exit   # then SSH back in so the docker group applies
```

---

## Phase 2 — Deploy Bloggr on the EC2

### 1. Prepare `.env` files (on your laptop, then copy, or create on server)

`backend/.env` (the app WILL crash at startup if this is missing or has a bad `DATABASE_URL`):

```env
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/Bloggr   # Atlas free tier (M0)
PORT=4000
ENVIRONMENT=production
JWT_SECRET=<long-random-string>
REDIS_URL=redis://redis:6379        # matches the service name in compose
QDRANT_URL=http://qdrant:6333
FRONTEND_URL=http://YOUR_EC2_PUBLIC_IP:3000
BACKEND_URL=http://YOUR_EC2_PUBLIC_IP:4000
# Cloudinary, GROQ_API_KEY, MAIL_HOST/USER/PASS, GOOGLE/FACEBOOK OAuth — copy from your existing .env
```

`frontend/.env`:

```env
REACT_APP_MODE=production
REACT_APP_BASE_URL=http://YOUR_EC2_PUBLIC_IP:4000/api/v1
```

### 2. Add Redis to docker-compose.yml

Your `docker-compose.yml` already has backend, frontend, qdrant — but **no Redis**, and the backend needs it for BullMQ queues. Add:

```yaml
  redis:
    image: redis:7-alpine
    container_name: bloggr-redis
    restart: unless-stopped
    networks:
      - bloggr-net
```

### 3. Clone + deploy

```bash
git clone https://github.com/Nithin0620/Bloggr.git
cd Bloggr
# copy your backend/.env and frontend/.env into the repo here
docker compose up -d --build
docker compose ps        # all 4 services "running"
```

### 4. Verify

- Frontend: `http://YOUR_EC2_PUBLIC_IP:3000` — the React app loads.
- API health: `curl http://localhost:4000/health` → `200 OK`.
- Backend logs: `docker compose logs -f backend`.

> If the site loads but API calls fail → you missed Phase 0 (frontend still calls Render, or CORS blocked your IP).

---

## Phase 3 — CI/CD: ECR + Jenkins (optional but recommended)

### 1. Create the ECR repo (one command, free)

```bash
# install AWS CLI + configure with your credentials (iam-user with AmazonEC2ContainerRegistryFullAccess)
aws ecr create-repository --repository-name bloggr --region <your-region>
```

Note the URI: `<account-id>.dkr.ecr.<region>.amazonaws.com/bloggr`.

### 2. Run Jenkins on the same EC2 (Docker)

```bash
docker run -d --name jenkins --restart=unless-stopped \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

Then:
- Open `http://YOUR_EC2_PUBLIC_IP:8080`, unlock with the admin password from `docker logs jenkins`.
- Install suggested plugins: **Pipeline**, **Docker Pipeline**, **SonarQube Scanner**, **GitHub Integration**.
- Add credentials: `aws-ecr` (Access Key/Secret of an IAM user with ECR push access) and `github` (token with repo access).

### 3. Update your Jenkinsfile for ECR

Your current `Jenkinsfile` pushes to Docker Hub. Change the `environment` block:

```groovy
environment {
    SCANNER_HOME = tool 'sonarqubescanner'
    AWS_REGION   = 'us-east-1'                                     // your region
    ECR_REPO     = '<account-id>.dkr.ecr.<region>.amazonaws.com/bloggr'
    DOCKER_TAG   = "build-${BUILD_NUMBER}"
}
```

Replace the two `withDockerRegistry` stages with:

```groovy
stage('Build & Push to ECR') {
    steps {
        script {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                              accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                              secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                      docker login --username AWS --password-stdin ${ECR_REPO}
                    docker build -t ${ECR_REPO}:${DOCKER_TAG} -t ${ECR_REPO}:latest -f backend/Dockerfile .
                    docker push ${ECR_REPO}:${DOCKER_TAG}
                    docker push ${ECR_REPO}:latest
                """
            }
        }
    }
}
```

### 4. Auto-deploy to EC2 (optional final stage)

Add a stage that SSHes to the server and restarts the compose stack:

```groovy
stage('Deploy to EC2') {
    steps {
        sshagent(['ec2-ssh-key']) {
            sh """
                ssh -o StrictHostKeyChecking=no ubuntu@YOUR_EC2_PUBLIC_IP \
                  'cd ~/Bloggr && git pull && docker compose up -d --build'
            """
        }
    }
}
```

### 5. Webhook

GitHub → repo → **Settings → Webhooks** → add payload URL
`http://YOUR_EC2_PUBLIC_IP:8080/github-webhook/`, content type `application/json`.
Now every `git push` to `main` triggers the pipeline.

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
