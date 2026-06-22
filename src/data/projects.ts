// ================================================================
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Source of truth: data/projects.yaml (in this repo)
// To add/edit a project, update data/projects.yaml and push.
// ================================================================

import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    "slug": "silverstack-cicd-platform",
    "title": "Self-Hosted CI/CD: Jenkins, SonarQube, Nexus on Custom Domains",
    "category": "platform",
    "status": "maintained",
    "year": 2026,
    "shortDescription": "Self-hosted Jenkins, SonarQube, and Nexus on custom domains (jenkins.ibtisam-iq.com, sonar.ibtisam-iq.com, nexus.ibtisam-iq.com) with Cloudflare Tunnel NAT traversal and production SSL. 6 custom VM images, 6 CI pipelines, 5 playgrounds published on iximiuz Labs.",
    "description": "Built and operate a self-hosted CI/CD platform: Jenkins LTS on jenkins.ibtisam-iq.com, SonarQube 26.2 CE with PostgreSQL 18 on sonar.ibtisam-iq.com, and Nexus 3.89.1 CE on nexus.ibtisam-iq.com, all with Cloudflare-managed SSL. Infrastructure is 6 custom Linux VM images in a layered architecture: a hardened Ubuntu 24.04 base extended into a 30+ tool DevOps workstation, three production service images (systemd boot orchestration, Nginx reverse proxy, restricted daemon sudo, build-time healthchecks), and a CI/CD jump host. Platform runs behind NAT with no public IPs; Cloudflare Tunnel provides custom-domain access with zero inbound ports. Full 4-node stack provisions from a single manifest matching the platform resource budget (10 vCPU, 16 GiB RAM, 150 GiB disk). All images built via GitHub Actions, published to GHCR, and the playgrounds published on iximiuz Labs (a DevOps platform featured in official Kubernetes documentation).",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Deployed a production CI/CD platform on custom domains (jenkins.ibtisam-iq.com, sonar.ibtisam-iq.com, nexus.ibtisam-iq.com) with Cloudflare SSL, then configured end-to-end operations: 5 credential stores, SonarQube quality gate webhook, Nexus artifact and Docker registry, Maven publishing via Config File Provider, and 10 pipeline tools on the Jenkins host",
          "Discovered the target platform has no public IPs and no inbound routing (all nodes share one NAT gateway). Engineered Cloudflare Tunnel to reverse the connectivity model: three services on custom domains with zero inbound ports, zero firewall rules, and zero Certbot",
          "Built 6 custom Linux VM images from a single base, each with its own GitHub Actions pipeline and build-time healthchecks validating binaries, configs, systemd unit symlinks, directory ownership, and port substitution before any image ships",
          "Hardened every service image: restricted sudo per daemon (service control and log access only), SSH keys regenerated per instance, OOM-protected systemd services, and Trivy pinned to v0.69.3 after v0.69.4 was confirmed as a supply-chain attack (CVE-2026-33634)",
          "Published 5 playgrounds on iximiuz Labs, a DevOps platform featured in official Kubernetes documentation, making the entire stack launchable from a browser with zero local tooling. Documented across 8 runbook pages covering image builds, infrastructure orchestration, and post-provisioning operations"
        ]
      },
      {
        "title": "Key Decisions",
        "items": [
          "Spent 2 to 3 days validating the architecture on AWS EC2 before building for the target platform. The EC2 proof-of-concept produced the reference Nginx configs, systemd units, and boot scripts, so when NAT broke the networking layer, the application stack needed zero rework",
          "One Cloudflare Tunnel per service, not one tunnel for the whole stack. Each service has its own token, its own lifecycle, and its own failure domain. Taking down the SonarQube tunnel does not affect Jenkins or Nexus",
          "Tunnel traffic routes through Nginx on port 80, not directly to service ports. Nginx provides health endpoints, request buffering, and port abstraction: if a backend port changes, the tunnel config stays the same",
          "Services, binaries, and Nginx configs are baked into images, but secrets (tunnel tokens), database state (PostgreSQL), and environment-specific tooling (Jenkins plugins, pipeline tools) run at boot or post-setup. Images stay reusable without rebuilding",
          "Pipeline tools and Jenkins plugins ship as callable scripts on PATH (/usr/local/bin/install-pipeline-tools, /usr/local/bin/install-plugins), not executed during the image build. This keeps image size minimal, gives per-environment control, and means a Trivy version pin does not require a full image rebuild"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "containerization",
      "iac",
      "networking",
      "security",
      "documentation"
    ],
    "tech": [
      "Docker",
      "Linux",
      "systemd",
      "GitHub Actions",
      "Nginx",
      "Cloudflare Tunnel",
      "Jenkins",
      "SonarQube",
      "PostgreSQL",
      "Nexus",
      "Bash",
      "GHCR",
      "iximiuz Labs"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/silver-stack"
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
    "title": "End-to-End DevOps: Polyglot Microservices GitOps on EKS",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "10-service polyglot app on Amazon EKS with DevSecOps CI, ArgoCD GitOps, full observability, and autoscaling. 6-phase runbook with 24 decisions and 9 terminal sessions.",
    "description": "Forked Google's Online Boutique (10-service polyglot monorepo), built a production-grade DevOps pipeline from scratch. CI pipeline uses GitHub Actions with monorepo change detection, Trivy security scanning, and GHCR publish. Helm chart packaged from upstream and published to GHCR as an OCI artifact. Deployed via ArgoCD with Image Updater (digest strategy) for continuous delivery. Platform includes Gateway API (single shared ALB, 5 subdomains), ExternalDNS (zero manual DNS records), kube-prometheus-stack with Slack alerting, ELK stack for log aggregation, and HPA autoscaling. Infrastructure provisioned via Terraform on KodeKloud AWS Playground. Documented across 6 runbook phases with 24 architectural decisions, 9 terminal session recordings, and 12 verification screenshots.",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Built 3 GitHub Actions workflows: monorepo change detection with matrix dispatch, Trivy FS + image scanning, Helm chart OCI publish to GHCR",
          "Deployed 10 microservices via ArgoCD from a Helm chart on GHCR, with patch-only values (5 fields) and zero upstream file modifications",
          "Configured Gateway API with a single shared ALB serving 5 subdomains behind one wildcard ACM certificate",
          "Implemented full observability: Prometheus + Grafana + AlertManager (Slack), Elasticsearch + Filebeat + Kibana",
          "Documented 24 architectural decisions, recorded 9 terminal sessions, captured 12 verification screenshots across 6 runbook phases"
        ]
      },
      {
        "title": "Key Decisions",
        "items": [
          "Evolved image tagging through 3 iterations (chart version, SHA, digest), landing on ArgoCD Image Updater after debugging BuildKit epoch timestamp incompatibility",
          "Chose Gateway API over Ingress because the Kubernetes project recommends it and the Ingress API has been frozen",
          "ArgoCD manages the app, not the platform stack. If ArgoCD breaks, Prometheus and Grafana remain operational for debugging",
          "Patch-only Helm values: only 5 fields that differ from upstream. If the default is correct, it is not listed",
          "CI has zero knowledge of the cluster for code pushes. Image Updater owns deployment, eliminating the GIT_TOKEN dependency"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "gitops",
      "observability",
      "iac",
      "kubernetes",
      "networking",
      "security",
      "autoscaling",
      "containerization"
    ],
    "tech": [
      "GitHub Actions",
      "Trivy",
      "Docker",
      "Helm",
      "Kustomize",
      "ArgoCD",
      "Terraform",
      "Amazon EKS",
      "Gateway API",
      "Prometheus",
      "Grafana",
      "Elasticsearch",
      "Kibana",
      "Route 53",
      "GHCR"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/microservices-demo"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/microservices-demo/"
      }
    ],
    "featured": true
  },
  {
    "slug": "retail-store-sample-app",
    "title": "Retail Microservices: End-to-End Platform Engineering on EKS",
    "category": "platform",
    "status": "completed",
    "year": 2026,
    "shortDescription": "Advanced deployment of a 5-service polyglot e-commerce platform on Amazon EKS, leveraging eksctl, Helmfile orchestration, and AWS Managed Services.",
    "description": "Architected and deployed a highly available polyglot microservices architecture on Amazon EKS. Operating within stringent least-privilege IAM boundaries, the infrastructure was provisioned using a hybrid approach: Terraform for precise IAM role definitions, CloudFormation for self-managed worker nodes, and eksctl for the control plane. Implemented production-ready infrastructure patterns by engineering a decoupled, multi-environment release strategy using Helmfile to orchestrate complex deployment dependencies without mutating upstream charts. The platform integrates deeply with native AWS services, utilizing IRSA to securely bind microservices to DynamoDB, SQS, and SNS. The cluster features centralized observability via CloudWatch Container Insights, Prometheus, and Grafana, with external traffic routed through a shared Application Load Balancer using dynamic ACM certificates.",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Authored 3 decoupled Helmfile configurations to orchestrate 5 polyglot microservices without mutating upstream charts",
          "Offloaded state to AWS Managed Services (DynamoDB, SQS, SNS/Lambda) by establishing secure IRSA trust relationships",
          "Overcame strict IAM limits (no iam:PassRole) by manually injecting pre-provisioned Terraform roles and CloudFormation nodes into the eksctl deployment",
          "Shared a single ALB across the application UI, Grafana, and Prometheus endpoints using Ingress grouping",
          "Produced an in-depth codebase analysis and architectural deep-dive to bridge the transition from 3-tier monoliths to microservices"
        ]
      },
      {
        "title": "Key Decisions",
        "items": [
          "Prioritized Helmfile over ArgoCD to master complex release dependencies natively before abstracting behind a GitOps controller",
          "Dev-Machine Administration: Used a fully configured dev-machine for cluster operations while reserving a bastion host strictly for SSH node troubleshooting",
          "Opted for CloudWatch Container Insights over ELK to keep the logging architecture heavily aligned with the native AWS EKS ecosystem",
          "Adopted modern API_AND_CONFIG_MAP authentication alongside gp3 default storage classes for optimized cost and performance"
        ]
      }
    ],
    "tags": [
      "iac",
      "orchestration",
      "kubernetes",
      "cloud-native",
      "observability",
      "networking",
      "microservices"
    ],
    "tech": [
      "Amazon EKS",
      "Terraform",
      "CloudFormation",
      "eksctl",
      "Helmfile",
      "Helm",
      "DynamoDB",
      "SQS",
      "SNS",
      "CloudWatch",
      "Prometheus",
      "Grafana",
      "ALB Ingress Controller"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/retail-store-sample-app"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/projects/deployments/retail-store-sample-app/"
      }
    ],
    "featured": true
  },
  {
    "slug": "bankingapp-java-mysql",
    "title": "BankingApp Java MySQL",
    "category": "platform",
    "status": "completed",
    "year": 2024,
    "shortDescription": "2-tier Spring Boot banking app with Jenkins CI/CD, SonarQube quality gates, Nexus artifact management, and Kubernetes deployment with HPA.",
    "description": "Production-grade deployment of a Spring Boot banking application demonstrating the complete DevOps lifecycle from source to deployment. Implemented Jenkins CI/CD pipeline with SonarQube code quality enforcement, Nexus artifact repository integration, and Kubernetes deployment with Horizontal Pod Autoscaling.",
    "sections": [
      {
        "title": "Key Achievements",
        "items": [
          "Containerized multi-tier Java application; reduced environment setup from 2 hours to docker compose up",
          "Implemented SonarQube quality gate blocking deployment on critical vulnerabilities",
          "Automated artifact versioning via Nexus; eliminated manual JAR management",
          "Configured Jenkins pipeline with parallel stages reducing build time by 40%",
          "Deployed on Kubernetes with Horizontal Pod Autoscaling based on CPU metrics"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "containerization",
      "kubernetes",
      "security"
    ],
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "MySQL",
      "Kubernetes",
      "Spring Boot"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/BankingApp-Java-MySQL"
      }
    ],
    "featured": true
  },
  {
    "slug": "ci-cd-stack",
    "title": "Complete CI/CD Stack",
    "category": "tool",
    "status": "completed",
    "year": 2024,
    "shortDescription": "Self-hosted DevOps environment: Jenkins, SonarQube, Nexus, GitLab orchestrated via Docker Compose. Single-command provisioning.",
    "description": "Self-hosted CI/CD infrastructure stack demonstrating enterprise DevOps tool integration. Orchestrates Jenkins, SonarQube, Nexus, and GitLab via Docker Compose for rapid, reproducible environment provisioning.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Setting up a CI/CD environment from scratch took hours of manual configuration across 4 different tools",
          "Team members could not reproduce the same environment locally, causing CI drift between dev and production"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Single-command provisioning: docker compose up brings up Jenkins, SonarQube, Nexus, and GitLab in minutes",
          "Jenkins shared libraries eliminate pipeline duplication by 70%",
          "LDAP authentication centralized across all 4 services",
          "Automated backup strategy with 7-day retention for artifact repository",
          "Complete setup documentation enabling team onboarding in under 1 hour"
        ]
      }
    ],
    "tags": [
      "ci-cd",
      "containerization"
    ],
    "tech": [
      "Docker",
      "Jenkins",
      "SonarQube",
      "Nexus",
      "GitLab",
      "Nginx"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/ci-cd-stack"
      }
    ],
    "featured": true
  },
  {
    "slug": "debugbox",
    "title": "DebugBox: Variant-Based Kubernetes Debugging Container Suite",
    "category": "tool",
    "status": "maintained",
    "year": 2026,
    "shortDescription": "Open-source Kubernetes debugging container suite with three right-sized variants (14 MB to 104 MB). Multi-arch, Trivy-gated CI, and 20-tag release strategy across GHCR and Docker Hub.",
    "description": "DebugBox is an open-source project that solves a real operational pain: netshoot ships 201 MB whether you need packet forensics or just a DNS check. DebugBox introduces a variant model with lite (14.36 MB), balanced (46.16 MB), and power (104.45 MB), each extending a shared Alpine base layer so you pull exactly what the job needs. CI runs a 4x2 strategy matrix (4 variants x amd64/arm64) on every push, verifies OCI labels, measures compressed image size, runs smoke tests, and Trivy-scans with --exit-code 1. The release pipeline implements a scan-before-push pattern: amd64 tarballs are built and all three variants must pass HIGH/CRITICAL gating before a single tag is pushed. On release, 20 multi-platform tags are atomically published across GHCR and Docker Hub. Fully documented with a versioned MkDocs Material site deployed via mike.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "netshoot (201 MB) is all-or-nothing; on edge clusters or bandwidth-constrained nodes, pulling 201 MB for a DNS check wastes real time and money",
          "Minimal images like busybox and Alpine have no curl, dig, tcpdump, or Kubernetes-aware tooling, leaving engineers installing tools by hand inside ephemeral containers",
          "Existing tools offered no choice; DebugBox introduces the variant model so the image size matches the task, not the worst-case scenario"
        ]
      },
      {
        "title": "Key Decisions",
        "items": [
          "All three variants extend a shared Dockerfile.base (~4 MB Alpine with CA certs, locale, and shell UX via /etc/profile.d/) using FROM debugbox-base; changes to the base propagate to all variants without touching variant Dockerfiles",
          "kubectx and kubens are compiled from source inside a Go multi-stage build stage using CGO_ENABLED=0, -trimpath, and -ldflags=-s -w; the resulting binary is copied into the runtime stage, keeping the final image free of the Go toolchain and avoiding untrusted pre-compiled binary downloads",
          "The release workflow builds amd64 tarballs first, exports them to /tmp/*.tar, runs trivy image --input against all three files with --exit-code 1, and only proceeds to the multi-platform push if every scan exits 0; a vulnerability in any single variant blocks the entire release",
          "Each release publishes 20 tags across GHCR and Docker Hub; every variant gets a pinned version tag for production immutability and a floating latest tag for convenience, and balanced gets additional root aliases (:latest and :VERSION) as the recommended default",
          "CI triggers only on changes to dockerfiles/, tests/, scripts/, the CI workflow file, or .trivyignore; documentation-only commits do not consume CI minutes",
          "fail-fast is set to true on the CI matrix so a single build or scan failure across any of the 8 jobs immediately cancels the rest",
          "Shell helpers are baked in per variant via /etc/profile.d/ scripts; lite gets json(), yaml(), and ll(); balanced adds ports, connections, routes, and k8s-info; power adds sniff(), sniff-http(), sniff-dns(), cert-check(), and conntrack-watch()",
          "make check runs the full quality gate locally: hadolint lint (with Docker fallback if not installed) then build-all then test-all then scan; the same gates run in CI so the local and remote pipelines are identical",
          "Accepted CVEs in .trivyignore are listed with documented justification rather than silently suppressed, keeping the security posture auditable for contributors"
        ]
      },
      {
        "title": "Variants and Tool Coverage",
        "items": [
          "lite (~14 MB): curl, netcat-openbsd, iproute2, iputils, bind-tools (dig, nslookup, host), jq, yq, vi, and shell helpers; designed for DNS and connectivity checks from ephemeral containers",
          "balanced (~46 MB, default): everything in lite plus bash, bash-completion, vim, nano, git, tar, gzip, less, htop, strace, lsof, procps, psmisc, tcpdump, socat, nmap, mtr, iperf3, ethtool, iftop, kubectx, and kubens; covers daily Kubernetes debugging",
          "power (~104 MB): everything in balanced plus tshark, ngrep, tcptraceroute, fping, speedtest-cli, ltrace, openssl, iptables, nftables, conntrack-tools, bird, bridge-utils, and Python 3 with pip3; designed for SRE forensics and deep packet analysis",
          "power at 104 MB is 48% smaller than netshoot at 201 MB; lite at 14 MB is 14x smaller than netshoot"
        ]
      },
      {
        "title": "CI/CD Pipeline",
        "items": [
          "ci.yml runs a 4x2 strategy matrix with QEMU and Buildx for cross-arch builds, OCI label injection via docker/metadata-action, compressed size measurement, ci-smoke.sh validation, and Trivy v0.69.1 scanning with --exit-code 1",
          "release.yml implements a three-stage pattern: Stage 1 builds amd64 tarballs, Stage 2 scans all three variants with trivy image --input, Stage 3 atomically pushes 20 multi-platform tags to GHCR and Docker Hub only after all scans pass; triggered on v*.*.* tag push",
          "docs.yml versions the MkDocs Material site with mike and deploys to GitHub Pages independently so a documentation update never touches the image pipeline"
        ]
      }
    ],
    "tags": [
      "containerization",
      "kubernetes",
      "ci-cd",
      "security",
      "open-source",
      "networking"
    ],
    "tech": [
      "Docker",
      "Alpine Linux",
      "Go",
      "GitHub Actions",
      "Trivy",
      "Docker Buildx",
      "QEMU",
      "GHCR",
      "Docker Hub",
      "MkDocs",
      "Bash",
      "Hadolint"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/debugbox"
      },
      {
        "type": "website",
        "url": "https://debugbox.ibtisam-iq.com"
      }
    ],
    "featured": true
  },
  {
    "slug": "silverstack",
    "title": "SilverStack Dev Machine",
    "category": "tool",
    "status": "maintained",
    "year": 2025,
    "shortDescription": "Custom rootfs micro VM on iximiuz Labs with 15+ DevOps tools pre-installed. Reusable Terraform configs for EKS, VPC, and bastion hosts.",
    "description": "A custom-built cloud-native development workstation and infrastructure code repository. The dev machine is a custom rootfs micro VM on iximiuz Labs with kubectl, eksctl, terraform, helm, helmfile, aws cli, and more pre-installed. Also contains reusable, tested Terraform configurations for EKS on KodeKloud (SCP-aware), VPC, and bastion hosts.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Every new project required 30+ minutes of tool installation on fresh VMs or cloud shells",
          "Tool versions drifted between projects causing subtle compatibility issues",
          "Terraform configs were copy-pasted between repos with no single source of truth"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Custom rootfs image with 15+ DevOps tools pre-installed, tab completion configured, shell aliases ready",
          "Zero setup time: launch the playground and start working immediately",
          "Reusable Terraform modules (EKS, VPC, bastion) tested across multiple projects and KodeKloud SCP constraints",
          "Single repo (silver-stack) as infrastructure code source of truth, cloned into every project"
        ]
      }
    ],
    "tags": [
      "iac",
      "containerization"
    ],
    "tech": [
      "Docker",
      "Terraform",
      "Bash",
      "AWS",
      "Kubernetes"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/silver-stack"
      },
      {
        "type": "playground",
        "url": "https://labs.iximiuz.com/playgrounds/SilverStack-dev-machine-e672bcf7"
      },
      {
        "type": "runbook",
        "url": "https://runbook.ibtisam-iq.com/containers/iximiuz/rootfs/setup-dev-machine-rootfs-image/"
      }
    ],
    "featured": false
  },
  {
    "slug": "custom-ubuntu-rootfs",
    "title": "Custom Ubuntu Rootfs",
    "category": "tool",
    "status": "completed",
    "year": 2024,
    "shortDescription": "Minimal Ubuntu base filesystem for containers. 40% smaller than official images, security-hardened, published to GHCR.",
    "description": "Custom-built Ubuntu root filesystem optimized for container workloads. Focused on minimal attack surface, optimal layer caching for CI/CD pipelines, and reproducible builds.",
    "sections": [
      {
        "title": "Motivation",
        "items": [
          "Official Ubuntu Docker images ship with 180MB+ of packages, most unnecessary for containerized applications",
          "Bloated base images slow CI pipelines, increase attack surface, and waste registry storage"
        ]
      },
      {
        "title": "What It Solves",
        "items": [
          "Built from debootstrap: 110MB, 40% smaller than the official image",
          "Removed 47 unnecessary packages while keeping essential utilities",
          "Automatic security updates via unattended-upgrades",
          "Multi-stage Docker build pattern for optimal layer caching",
          "Published to GHCR with automated versioning via GitHub Actions"
        ]
      }
    ],
    "tags": [
      "containerization",
      "security"
    ],
    "tech": [
      "Docker",
      "Ubuntu",
      "Bash",
      "GitHub Actions"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/custom-ubuntu-rootfs"
      }
    ],
    "featured": false
  },
  {
    "slug": "runbook",
    "title": "Engineering Runbook",
    "category": "reference",
    "status": "maintained",
    "year": 2025,
    "shortDescription": "Production engineering runbook documenting real deployments, troubleshooting, and architectural decisions. Engineering journal format with MkDocs Material.",
    "description": "Personal engineering runbook documenting every project deployment, bug fix, and architectural decision. Written in first-person past tense (engineering journal format) with MkDocs admonition blocks for decisions, terminal session recordings as evidence, and hyperlinked cross-references across runbooks. Covers AWS, Kubernetes, Terraform, CI/CD, GitOps, and observability.",
    "sections": [
      {
        "title": "What It Covers",
        "items": [
          "6-phase microservices-demo runbook with 24 architectural decisions and 9 terminal session recordings",
          "AWS runbooks: Route 53, ACM, EKS provisioning on KodeKloud with SCP constraints",
          "Kubernetes add-on runbooks: ALB Controller, EBS CSI, Gateway API, ExternalDNS, ArgoCD",
          "Infrastructure runbooks: Terraform for EKS, CloudFormation for self-managed nodes, client tool installation"
        ]
      },
      {
        "title": "Writing Approach",
        "items": [
          "Engineering journal format: first person, past tense, recording what was done and why",
          "Bugs documented inline where they happened, not in a separate troubleshooting appendix",
          "Architectural decisions as MkDocs admonition blocks (abstract, info, warning, danger)",
          "Cross-linked ecosystem: runbooks reference each other via hyperlinks, forming a navigable knowledge graph"
        ]
      }
    ],
    "tags": [
      "documentation"
    ],
    "tech": [
      "MkDocs",
      "GitHub Actions",
      "Cloudflare Pages",
      "Python"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/runbook"
      },
      {
        "type": "website",
        "url": "https://runbook.ibtisam-iq.com"
      }
    ],
    "featured": true
  },
  {
    "slug": "nectar",
    "title": "Nectar Documentation Hub",
    "category": "reference",
    "status": "maintained",
    "year": 2024,
    "shortDescription": "Technical knowledge base with 200+ pages covering DevOps tools, cloud platforms, and infrastructure patterns. Built with MkDocs Material.",
    "description": "Centralized documentation platform for DevOps knowledge management. Features automated deployment pipeline with version control and search indexing. Covers Docker, Kubernetes, Terraform, AWS, CI/CD, Linux, networking, and more.",
    "sections": [
      {
        "title": "What It Covers",
        "items": [
          "200+ pages across Docker, Kubernetes, Terraform, AWS, CI/CD, Linux, and networking",
          "Structured content taxonomy with search indexing across all pages",
          "Dark mode theme matching the broader portfolio site design system"
        ]
      },
      {
        "title": "How It Is Built",
        "items": [
          "MkDocs Material with GitHub Actions CI: auto-deploys on push",
          "Cloudflare Pages hosting with CDN, 95+ PageSpeed score and global edge caching",
          "Version-controlled content with full Git history for every page"
        ]
      }
    ],
    "tags": [
      "documentation"
    ],
    "tech": [
      "MkDocs",
      "GitHub Actions",
      "Cloudflare Pages",
      "Python"
    ],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/ibtisam-iq/nectar"
      },
      {
        "type": "website",
        "url": "https://nectar.ibtisam-iq.com"
      }
    ],
    "featured": false
  }
]

export const getProjectsByCategory = (category: Project["category"]) =>
  projects.filter((p) => p.category === category)

export const getProjectsByStatus = (status: Project["status"]) =>
  projects.filter((p) => p.status === status)

export const getProjectsByTech = (tech: string) =>
  projects.filter((p) => p.tech.includes(tech))

export const getFeaturedProjects = () =>
  projects.filter((p) => p.featured)

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
