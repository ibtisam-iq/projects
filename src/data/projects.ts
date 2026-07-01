// ================================================================
// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Source of truth: data/projects.yaml (in this repo)
// To add/edit a project, update data/projects.yaml and push.
// ================================================================

import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    "slug": "silverstack-cicd-platform",
    "title": "SilverStack: Self-Hosted CI/CD on MicroVMs with 5 Custom OCI Images, Systemd Orchestration, Cloudflare Tunnels, and GitHub Actions CI",
    "category": "platform",
    "status": "maintained",
    "year": 2026,
    "shortDescription": "Built a self-hosted CI/CD platform (Jenkins, SonarQube, Nexus) on iximiuz Labs microVMs with 5 custom OCI rootfs images using systemd as PID 1. Configured Cloudflare Tunnels for CGNAT traversal and published each environment as a publicly accessible playground.",
    "description": "Built a self-hosted CI/CD platform (Jenkins, SonarQube, Nexus) running entirely inside iximiuz Labs microVMs instead of public cloud instances. The core constraint was no public IPs, shared NAT behind Carrier-Grade NAT (CGNAT), and ephemeral microVM file systems that lose state on every reboot.\n\nI created 5 custom OCI rootfs images from a base Ubuntu layer, each using systemd as PID 1. Runtime provisioning (PostgreSQL database creation, kernel parameter tuning like vm.max_map_count for SonarQube's Elasticsearch, and service orchestration) all happens at boot rather than being baked into the image. This keeps images modular: a standalone SonarQube environment, a Nexus registry, a Dev Machine, or the full unified CI/CD stack can each launch independently.\n\nTo expose services externally despite CGNAT, I configured outbound-only Cloudflare Tunnels on custom domains, bypassing the need for inbound ports entirely. Nginx acts as a local reverse proxy inside each microVM to standardize traffic routing across Jenkins, SonarQube, and Nexus.\n\nOn the CI side, I built GitHub Actions workflows for each image with build-time health checks that validate systemd unit files, Nginx configs, and service readiness before pushing to GHCR. Security is enforced through strict sudoers profiles, daemon user isolation, pinned binary versions with SHA256 checksum verification, and ephemeral SSH key generation per microVM instance. Each image is published as a publicly accessible playground on iximiuz Labs.",
    "sections": [
      {
        "title": "OS Engineering & Modular Architecture",
        "items": [
          "Created 5 distinct OCI rootfs images from a custom Ubuntu base. Each image is independently launchable: a standalone SonarQube environment, a Nexus registry, a Dev Machine, or the full unified CI/CD stack.",
          "Decoupled CI/CD tooling from the base images. Wrote systemd unit files and shell scripts to dynamically provision PostgreSQL databases, configure kernel limits, and reconstruct volatile file systems during microVM boot."
        ]
      },
      {
        "title": "Continuous Integration & Automated Publishing",
        "items": [
          "Built GitHub Actions workflows for each image (e.g., build-jenkins-rootfs) to automate the full build-test-push cycle, replacing manual image builds.",
          "Added build-time health checks to validate systemd configurations, Nginx reverse proxies, and service readiness. Only passing images are pushed to GHCR."
        ]
      },
      {
        "title": "Networking & Edge Routing",
        "items": [
          "Worked around Carrier-Grade NAT (CGNAT) and the lack of public IPs by configuring outbound-only Cloudflare Tunnels, exposing CI/CD services on custom domains without opening inbound firewall ports.",
          "Set up Nginx as a local reverse proxy to standardize traffic routing and handle artifact streaming for CI/CD workloads."
        ]
      },
      {
        "title": "Security & Access Control",
        "items": [
          "Enforced least-privilege access through strict sudoers profiles, daemon user isolation, and ephemeral SSH key generation per microVM instance.",
          "Pinned all third-party binaries to specific versions and validated downloads via SHA256 checksums to reduce supply chain risk."
        ]
      }
    ],
    "tags": [
      "linux",
      "containerization",
      "ci-cd",
      "networking",
      "security",
      "iac",
      "automation"
    ],
    "tech": [
      "systemd",
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "PostgreSQL",
      "Nginx",
      "Cloudflare Tunnel",
      "GitHub Actions",
      "GHCR",
      "Bash"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/silver-stack/tree/main/iximiuz/rootfs"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/self-hosted/ci-cd/iximiuz/"
      },
      {
        "type": "playground",
        "url": "https://labs.iximiuz.com/playgrounds/SilverStack-CICD-Stack-1766a8a1"
      },
      {
        "type": "website",
        "url": "https://labs.iximiuz.com/a/ibtisam-iq"
      }
    ],
    "featured": true
  },
  {
    "slug": "microservices-demo",
    "title": "Microservices GitOps on Amazon EKS with Terraform, 3 CI Pipelines, ArgoCD Image Updater, ExternalDNS, Gateway API, and Observability",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Deployed 10 microservices on Amazon EKS with Terraform, 3 CI pipelines, and fully automated GitOps delivery via ArgoCD Image Updater. Configured Gateway API routing, ExternalDNS, and observability with Prometheus and the Elastic Stack.",
    "description": "Deployed Google's Online Boutique (10-service polyglot monorepo) on Amazon EKS with a fully automated DevOps architecture built from scratch. I provisioned the entire AWS environment (VPCs, bastion host, EKS cluster with self-managed Auto Scaling Groups) using modular Terraform. The lab environment's Service Control Policies (SCPs) blocked EKS managed node groups, so I created self-managed worker nodes to work within those constraints.\n\nFor CI, I built 3 GitHub Actions pipelines with dynamic matrix dispatch: one detects which microservices changed and compiles only those, one runs Trivy filesystem and container image scans, and one packages and publishes Helm charts to GHCR as OCI artifacts.\n\nThe continuous delivery chain is fully automated with zero manual intervention. CI pushes images to GHCR, ArgoCD Image Updater detects new digests (matched on SHA-256 instead of timestamps to avoid BuildKit epoch-related ordering issues) and triggers EKS rollouts. Image Updater uses the 'argocd' write method to patch image overrides in-memory, keeping the CD repository's Git history clean.\n\nCI and CD are strictly separated: CI tokens are scoped to 'Contents: Read+Write' on the CD repository only, and no pipeline has kubectl access to the cluster. I kept the upstream Helm chart unmodified and used Kustomize within ArgoCD to inject custom Gateway API manifests as overlays.\n\nTraffic routing uses the Kubernetes Gateway API with a shared ALB across 5 HTTPRoutes. ExternalDNS automatically creates and reconciles Route 53 DNS records from those Gateway API resources. HPA handles CPU-based pod autoscaling via the Metrics Server, and an ACM wildcard certificate provides TLS across all subdomains.\n\nObservability is deployed independently of the application so monitoring stays operational even if ArgoCD or the CI pipeline fails. kube-prometheus-stack handles metrics with AlertManager pushing alerts to Slack. The Elastic Stack (Elasticsearch on gp3 PVCs via the EBS CSI driver, Filebeat, Kibana) provides centralized logging across the 4-node cluster.",
    "sections": [
      {
        "title": "AWS Infrastructure",
        "items": [
          "Provisioned the full AWS environment (VPCs, bastion host, EKS cluster) using modular Terraform.",
          "Worked around lab Service Control Policies (SCPs) that blocked EKS managed node groups by creating self-managed Auto Scaling Groups.",
          "Configured the EBS CSI driver with gp3 as the default StorageClass for better throughput-per-dollar on Elasticsearch PVCs.",
          "Provisioned an ACM wildcard certificate (*.ibtisam.qzz.io) and attached it to a shared Application Load Balancer for TLS across all subdomains."
        ]
      },
      {
        "title": "Kubernetes & Traffic Routing",
        "items": [
          "Adopted the Kubernetes Gateway API over legacy Ingress. Configured the AWS Load Balancer Controller to share a single ALB across 5 HTTPRoutes.",
          "Integrated ExternalDNS to automatically create and reconcile Route 53 records from Gateway API manifests.",
          "Configured Horizontal Pod Autoscalers (HPA) to scale frontend pods based on CPU utilization via the Metrics Server.",
          "Kept the upstream Helm chart unmodified. Used Kustomize within ArgoCD to inject custom Gateway API manifests as overlays."
        ]
      },
      {
        "title": "GitOps & Continuous Delivery",
        "items": [
          "Set up an automated delivery pipeline: GitHub Actions pushes OCI artifacts to GHCR, ArgoCD Image Updater detects new images and triggers EKS rollouts.",
          "Configured Image Updater to match on SHA-256 digests instead of timestamps to avoid BuildKit epoch-related ordering issues.",
          "Used the ArgoCD 'argocd' write method to patch image overrides in-memory, keeping the Git history of the CD repository clean."
        ]
      },
      {
        "title": "CI Pipeline & Security",
        "items": [
          "Built 3 GitHub Actions pipelines with dynamic matrix dispatch to compile and test only modified microservices.",
          "Enforced strict CI/CD separation: the CI repository has no access to the EKS cluster. Deployments happen entirely through pull-based GitOps.",
          "Scoped CI deployment tokens to 'Contents: Read+Write' on the CD repository only.",
          "Integrated Trivy filesystem and container image scanning to block vulnerabilities before artifacts reach the registry."
        ]
      },
      {
        "title": "Observability",
        "items": [
          "Deployed observability tools independently of the application so monitoring stays operational even if ArgoCD or the CI pipeline fails.",
          "Set up kube-prometheus-stack for metrics. Configured AlertManager to push cluster alerts to Slack.",
          "Deployed the Elastic Stack (Elasticsearch, Filebeat, Kibana) to aggregate logs across the 4-node EKS cluster."
        ]
      }
    ],
    "tags": [
      "kubernetes",
      "gitops",
      "ci-cd",
      "iac",
      "networking",
      "observability",
      "containerization",
      "security",
      "autoscaling"
    ],
    "tech": [
      "Terraform",
      "Amazon EKS",
      "Docker",
      "Helm",
      "Kustomize",
      "ArgoCD",
      "ArgoCD Image Updater",
      "Gateway API",
      "AWS Load Balancer Controller",
      "ExternalDNS",
      "Route 53",
      "GitHub Actions",
      "Trivy",
      "GHCR",
      "Prometheus",
      "Grafana",
      "AlertManager",
      "Elasticsearch",
      "Filebeat",
      "Kibana"
    ],
    "links": [
      {
        "type": "app-repo",
        "url": "https://github.com/ibtisam-iq/microservices-demo"
      },
      {
        "type": "cd-repo",
        "url": "https://github.com/ibtisam-iq/platform-engineering-systems/tree/main/systems/microservices-demo"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/microservices-demo/"
      },
      {
        "type": "terminal-sessions",
        "url": "https://github.com/ibtisam-iq/microservices-demo/tree/main/terminal-session"
      },
      {
        "type": "screenshots",
        "url": "https://github.com/ibtisam-iq/microservices-demo/tree/main/assets"
      }
    ],
    "featured": true
  },
  {
    "slug": "retail-store-sample-app",
    "title": "Multi-Environment Deployment from Bare-Metal to Amazon EKS with Helmfile, IRSA, DynamoDB, SQS/Lambda/SNS, and CloudWatch",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Deployed 5 microservices across bare-metal Kubernetes and Amazon EKS, decoupling all AWS dependencies for portability. Configured IRSA, Helmfile orchestration, a serverless event pipeline (SQS, Lambda, SNS), and CloudWatch logging.",
    "description": "Deployed AWS's retail store demo (5 microservices) across two environments to prove application portability: a bare-metal kubeadm cluster (provisioned via SilverStack) and Amazon EKS. The upstream application is tightly coupled to AWS managed services, so I first decoupled all cloud dependencies by creating custom values-*.yaml overrides that swap DynamoDB, SQS, and ElastiCache with containerized alternatives (RabbitMQ, Redis, NodePort) at deploy time. All 5 upstream Helm charts stayed unmodified.\n\nI wrote 3 target-specific Helmfile configurations using the 'needs:' directive to enforce dependency sequencing. Databases and message brokers provision before application microservices, preventing startup race conditions.\n\nFor the EKS deployment, I provisioned IAM roles via Terraform, deployed the control plane via eksctl, and created self-managed CloudFormation worker nodes to bypass SCP restrictions on managed node groups. I configured IRSA (IAM Roles for Service Accounts) to bind the Cart service to DynamoDB and the Orders service to a serverless event pipeline (SQS triggers Lambda, which publishes to SNS).\n\nTraffic routing uses the ALB Ingress Controller with an Ingress Group that shares a single ALB across the UI, Prometheus, and Grafana. Logging is handled by Fluent Bit streaming to CloudWatch Container Insights for native AWS log aggregation.",
    "sections": [
      {
        "title": "Bare-Metal Portability",
        "items": [
          "Kept all 5 upstream microservice Helm charts unmodified. Created environment-specific values-*.yaml overrides to swap cloud dependencies at deploy time.",
          "Replaced DynamoDB, SQS, ElastiCache, and ALB Ingress with local alternatives (RabbitMQ, Redis, NodePort) to deploy the full stack on a bare-metal kubeadm cluster."
        ]
      },
      {
        "title": "Deployment Orchestration",
        "items": [
          "Wrote a Helmfile layer to consolidate 5 separate Helm releases into a single declarative deployment.",
          "Created 3 target-specific Helmfile configurations using the 'needs:' directive to enforce dependency ordering (databases and brokers provision before microservices)."
        ]
      },
      {
        "title": "Amazon EKS Deployment",
        "items": [
          "Provisioned IAM roles via Terraform, deployed the control plane via eksctl, and created self-managed worker nodes via CloudFormation to bypass SCP restrictions on managed node groups.",
          "Configured IRSA to bind the Cart service to DynamoDB and the Orders service to a serverless event pipeline (SQS, Lambda, SNS).",
          "Deployed the AWS Load Balancer Controller and configured an Ingress Group to share a single ALB across the UI, Prometheus, and Grafana.",
          "Deployed Fluent Bit to stream logs to CloudWatch Container Insights."
        ]
      }
    ],
    "tags": [
      "kubernetes",
      "orchestration",
      "cloud-native",
      "iac",
      "microservices",
      "observability"
    ],
    "tech": [
      "Terraform",
      "eksctl",
      "CloudFormation",
      "kubeadm",
      "Amazon EKS",
      "Docker",
      "Helmfile",
      "Helm",
      "ALB Ingress Controller",
      "DynamoDB",
      "SQS",
      "Lambda",
      "SNS",
      "RabbitMQ",
      "Redis",
      "Fluent Bit",
      "CloudWatch",
      "Prometheus",
      "Grafana"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/retail-store-sample-app"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/retail-store-sample-app/"
      },
      {
        "type": "terminal-sessions",
        "url": "https://github.com/ibtisam-iq/retail-store-sample-app/tree/main/terminal-sessions"
      },
      {
        "type": "screenshots",
        "url": "https://github.com/ibtisam-iq/retail-store-sample-app/tree/main/assets"
      }
    ],
    "featured": true
  },
  {
    "slug": "java-monolith",
    "title": "BankApp: Same Java Artifact Deployed Across EC2 Auto Scaling, ECS Fargate, and Amazon EKS with RDS, Gateway API, and Kustomize",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Deployed the same Java artifact across EC2, ECS Fargate, and Amazon EKS to compare each compute model firsthand. Shared one VPC and RDS instance across all three and reduced the image by 60% with multi-stage builds.",
    "description": "Took a monolithic Java banking application (Spring Boot 3.4, Java 21) and deployed the same immutable artifact across three AWS compute models to understand the operational trade-offs of each firsthand: EC2 instances with Auto Scaling Groups, serverless ECS Fargate tasks, and Amazon EKS pods. All three deployments share the same VPC, security groups, and RDS instance, so the only variable is the compute layer itself.\n\nBefore deploying, I decoupled the application's embedded H2 database to a managed Amazon RDS instance for independent scaling and backups. I reduced the container image size by over 60% using multi-stage Docker builds (Maven build stage into a Java 21 slim runtime).\n\nOn EKS, I adopted the Kubernetes Gateway API over legacy Ingress, integrated with the AWS Application Load Balancer for traffic routing. I aligned JVM memory parameters (-Xmx, -Xms) with Kubernetes resource limits to prevent OOM kills, and wrote Kustomize manifests to manage the deployment declaratively.",
    "sections": [
      {
        "title": "Multi-Compute Deployment",
        "items": [
          "Deployed the same application across EC2, ECS Fargate, and EKS to compare the operational trade-offs of each compute model firsthand.",
          "Reused the same VPC, security groups, and RDS instance across all three deployment phases."
        ]
      },
      {
        "title": "Containerization & Modernization",
        "items": [
          "Decoupled the application's embedded database to a managed Amazon RDS instance for independent scaling and backups.",
          "Reduced the container image size by over 60% using multi-stage Docker builds with a Java 21 runtime base."
        ]
      },
      {
        "title": "Kubernetes & Traffic Routing",
        "items": [
          "Adopted the Kubernetes Gateway API over legacy Ingress, integrated with the AWS Application Load Balancer.",
          "Aligned JVM memory parameters (-Xmx, -Xms) with Kubernetes resource limits to prevent OOM kills."
        ]
      }
    ],
    "tags": [
      "aws",
      "kubernetes",
      "containerization",
      "iac",
      "ci-cd",
      "security"
    ],
    "tech": [
      "AWS EC2",
      "Amazon ECS",
      "Amazon EKS",
      "Amazon RDS",
      "Java 21",
      "Spring Boot 3.4",
      "Maven",
      "Docker",
      "Kustomize",
      "Gateway API",
      "Bash"
    ],
    "links": [
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/java-monolith/"
      },
      {
        "type": "app-repo",
        "url": "https://github.com/ibtisam-iq/java-monolith-app"
      },
      {
        "type": "cd-repo",
        "url": "https://github.com/ibtisam-iq/platform-engineering-systems/tree/main/systems/java-monolith"
      }
    ],
    "featured": true
  },
  {
    "slug": "polyglot-monolith-deployment",
    "title": "Polyglot Deployment: Java, Python, and Node.js Across EC2, ECS, Bare-Metal K8s, and EKS with Kustomize Overlays and Multi-Stage Docker",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Containerized three applications (Java, Python, Node.js) and deployed each across EC2, ECS, bare-metal Kubernetes, and EKS. Wrote Kustomize overlays sharing 80% of base manifests between environments.",
    "description": "Containerized three monolithic applications (Java Spring Boot 3.4/Java 21, Python Flask 3.12, Node.js 22 Express) and deployed each across four compute models: EC2 with Auto Scaling Groups, ECS Fargate, bare-metal Kubernetes (kubeadm), and Amazon EKS.\n\nBefore containerizing, I audited and upgraded all three codebases, injected container health probe endpoints ('/health' for Flask and Express, '/actuator/health' for Spring Boot), and standardized database connectivity. The same application code connects to localhost on bare-metal, Docker Compose DNS names ('mysql'/'postgres') in local dev, and Amazon RDS endpoints in cloud environments, all without source code changes (only environment variables).\n\nThe Node.js application required a structural refactor: I split it from a 2-tier model (Express serving both API and UI) into a 3-tier architecture with Nginx serving the React frontend and proxying API requests to the Express backend.\n\nI built multi-stage Dockerfiles for each stack: Webpack build stage into Alpine Nginx runtime for the Node frontend (excluding the Node toolchain entirely), Java 21 slim runtime for Spring Boot, and Gunicorn for Flask. I debugged environment-specific edge cases along the way (python-dotenv URL truncation, PostgreSQL 15+ schema-level grants, JDBC URL quoting in shell scripts).\n\nOn the Kubernetes side, I wrote a Kustomize overlay structure where bare-metal and EKS deployments share over 80% of the same base manifests. Environment-specific overlays inject StatefulSets, StorageClasses, and RDS connection strings without modifying the shared base. The Python Flask application stays as a single-container deployment with Gunicorn instead of forcing a microservice split.",
    "sections": [
      {
        "title": "Codebase Preparation & Database Connectivity",
        "items": [
          "Upgraded three codebases (Spring Boot 3.4.5/Java 21, Node.js 22, Python 3.12). Injected container health endpoints ('/health', '/actuator/health') to satisfy Kubernetes readiness probes.",
          "Standardized database connectivity across environments: localhost for bare-metal, Docker Compose DNS ('mysql'/'postgres') for local dev, and Amazon RDS endpoints for cloud. No source code changes required between environments.",
          "Debugged environment-specific edge cases: python-dotenv URL truncation, PostgreSQL 15+ schema-level grants, and JDBC URL quoting in shell scripts."
        ]
      },
      {
        "title": "Containerization & Refactoring",
        "items": [
          "Refactored the Node.js application from a 2-tier model (Express serving UI) into a 3-tier architecture with Nginx serving the React frontend and proxying API requests to the backend.",
          "Built multi-stage Dockerfiles for each stack. For the Node frontend, compiled React via Webpack in a build stage and copied static assets into an Alpine Nginx runtime, excluding the Node toolchain entirely."
        ]
      },
      {
        "title": "Multi-Platform Deployment",
        "items": [
          "Deployed all three applications across EC2 (Auto Scaling), ECS Fargate, bare-metal Kubernetes (kubeadm), and Amazon EKS.",
          "Kept the Python Flask application as a single-container deployment with Gunicorn instead of forcing a microservice split. Applied the pattern that matched the application, not the trend."
        ]
      },
      {
        "title": "Kubernetes & Kustomize",
        "items": [
          "Wrote a Kustomize overlay structure where bare-metal and EKS deployments share over 80% of the same base manifests.",
          "Used Kustomize bases for stateless Deployments and injected StatefulSets, StorageClasses, and RDS connection strings through environment-specific overlays."
        ]
      }
    ],
    "tags": [
      "containerization",
      "kubernetes",
      "iac",
      "networking",
      "gitops"
    ],
    "tech": [
      "AWS EC2",
      "Amazon ECS",
      "kubeadm",
      "Kubernetes",
      "Amazon EKS",
      "Amazon RDS",
      "Java",
      "Python",
      "Node.js",
      "React",
      "MySQL",
      "PostgreSQL",
      "Docker",
      "Docker Compose",
      "Nginx",
      "Kustomize",
      "Bash"
    ],
    "links": [
      {
        "type": "java-monolith-repo",
        "url": "https://github.com/ibtisam-iq/java-monolith-app"
      },
      {
        "type": "python-monolith-repo",
        "url": "https://github.com/ibtisam-iq/python-monolith-app"
      },
      {
        "type": "node-monolith-repo",
        "url": "https://github.com/ibtisam-iq/node-monolith-3tier-app"
      },
      {
        "type": "cd-repo",
        "url": "https://github.com/ibtisam-iq/platform-engineering-systems"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/bootstrap/kubernetes/cluster-kubeadm/"
      }
    ],
    "featured": true
  },
  {
    "slug": "devsecops-pipeline-engineering",
    "title": "14-Stage DevSecOps Pipeline Mirrored Across Jenkins and GitHub Actions with 3-Pass Trivy, SonarQube, and GHCR/Docker Hub/Nexus Publishing",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Built a 14-stage CI pipeline for three codebases and implemented it identically on Jenkins and GitHub Actions. Integrated Trivy, SonarQube quality gates, and triple-registry publishing with strict GitOps handoff.",
    "description": "Built a standardized 14-stage CI pipeline for three monolithic codebases (Java, Python, Node.js) and implemented it identically on both Jenkins and GitHub Actions to prove the pipeline design is tool-agnostic. Before writing any automation, I validated each application's full lifecycle locally (Maven compilation, Webpack builds, pytest with MySQL/PostgreSQL) to establish a working baseline.\n\nEach pipeline integrates language-specific SAST tools: Bandit and pip-audit for Python, npm audit and ESLint for Node.js, and Trivy filesystem scanning for Java. Container security uses a 3-pass Trivy strategy that separates concerns: '--vuln-type library' hard-fails the build on CRITICAL findings, while '--vuln-type os' runs as advisory only to prevent Debian-maintained CVEs from false-blocking releases.\n\nTest suites run against in-memory databases (SQLite for Python) to avoid external dependencies in CI, while still generating JaCoCo and Cobertura XML coverage reports that feed into SonarQube quality gates.\n\nEvery image is tagged with three identifiers (semantic version, 7-character Git SHA, and CI build number) with no floating 'latest' tags. Images are published simultaneously to three registries: GHCR, Docker Hub, and a self-hosted Nexus instance (running on SilverStack).\n\nEvery pipeline ends with a strict GitOps handoff: the image SHA is committed to the CD repository. No pipeline has kubectl access to any cluster.",
    "sections": [
      {
        "title": "Pipeline Design",
        "items": [
          "Validated each application's build and test cycle locally (Maven, Webpack, pytest with MySQL/PostgreSQL) before automating anything.",
          "Implemented the same 14-stage pipeline on both Jenkins and GitHub Actions to prove the design is tool-agnostic.",
          "Built a strict CI/CD separation: CI pipelines push an image SHA commit to the CD repository. No pipeline has kubectl access to any cluster."
        ]
      },
      {
        "title": "Security Scanning & Quality Gates",
        "items": [
          "Integrated language-specific security tools: Bandit and pip-audit for Python, npm audit and ESLint for Node.js, Trivy filesystem scan for Java.",
          "Configured a 3-pass Trivy strategy: '--vuln-type library' blocks the build on CRITICAL findings, '--vuln-type os' runs as advisory only, preventing Debian-maintained CVEs from false-blocking releases.",
          "Ran CI test suites against in-memory databases (SQLite for Python) to avoid external dependencies, while still generating JaCoCo and Cobertura XML reports for SonarQube."
        ]
      },
      {
        "title": "Artifact Management",
        "items": [
          "Published version-tagged images to GHCR, Docker Hub, and a self-hosted Nexus registry simultaneously.",
          "Tagged every image with the semantic version, the 7-character Git SHA, and the CI build number. No floating 'latest' tags."
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "security",
      "containerization",
      "gitops"
    ],
    "tech": [
      "Jenkins",
      "GitHub Actions",
      "Docker",
      "Maven",
      "npm",
      "pytest",
      "Trivy",
      "Bandit",
      "pip-audit",
      "ESLint",
      "SonarQube",
      "JaCoCo",
      "GHCR",
      "Docker Hub",
      "Nexus"
    ],
    "links": [
      {
        "type": "java-monolith-repo",
        "url": "https://github.com/ibtisam-iq/java-monolith-app"
      },
      {
        "type": "python-monolith-repo",
        "url": "https://github.com/ibtisam-iq/python-monolith-app"
      },
      {
        "type": "node-monolith-repo",
        "url": "https://github.com/ibtisam-iq/node-monolith-3tier-app"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/self-hosted/ci-cd/iximiuz/cicd-stack-operations/"
      }
    ],
    "featured": true
  },
  {
    "slug": "debugbox",
    "title": "DebugBox: Multi-Arch Kubernetes Diagnostics Toolkit with 3 Size-Optimized Variants, Trivy Gating, Hadolint, and MkDocs",
    "category": "tool",
    "status": "maintained",
    "year": 2026,
    "shortDescription": "Built an open-source Kubernetes debugging toolkit with 3 Alpine variants (14MB to 104MB), 93% smaller than netshoot. Automated multi-arch builds with Trivy gating, in-container smoke tests, and a MkDocs documentation site.",
    "description": "Built an open-source Kubernetes troubleshooting toolkit as an alternative to images like netshoot, which pull hundreds of megabytes for simple connectivity checks. DebugBox offers 3 right-sized Alpine-based variants: Lite (14MB) for DNS and HTTP checks, Balanced (50MB) for general debugging, and Power (104MB) for packet capture and deep inspection. The Lite variant is 93% smaller than netshoot.\n\nI separated Dockerfiles (declarative) from installation scripts (procedural): package lists live in '.packages' files, and complex installs (like yq with architecture detection and SHA256 verification) have dedicated scripts. All tool versions and base images are pinned for deterministic builds.\n\nEach container comes pre-loaded with kubectx/kubens and custom bash functions (json(), yaml(), sniff-dns(), cert-check()) for faster debugging sessions.\n\nThe CI pipeline uses GitHub Actions with Docker Buildx and QEMU to produce multi-architecture images (amd64, arm64). Trivy scanning runs mid-pipeline with hard-fail gates on HIGH or CRITICAL findings, and Hadolint lints every Dockerfile. I wrote smoke tests (tests/smoke.sh) that run inside the built containers during CI to verify every tool is present and functional before publishing.\n\nImages are published to both GHCR and Docker Hub with standard OCI metadata labels (org.opencontainers.image.*) injected at build time. A local Makefile wraps the full quality loop (Hadolint, Docker build, smoke tests, Trivy scans) for pre-push validation.\n\nThe project includes a documentation site published via MkDocs and GitHub Pages, along with CONTRIBUTING.md, CODE_OF_CONDUCT.md, and SECURITY.md.",
    "sections": [
      {
        "title": "Container Design",
        "items": [
          "Built 3 purpose-specific variants (Lite, Balanced, Power) on Alpine Linux, ranging from 14MB to 104MB. The Lite variant is 93% smaller than netshoot for basic DNS and HTTP debugging.",
          "Separated Dockerfiles (declarative) from installation scripts (procedural). Package lists live in '.packages' files; complex installs (like yq with architecture detection and SHA256 verification) have dedicated scripts.",
          "Pinned all tool versions and base images for deterministic, repeatable builds."
        ]
      },
      {
        "title": "Kubernetes Developer Experience",
        "items": [
          "Pre-loaded kubectx/kubens aliases and custom bash functions (json(), yaml(), sniff-dns(), cert-check()) into the container's .bashrc for faster debugging sessions."
        ]
      },
      {
        "title": "CI/CD & Release Automation",
        "items": [
          "Built GitHub Actions pipelines using Docker Buildx and QEMU to produce multi-arch images (amd64, arm64).",
          "Injected standard OCI labels (org.opencontainers.image.*) into every image at build time.",
          "Published to both GHCR and Docker Hub on every release. Each release creates a full set of semantic version tags."
        ]
      },
      {
        "title": "Quality & Security",
        "items": [
          "Integrated Trivy scanning mid-pipeline. HIGH or CRITICAL findings block the release.",
          "Wrote smoke tests (tests/smoke.sh) that run inside the built containers during CI to verify every tool is present and functional before publishing.",
          "Created a local Makefile for Hadolint linting, Docker builds, smoke tests, and Trivy scans before pushing."
        ]
      },
      {
        "title": "Open-Source Governance",
        "items": [
          "Published a documentation site via MkDocs and GitHub Pages with automated builds.",
          "Wrote CONTRIBUTING.md, CODE_OF_CONDUCT.md, and SECURITY.md."
        ]
      }
    ],
    "tags": [
      "containerization",
      "kubernetes",
      "security",
      "devsecops",
      "ci-cd",
      "networking"
    ],
    "tech": [
      "Alpine Linux",
      "Docker (Buildx & QEMU)",
      "Bash",
      "Hadolint",
      "Trivy",
      "Make",
      "GitHub Actions",
      "GHCR",
      "Docker Hub",
      "MkDocs"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/debugbox"
      },
      {
        "type": "docs",
        "url": "https://debugbox.ibtisam-iq.com"
      }
    ],
    "featured": true
  },
  {
    "slug": "aws-secure-static-hosting",
    "title": "Static Hosting on AWS with CloudFront OAC, Cross-Region Replication, Dual-KMS Encryption, CloudTrail Auditing, and Lifecycle Management",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Built a zero-compute hosting architecture on AWS using CloudFront OAC with SigV4 signing against a private S3 origin. Configured Cross-Region Replication with dual-KMS encryption, CloudTrail auditing, and Glacier lifecycle policies.",
    "description": "Built a static hosting architecture on AWS with zero compute resources. Content is served globally through a CloudFront distribution using Origin Access Control (OAC) with SigV4 signing (not the legacy Origin Access Identity) to authenticate requests against a fully private S3 origin secured with account-level public access blocks.\n\nI provisioned an ACM wildcard certificate on a custom domain and configured CloudFront Custom Error Responses to handle SPA client-side routing by returning index.html for 403s on missing paths.\n\nFor disaster recovery, I configured Cross-Region Replication from us-east-1 to us-west-2 with separate KMS Customer Managed Keys per region. Objects are decrypted at the source and re-encrypted at the destination, so each region maintains independent key material. I enabled S3 Bucket Keys to batch KMS GenerateDataKey calls per-bucket instead of per-object, reducing API costs.\n\nObservability is layered: CloudTrail logs management and data events across both the primary and replica buckets, while S3 Server Access Logs capture per-request HTTP telemetry with dedicated IAM policies for the logging service principal. An S3 Lifecycle Policy transitions non-current object versions to Glacier after 30 days to manage storage costs for versioned content.",
    "sections": [
      {
        "title": "Storage & Replication",
        "items": [
          "Created dual-region S3 buckets (us-east-1 and us-west-2) with all public access blocked at the account level.",
          "Configured Cross-Region Replication with separate KMS Customer Managed Keys per region. Objects are decrypted at the source and re-encrypted at the destination.",
          "Enabled S3 Bucket Keys to reduce KMS API call costs (GenerateDataKey calls are batched per-bucket instead of per-object)."
        ]
      },
      {
        "title": "CDN & TLS",
        "items": [
          "Set up a CloudFront distribution with an ACM wildcard certificate on a custom domain.",
          "Used Origin Access Control (OAC) with SigV4 signing instead of the legacy Origin Access Identity (OAI) to authenticate requests to the private S3 origin.",
          "Configured CloudFront Custom Error Responses to handle SPA client-side routing (returning index.html for 403s on missing paths)."
        ]
      },
      {
        "title": "Observability & Lifecycle",
        "items": [
          "Configured CloudTrail to log management and data events across both the primary and replica buckets.",
          "Enabled S3 Server Access Logs for per-request HTTP telemetry, with dedicated IAM policies for the logging service principal.",
          "Set up an S3 Lifecycle Policy to transition non-current object versions to Glacier after 30 days."
        ]
      }
    ],
    "tags": [
      "security",
      "networking",
      "observability",
      "documentation"
    ],
    "tech": [
      "Amazon S3",
      "AWS KMS",
      "Amazon CloudFront",
      "AWS Certificate Manager",
      "Amazon Route 53",
      "Cloudflare",
      "AWS IAM",
      "AWS CloudTrail",
      "AWS CLI",
      "Bash"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/platform-engineering-systems/tree/main/systems/static-website"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/static-website/"
      },
      {
        "type": "terminal-sessions",
        "url": "https://github.com/ibtisam-iq/platform-engineering-systems/blob/main/systems/static-website/terminal-session.txt"
      }
    ],
    "featured": true
  }
]

export const getAllTechTags = (): string[] => {
  const techSet = new Set<string>()
  projects.forEach((p) => p.tech.forEach((t: string) => techSet.add(t)))
  return Array.from(techSet).sort()
}

export const getAllCapabilityTags = (): string[] => {
  const tagSet = new Set<string>()
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export const getAllYears = (): number[] => {
  const yearSet = new Set<number>()
  projects.forEach((p) => yearSet.add(p.year))
  return Array.from(yearSet).sort((a, b) => b - a)
}
